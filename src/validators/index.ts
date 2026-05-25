import { z } from 'zod';
import { TRANSACTION_REASONS, ROLES } from '../constants';

export const registerSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8)
});

export const inviteUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum([ROLES.ADMIN, ROLES.OPERATOR, ROLES.VIEWER])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const categorySchema = z.object({
  name: z.string().min(1),
  is_active: z.boolean().optional()
});

export const vendorSchema = z.object({
  name: z.string().min(1),
  contact_person: z.string().min(1),
  contact_info: z.object({
    primary_phone: z.string().min(1),
    secondary_phone: z.string().optional(),
    email: z.string().email().optional()
  }),
  location: z.object({
    city: z.string().min(1),
    country: z.string().min(1)
  }),
  lead_time: z.number().int().min(1),
  is_active: z.boolean().optional()
});

export const itemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  quantity_on_hand: z.number().int().min(0),
  minimum_stock_level: z.number().int().min(0),
  cost_price: z.number().min(0),
  selling_price: z.number().min(0),
  category_id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  location: z.string().min(1),
  is_active: z.boolean().optional()
});

export const itemUpdateSchema = itemSchema.partial().omit({ sku: true });

export const transactionSchema = z.object({
  item_id: z.string().uuid(),
  quantity_change: z.number().int(),
  reason: z.enum(TRANSACTION_REASONS)
});

export const paginationQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('20'),
  search: z.string().optional(),
  sort_by: z.string().optional(),
  sort_dir: z.enum(['asc', 'desc']).optional().default('asc')
});

export const itemsQuerySchema = paginationQuerySchema.extend({
  category: z.string().uuid().optional(),
  vendor: z.string().uuid().optional(),
  low_stock: z.string().transform(val => val === 'true').optional()
});

export const transactionsQuerySchema = paginationQuerySchema.extend({
  inbound: z.string().transform(val => val === 'true').optional(),
  outbound: z.string().transform(val => val === 'true').optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});
