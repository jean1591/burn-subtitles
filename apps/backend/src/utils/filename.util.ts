import * as path from 'path';

export function sanitizeFilename(filename: string): string {
  // Remove any path components
  const basename = path.basename(filename);

  // Replace any non-alphanumeric characters (except dots and hyphens) with underscores
  const sanitized = basename.replace(/[^a-zA-Z0-9.-]/g, '_');

  // Ensure the extension is .srt
  const ext = path.extname(sanitized).toLowerCase();
  if (ext !== '.srt') {
    throw new Error('Invalid file extension');
  }

  return sanitized;
}
