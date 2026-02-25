// src/utils/panelObserver.ts
export class PanelObserver {
  private observer: MutationObserver | null = null;
  private isActive: boolean = false;
  private widthPercent: number = 60;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private retryTimeouts: ReturnType<typeof setTimeout>[] = [];

  constructor() {}

  setWidthPercent(widthPercent: number): void {
    const next = Number.isFinite(widthPercent) ? Math.trunc(widthPercent) : 60;
    this.widthPercent = Math.min(100, Math.max(1, next));

    if (this.isActive) {
      this.setPanelWidth();
    }
  }

  start(): void {
    if (this.observer || !this.shouldRunOnCurrentPage()) {
      return;
    }

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
    this.clearRetries();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isActive = false;
  }

  private clearRetries(): void {
    for (const t of this.retryTimeouts) clearTimeout(t);
    this.retryTimeouts = [];
  }

  /**
   * When the panel or Monaco isn't in the DOM yet, retry a few times with delays
   * so we still apply the width once they render.
   */
  private scheduleRetries(): void {
    this.clearRetries();
    const delays = [200, 500];
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
    return (
      href.includes("make.powerautomate.com") && href.includes("run")
    );
  }

  private setPanelWidth(): void {
    const panels = document.getElementsByClassName("ms-Panel-main");
    let panelMain: HTMLElement | null = null;
    for (let i = 0; i < panels.length; i++) {
      const el = panels[i] as HTMLElement;
      // Only expand the panel that contains the raw JSON/code view (Monaco editor lines)
      if (el.querySelector(".view-line") != null) {
        panelMain = el;
        break;
      }
    }
    if (panelMain) {
      this.clearRetries();
      panelMain.style.width = `${this.widthPercent}%`;
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
