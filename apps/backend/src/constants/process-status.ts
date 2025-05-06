// [REMINDER] Make sure to update the frontend enum when changing these

// Process status enum for batch processing states
export enum ProcessStatus {
  PROCESSING_COMPLETED = 'processing_completed',
  PROCESSING_FAILED = 'processing_failed',
  PROCESSING_STARTED = 'processing_started',
  QUEUE = 'queue',
  ZIPPING = 'zipping',
}

// Job status enum for individual translation job states
export enum JobStatus {
  DONE = 'done',
  ERROR = 'error',
  IN_PROGRESS = 'in_progress',
  QUEUED = 'queued',
}

// Zip status enum for zip generation states
export enum ZipStatus {
  DONE = 'done',
  QUEUED = 'queued',
}
