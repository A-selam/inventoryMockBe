export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'operator' | 'viewer';
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  vendor_total: number;
  is_active: boolean;
}

export interface VendorContactInfo {
  primary_phone: string;
  secondary_phone?: string;
  email?: string;
}

export interface VendorLocation {
  city: string;
  country: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person: string;
  contact_info: VendorContactInfo;
  location: VendorLocation;
  lead_time: number;
  is_active: boolean;
}

export interface Item {
  id: string;
  sku: string;
  name: string;
  description: string;
  quantity_on_hand: number;
  minimum_stock_level: number;
  cost_price: number;
  selling_price: number;
  category_id: string;
  vendor_id: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type TransactionReason =
  | 'received stock'
  | 'sold'
  | 'damaged'
  | 'audit correction';

export interface Transaction {
  id: string;
  item_id: string;
  quantity_change: number;
  reason: TransactionReason;
  timestamp: string;
  user_id: string;
}

export interface ImportHistory {
  id: string;
  filename: string;
  status: 'success' | 'failed';
  records: number;
  errors: Array<{ row: number; field: string; message: string }>;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  data: T[];
}

export interface DashboardStockMovement {
  month: string;
  stock_in: number;
  stock_out: number;
}

export interface DashboardRecentTransaction {
  id: string;
  item: string;
  sku: string;
  transaction_type: 'INBOUND' | 'OUTBOUND';
  quantity_change: number;
  created_at: string;
}

export interface DashboardStats {
  total_items: number;
  low_stock: number;
  inventory_value: number;
  active_vendors: number;
  stock_movement_chart: DashboardStockMovement[];
  recent_transactions: DashboardRecentTransaction[];
}

export interface Alert {
  item_name: string;
  stock: number;
  threshold: number;
  severity: 'warning' | 'critical';
}

export interface ReplenishmentItem {
  id: string;
  sku: string;
  name: string;
  current_stock: number;
  threshold: number;
  reorder_quantity: number;
  cost_price: number;
  vendor_id: string;
  category_id: string;
}

export interface ReplenishmentStats {
  total_reorder_value: number;
  out_of_stock: number;
  pending_order: number;
  critical_low_stock: number;
  items: ReplenishmentItem[];
}
