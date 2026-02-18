// src/utils/panelObserver.ts
export class PanelObserver {
  private observer: MutationObserver | null = null;
  private isActive: boolean = false;
  private widthPercent: number = 60;

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

    // Create observer with the working logic
    this.observer = new MutationObserver(() => {
      if (!this.isActive) return;

      this.setPanelWidth();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Check existing panels immediately
    this.setPanelWidth();
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isActive = false;
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
      panelMain.style.width = `${this.widthPercent}%`;
    }
  }

  isRunning(): boolean {
    return this.isActive && this.observer !== null;
  }
}
