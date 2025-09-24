// Application constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];
export const SUPPORTED_FILE_EXTENSIONS = ['.pdf'];

// API endpoints
export const API_ENDPOINTS = {
  ANALYZE: '/api/analyze/summarize',
  RESULTS: '/api/analyze/results',
} as const;

// Analysis status
export const ANALYSIS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// UI messages
export const MESSAGES = {
  FILE_TOO_LARGE: 'File size must be less than 10MB.',
  INVALID_FILE_TYPE: 'Please upload a PDF file only.',
  ANALYSIS_FAILED: 'Failed to analyze PDF. Please try again.',
  NO_FILE_SELECTED: 'Please select a file before analyzing.',
  ANALYSIS_SUCCESS: 'Analysis completed successfully!',
} as const;
