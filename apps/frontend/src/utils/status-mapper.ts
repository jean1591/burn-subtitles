import { UIStatus } from "../constants/process-status";

// TranslationStatus from backend
export enum TranslationStatus {
  QUEUED = "queued",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  ERROR = "error",
}

/**
 * Maps backend TranslationStatus to frontend UIStatus
 * @param status The translation status from the backend
 * @returns The corresponding UIStatus for display
 */
export const mapTranslationStatusToUI = (
  status: TranslationStatus
): UIStatus => {
  switch (status) {
    case TranslationStatus.QUEUED:
      return UIStatus.QUEUE;
    case TranslationStatus.IN_PROGRESS:
      return UIStatus.STARTED;
    case TranslationStatus.DONE:
      return UIStatus.COMPLETED;
    case TranslationStatus.ERROR:
      return UIStatus.ERROR;
    default:
      return UIStatus.UNKNOWN;
  }
};
