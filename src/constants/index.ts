export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer'
} as const;

export const TRANSACTION_REASONS = [
  'received stock',
  'sold',
  'damaged',
  'audit correction'
] as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  VENDOR_HAS_ITEMS: 'VENDOR_HAS_ITEMS',
  DUPLICATE_SKU: 'DUPLICATE_SKU',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
} as const;
