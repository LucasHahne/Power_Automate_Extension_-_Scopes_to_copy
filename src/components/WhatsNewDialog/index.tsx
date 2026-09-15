import type { MouseEvent } from "react";
import { CHROME_STORE_REVIEWS_URL, WHATS_NEW } from "../../config/whatsNew";

interface WhatsNewDialogProps {
  /** Version to show in the header (usually the manifest version). */
  version: string;
  /** Called when the dialog should be dismissed and marked as seen. */
  onDismiss: () => void;
}

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function WhatsNewDialog({
  version,
  onDismiss,
}: WhatsNewDialogProps) {
  const handleReviewClick = () => {
    window.open(CHROME_STORE_REVIEWS_URL, "_blank", "noopener,noreferrer");
    onDismiss();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e: MouseEvent<HTMLDivElement>) =>
        e.target === e.currentTarget && onDismiss()
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby="whats-new-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-4 space-y-3"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3
              id="whats-new-title"
              className="text-lg font-semibold text-gray-900"
            >
              What&rsquo;s new
            </h3>
            <span className="text-sm text-gray-500">v{version}</span>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700">
          {WHATS_NEW.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>

        <p className="text-sm text-gray-600">
          Enjoying the extension? A quick review on the Chrome Web Store really
          helps and motivates.
        </p>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="py-2 px-3 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 transition-colors"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={handleReviewClick}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 transition-colors"
          >
            <StarIcon />
            Leave a review
          </button>
        </div>
      </div>
    </div>
  );
}
