// src/utils/expressionWindowObserver.ts
const EXPRESSION_DIALOG_MIN_WIDTH_PX = 580;

/**
 * Finds the expression callout dialog (div with role="dialog" and ms-Callout-main)
 * and sets min-width on its first child div (the inner content container).
 */
function applyExpressionWindowMinWidth(): void {
  const dialog = document.querySelector('div[role="dialog"].ms-Callout-main');
  if (!dialog?.firstElementChild || !(dialog.firstElementChild instanceof HTMLElement)) {
    return;
  }
  const inner = dialog.firstElementChild as HTMLElement;
  inner.style.minWidth = `${EXPRESSION_DIALOG_MIN_WIDTH_PX}px`;
}

function clearExpressionWindowMinWidth(): void {
  const dialog = document.querySelector('div[role="dialog"].ms-Callout-main');
  if (!dialog?.firstElementChild || !(dialog.firstElementChild instanceof HTMLElement)) {
    return;
  }
  const inner = dialog.firstElementChild as HTMLElement;
  inner.style.minWidth = "";
}

export class ExpressionWindowObserver {
  private observer: MutationObserver | null = null;
  private isActive = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  setActive(active: boolean): void {
    if (this.isActive === active) return;
    this.isActive = active;

    if (active) {
      this.start();
    } else {
      this.stop();
      clearExpressionWindowMinWidth();
    }
  }

  start(): void {
    if (!this.isActive) return;
    if (this.observer) return;

    const debounceMs = 100;
    const run = (): void => {
      if (!this.isActive) return;
      applyExpressionWindowMinWidth();
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
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
