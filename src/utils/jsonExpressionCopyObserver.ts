// src/utils/jsonExpressionCopyObserver.ts
import {
  collectViewLines,
  formatExpression,
  resolveClickedExpressionPath,
} from "./jsonExpressionPath";

const TOAST_ID = "pa-scopes-expression-toast";
const TOAST_DURATION_MS = 2200;

/**
 * When active, a single click on a key or value inside the run-history JSON
 * viewer copies the matching Power Automate `outputs('Action')?[...]` expression
 * to the clipboard and shows a short toast. Uses capture-phase click delegation
 * and never calls preventDefault, so Monaco keeps its normal selection behavior.
 */
export class JsonExpressionCopyObserver {
  private active = false;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly clickHandler = (e: MouseEvent) => this.onClick(e);

  setActive(active: boolean): void {
    if (this.active === active) return;
    if (active) this.start();
    else this.stop();
  }

  start(): void {
    if (this.active) return;
    this.active = true;
    document.addEventListener("click", this.clickHandler, true);
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    document.removeEventListener("click", this.clickHandler, true);
    this.removeToast();
  }

  isRunning(): boolean {
    return this.active;
  }

  private onClick(e: MouseEvent): void {
    if (!this.active) return;
    const target = e.target as HTMLElement | null;
    if (!target || typeof target.closest !== "function") return;

    const viewLine = target.closest<HTMLElement>(".view-line");
    if (!viewLine) return;
    const linesContainer =
      viewLine.closest(".monaco-editor") ??
      viewLine.closest(".lines-content") ??
      viewLine.closest(".view-lines");
    if (!linesContainer) return;

    const actionName = this.findActionName(viewLine);
    if (!actionName) {
      this.showToast("Could not find the action name", true);
      return;
    }

    const lines = collectViewLines(linesContainer);
    const idx = lines.findIndex((l) => l.element === viewLine);
    if (idx < 0) return;

    const path = resolveClickedExpressionPath(
      lines,
      idx,
      offsetInViewLine(viewLine, e),
    );
    if (!path) {
      this.showToast("Could not build an expression here", true);
      return;
    }

    const expression = formatExpression(actionName, path, lines);
    this.copyToClipboard(expression);
    this.showToast(expression, false, e.clientX, e.clientY);
  }

  /** Reads the action name from the panel header (falls back to any panel header). */
  private findActionName(fromEl: HTMLElement): string | null {
    const panel = fromEl.closest(".ms-Panel-main");
    const header =
      panel?.querySelector<HTMLElement>('h1[id$="-headerText"]') ??
      panel?.querySelector<HTMLElement>("h1.ba-Panel-headerText") ??
      document.querySelector<HTMLElement>('h1[id$="-headerText"]') ??
      document.querySelector<HTMLElement>("h1.ba-Panel-headerText");
    const name = header?.textContent?.trim();
    return name && name.length > 0 ? name : null;
  }

  private copyToClipboard(text: string): void {
    try {
      const clip = navigator.clipboard;
      if (clip?.writeText) {
        clip.writeText(text).catch(() => this.fallbackCopy(text));
        return;
      }
    } catch {
      // fall through to legacy copy
    }
    this.fallbackCopy(text);
  }

  private fallbackCopy(text: string): void {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch {
      // give up silently; toast still reports the expression
    }
  }

  private removeToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    document.getElementById(TOAST_ID)?.remove();
  }

  private showToast(
    message: string,
    isError: boolean,
    x?: number,
    y?: number,
  ): void {
    this.removeToast();

    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = isError ? message : `Copied: ${message}`;

    const left = x != null ? Math.min(x + 12, window.innerWidth - 360) : 16;
    const top = y != null ? Math.max(y + 12, 12) : 16;

    Object.assign(toast.style, {
      position: "fixed",
      left: `${Math.max(8, left)}px`,
      top: `${top}px`,
      zIndex: "2147483647",
      maxWidth: "340px",
      padding: "8px 12px",
      borderRadius: "6px",
      background: isError ? "#7f1d1d" : "#1f2937",
      color: "#ffffff",
      font: '12px/1.4 Consolas, "Courier New", monospace',
      boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
      wordBreak: "break-all",
      pointerEvents: "none",
    } as CSSStyleDeclaration);

    document.body.appendChild(toast);
    this.toastTimer = setTimeout(() => this.removeToast(), TOAST_DURATION_MS);
  }
}

interface CaretPoint {
  node: Node;
  offset: number;
}

function caretFromPoint(x: number, y: number): CaretPoint | null {
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  if (typeof doc.caretRangeFromPoint === "function") {
    const range = doc.caretRangeFromPoint(x, y);
    if (range) return { node: range.startContainer, offset: range.startOffset };
  }
  if (typeof doc.caretPositionFromPoint === "function") {
    const pos = doc.caretPositionFromPoint(x, y);
    if (pos) return { node: pos.offsetNode, offset: pos.offset };
  }
  return null;
}

function textOffsetInElement(root: HTMLElement, targetNode: Node, targetOffset: number): number | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent ?? "";
    if (node === targetNode) return offset + targetOffset;
    if (targetNode instanceof Element && targetNode.contains(node)) return offset;
    offset += text.length;
  }
  return null;
}

/** Character offset inside a Monaco `.view-line` (NBSP counts as one, same as spaces). */
function offsetInViewLine(viewLine: HTMLElement, event: MouseEvent): number {
  const caret = caretFromPoint(event.clientX, event.clientY);
  if (caret && viewLine.contains(caret.node)) {
    const fromCaret = textOffsetInElement(viewLine, caret.node, caret.offset);
    if (fromCaret !== null) return fromCaret;
  }

  const target = event.target;
  if (target instanceof Node && viewLine.contains(target)) {
    const fromTarget = textOffsetInElement(viewLine, target, 0);
    if (fromTarget !== null) return fromTarget;
  }

  const text = (viewLine.textContent ?? "").replace(/\u00a0/g, " ");
  return text.length - text.trimStart().length;
}
