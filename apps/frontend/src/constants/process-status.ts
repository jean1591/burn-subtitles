// Process status enum for batch processing states
export enum ProcessStatus {
  PROCESSING_COMPLETED = "processing_completed",
  PROCESSING_FAILED = "processing_failed",
  PROCESSING_STARTED = "processing_started",
  QUEUE = "queue",
  ZIPPING = "zipping",
}

// UI status values mapped from backend status
export enum UIStatus {
  COMPLETED = "completed",
  ERROR = "error",
  FAILED = "failed",
  QUEUE = "queue",
  STARTED = "started",
  UNKNOWN = "unknown",
  ZIPPING = "zipping",
}

// Job status enum for individual translation job states
export enum JobStatus {
  DONE = "done",
  ERROR = "error",
  IN_PROGRESS = "in_progress",
  QUEUED = "queued",
}
