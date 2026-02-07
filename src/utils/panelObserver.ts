// src/utils/panelObserver.ts
export class PanelObserver {
  private observer: MutationObserver | null = null;
  private isActive: boolean = false;

  constructor() {}

  start(): void {
    if (this.observer || !this.shouldRunOnCurrentPage()) {
      return;
    }

    this.isActive = true;

    // Create observer with the working logic
    this.observer = new MutationObserver(() => {
      if (!this.isActive) return;

      const panelMain = document.getElementsByClassName(
        "ms-Panel-main",
      )[0] as HTMLElement;

      if (panelMain) {
        panelMain.style.width = "60%";
      }
      // Don't disconnect - keep observing for new panels
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Check existing panels immediately
    this.checkExistingPanels();
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isActive = false;
  }

  private shouldRunOnCurrentPage(): boolean {
    return window.location.href.includes("make.powerautomate.com");
  }

  private checkExistingPanels(): void {
    const panelMain = document.getElementsByClassName(
      "ms-Panel-main",
    )[0] as HTMLElement;

    if (panelMain) {
      panelMain.style.width = "60%";
    }
  }

  isRunning(): boolean {
    return this.isActive && this.observer !== null;
  }
}
