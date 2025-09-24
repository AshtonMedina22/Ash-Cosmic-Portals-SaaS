import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants';

export interface PDFValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PDFMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

/**
 * Validates a PDF file for size and type
 */
export const validatePDFFile = (file: File): PDFValidationResult => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a PDF file only.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB.',
    };
  }

  return { isValid: true };
};

/**
 * Extracts metadata from a PDF file
 */
export const extractPDFMetadata = (file: File): PDFMetadata => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generates a unique filename for uploaded files
 */
export const generateUniqueFilename = (originalName: string, userId: string): string => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `${userId}_${timestamp}.${extension}`;
};

/**
 * Checks if a file is a PDF based on its name
 */
export const isPDFFile = (filename: string): boolean => {
  return filename.toLowerCase().endsWith('.pdf');
};

/**
 * Sanitizes filename for safe storage
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};
