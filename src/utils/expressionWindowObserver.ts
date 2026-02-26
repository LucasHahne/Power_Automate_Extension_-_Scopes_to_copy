// src/utils/expressionWindowObserver.ts
const APPLY_WIDTH_DEBOUNCE_MS = 150;
const DEFAULT_WIDTH_PERCENT = 50;

/**
 * Finds the expression callout dialog. Tries role="dialog" + ms-Callout-main first, then ms-Callout-main.
 */
function findExpressionDialog(): HTMLElement | null {
  const dialog =
    document.querySelector<HTMLElement>('div[role="dialog"].ms-Callout-main') ??
    document.querySelector<HTMLElement>("div.ms-Callout-main");
  return dialog;
}

export class ExpressionWindowObserver {
  private observer: MutationObserver | null = null;
  private isActive = false;
  private widthPercent = DEFAULT_WIDTH_PERCENT;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private applyWidthTimer: ReturnType<typeof setTimeout> | null = null;

  setWidthPercent(widthPercent: number): void {
    const next = Number.isFinite(widthPercent) ? Math.trunc(widthPercent) : DEFAULT_WIDTH_PERCENT;
    this.widthPercent = Math.min(100, Math.max(1, next));

    if (!this.isActive) return;

    if (this.applyWidthTimer) clearTimeout(this.applyWidthTimer);
    this.applyWidthTimer = setTimeout(() => {
      this.applyWidthTimer = null;
      this.applyExpressionWindowWidth();
    }, APPLY_WIDTH_DEBOUNCE_MS);
  }

  setActive(active: boolean): void {
    if (this.isActive === active) return;
    this.isActive = active;

    if (active) {
      this.start();
    } else {
      this.stop();
      this.clearExpressionWindowWidth();
    }
  }

  start(): void {
    if (!this.isActive) return;
    if (this.observer) return;

    const debounceMs = 100;
    const run = (): void => {
      if (!this.isActive) return;
      this.applyExpressionWindowWidth();
    };

    this.observer = new MutationObserver(() => {
      if (!this.isActive) return;
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null;
        run();
      }, debounceMs);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    run();
  }

  stop(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.applyWidthTimer) {
      clearTimeout(this.applyWidthTimer);
      this.applyWidthTimer = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isActive = false;
    this.clearExpressionWindowWidth();
  }

  private clearExpressionWindowWidth(): void {
    const dialog = findExpressionDialog();
    if (!dialog) return;
    requestAnimationFrame(() => {
      dialog.style.removeProperty("width");
      dialog.style.removeProperty("min-width");
      dialog.style.removeProperty("max-width");
      const inner = dialog.firstElementChild instanceof HTMLElement ? dialog.firstElementChild : null;
      if (inner) {
        inner.style.removeProperty("width");
        inner.style.removeProperty("min-width");
        inner.style.removeProperty("max-width");
      }
    });
  }

  private applyExpressionWindowWidth(): void {
    if (!this.isActive) return;
    const dialog = findExpressionDialog();
    if (!dialog) return;

    const targetWidth = `${this.widthPercent}%`;
    if (dialog.style.getPropertyValue("width") === targetWidth) return;

    requestAnimationFrame(() => {
      if (!this.isActive) return;
      dialog.style.setProperty("width", targetWidth, "important");
      dialog.style.setProperty("min-width", targetWidth, "important");
      dialog.style.setProperty("max-width", targetWidth, "important");
      const inner = dialog.firstElementChild instanceof HTMLElement ? dialog.firstElementChild : null;
      if (inner) {
        inner.style.setProperty("width", targetWidth, "important");
        inner.style.setProperty("min-width", targetWidth, "important");
        inner.style.setProperty("max-width", targetWidth, "important");
      }
    });
  }
}
