// src/utils/panelObserver.ts
const APPLY_WIDTH_DEBOUNCE_MS = 150;

export class PanelObserver {
  private observer: MutationObserver | null = null;
  private isActive: boolean = false;
  private widthPercent: number = 60;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private applyWidthTimer: ReturnType<typeof setTimeout> | null = null;
  private retryTimeouts: ReturnType<typeof setTimeout>[] = [];

  constructor() {}

  setWidthPercent(widthPercent: number): void {
    const next = Number.isFinite(widthPercent) ? Math.trunc(widthPercent) : 60;
    this.widthPercent = Math.min(100, Math.max(1, next));

    if (!this.isActive) return;

    if (this.applyWidthTimer) clearTimeout(this.applyWidthTimer);
    this.applyWidthTimer = setTimeout(() => {
      this.applyWidthTimer = null;
      this.setPanelWidth();
    }, APPLY_WIDTH_DEBOUNCE_MS);
  }

  start(): void {
    if (this.observer) {
      return;
    }
    // Start even when not yet on run page so we apply when user navigates there (e.g. SPA)
    this.isActive = true;

    const debounceMs = 120;
    const runSetPanelWidth = (): void => {
      if (!this.isActive) return;
      this.setPanelWidth();
    };

    this.observer = new MutationObserver(() => {
      if (!this.isActive) return;

      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null;
        runSetPanelWidth();
      }, debounceMs);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Run immediately, then schedule retries in case panel/Monaco appear later
    runSetPanelWidth();
    this.scheduleRetries();
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
    this.clearRetries();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isActive = false;
    const panel = this.findExpandablePanel();
    if (panel) {
      const el = panel;
      requestAnimationFrame(() => {
        el.style.width = "";
      });
    }
  }

  private clearRetries(): void {
    for (const t of this.retryTimeouts) clearTimeout(t);
    this.retryTimeouts = [];
  }

  /**
   * When the panel or Monaco isn't in the DOM yet, retry with delays so we still
   * apply the width once they render (e.g. SPA load, panel opened by user).
   * Longer delays cover first-load and slow networks.
   */
  private scheduleRetries(): void {
    this.clearRetries();
    const delays = [200, 500, 1000, 1500];
    delays.forEach((delayMs) => {
      const id = setTimeout(() => {
        this.retryTimeouts = this.retryTimeouts.filter((t) => t !== id);
        if (!this.isActive) return;
        this.setPanelWidth();
      }, delayMs);
      this.retryTimeouts.push(id);
    });
  }

  private shouldRunOnCurrentPage(): boolean {
    const href = window.location.href;
    return href.includes("make.powerautomate.com") && href.includes("run");
  }

  private findExpandablePanel(): HTMLElement | null {
    const panels = document.getElementsByClassName("ms-Panel-main");
    for (let i = 0; i < panels.length; i++) {
      const el = panels[i] as HTMLElement;
      if (el.querySelector(".view-line") != null) return el;
    }
    return null;
  }

  private setPanelWidth(): void {
    if (!this.isActive) return;
    const panelMain = this.findExpandablePanel();
    if (panelMain) {
      const targetWidth = `${this.widthPercent}%`;
      const currentWidth = panelMain.style.width;
      const earlyReturn = currentWidth === targetWidth;

      if (earlyReturn) return;
      this.clearRetries();
      const el = panelMain;
      requestAnimationFrame(() => {
        if (!this.isActive) return;
        if (el.style.width === targetWidth) return;
        el.style.width = targetWidth;
      });
    } else if (this.isActive && this.shouldRunOnCurrentPage()) {
      // Panel not found yet; ensure we have retries scheduled (e.g. after tab focus or late-open panel)
      if (this.retryTimeouts.length === 0) {
        this.scheduleRetries();
      }
    }
  }

  isRunning(): boolean {
    return this.isActive && this.observer !== null;
  }
}
