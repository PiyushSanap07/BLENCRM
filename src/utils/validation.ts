/**
 * Validation utilities for BLENDIGITAL CRM
 * Enforces Indian 10-digit mobile numbers, INR costs, and lead scores.
 */

export interface ValidationResult<T = any> {
  isValid: boolean;
  error?: string;
  value?: T;
}

/**
 * Validates an Indian 10-digit mobile number.
 * Accepts formats like:
 * - 9876543210
 * - +91 9876543210 / +91-98765-43210
 * - 09876543210
 * - 919876543210
 * Must resolve to a 10-digit number starting with 6, 7, 8, or 9.
 */
export function validateIndianPhone(phone: string): ValidationResult<string> {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      error: 'Phone number is required.',
    };
  }

  // Strip spaces, dashes, parentheses
  let cleaned = phone.trim().replace(/[\s\-().]/g, '');

  // Handle +91 or 91 country code
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Check 10 digits starting with 6-9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210).',
    };
  }

  return {
    isValid: true,
    value: cleaned,
  };
}

/**
 * Formats a 10-digit Indian phone number into standard "+91 XXXXX XXXXX"
 */
export function formatIndianPhone(phone: string): string {
  if (!phone) return '';
  const validation = validateIndianPhone(phone);
  if (!validation.isValid || !validation.value) return phone;
  const v = validation.value;
  return `+91 ${v.slice(0, 5)} ${v.slice(5)}`;
}

/**
 * Validates an Indian Rupee (INR) cost / amount field.
 * Ensures the value is provided and is a valid non-negative number.
 */
export function validateIndianCurrency(
  value: string | number,
  fieldName: string = 'Amount',
  options: { allowZero?: boolean; min?: number } = {}
): ValidationResult<number> {
  const { allowZero = true, min = 0 } = options;

  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      error: `${fieldName} is required in Indian Rupees (₹).`,
    };
  }

  const num = typeof value === 'number' ? value : Number(value);

  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number in Indian Rupees (₹).`,
    };
  }

  if (num < 0) {
    return {
      isValid: false,
      error: `${fieldName} cannot be negative.`,
    };
  }

  if (!allowZero && num <= 0) {
    return {
      isValid: false,
      error: `${fieldName} is required and must be greater than ₹0.`,
    };
  }

  if (min > 0 && num < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ₹${min.toLocaleString('en-IN')}.`,
    };
  }

  return {
    isValid: true,
    value: num,
  };
}

/**
 * Validates Lead Score (must be required integer between 0 and 100).
 */
export function validateLeadScore(score: string | number): ValidationResult<number> {
  if (score === '' || score === null || score === undefined) {
    return {
      isValid: false,
      error: 'Lead score is required (0 - 100).',
    };
  }

  const num = typeof score === 'number' ? score : Number(score);

  if (isNaN(num) || !Number.isInteger(num)) {
    return {
      isValid: false,
      error: 'Lead score must be a whole number between 0 and 100.',
    };
  }

  if (num < 0 || num > 100) {
    return {
      isValid: false,
      error: 'Lead score must be between 0 and 100.',
    };
  }

  return {
    isValid: true,
    value: num,
  };
}

/**
 * Formats numbers into Indian numbering format with Rupee symbol (₹).
 * E.g., 150000 -> ₹1,50,000
 */
export function formatINR(amount: number | string): string {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}
