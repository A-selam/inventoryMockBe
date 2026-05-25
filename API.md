# Inventory Management Mock Backend - API Documentation

## Base URL

```
http://localhost:4000/api/v1
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

## 1. Authentication

### 1.1 Register User

**POST** `/auth/register`

**Request:**

```json
{
  "token": "validInvitationToken",
  "password": "12345678"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User accepted invitation successfully",
  "data": {
    "id": "uuid",
    "name": "Mahlet Solomon",
    "email": "mahlet@gmail.com",
    "role": "operator"
  }
}
```

### 1.2 Login User

**POST** `/auth/login`

**Request:**

```json
{
  "email": "admin@inventory.com",
  "password": "admin123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "jwt-token-here",
    "token_type": "bearer",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@inventory.com",
      "role": "admin"
    }
  }
}
```

---

## 2. Users

### 2.1 Invite User (Admin Only)

**POST** `/users/invite`

**Request:**

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "viewer"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User invited successfully",
  "data": {
    "id": "uuid",
    "name": "New User",
    "email": "newuser@example.com",
    "role": "viewer"
  }
}
```

### 2.2 List Users

**GET** `/users?page=1&limit=20&role=operator&search=john`

**Query Params:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `role`: Filter by role (admin/operator/viewer)
- `search`: Search by name or email

**Response (200):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "total_users": 45,
    "active_now": 7,
    "pending_invites": 4,
    "data": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "total_pages": 3,
      "data": [
        {
          "id": "uuid",
          "name": "User Name",
          "email": "user@example.com",
          "role": "operator"
        }
      ]
    }
  }
}
```

---

## 3. Categories

### 3.1 List Categories

**GET** `/categories?page=1&limit=20&search=electronics&sort_by=name&sort_dir=asc`

**Query Params:**

- `page`: Page number
- `limit`: Items per page
- `search`: Search by name
- `sort_by`: Field to sort by
- `sort_dir`: Sort direction (asc/desc)

**Response (200):**

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "total_pages": 1,
    "data": [
      {
        "id": "uuid",
        "name": "Electronics",
        "created_at": "2025-01-01T00:00:00.000Z",
        "vendor_total": 3,
        "is_active": true
      }
    ]
  }
}
```

### 3.2 Get Category by ID

**GET** `/categories/:id`

**Response (200):**

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Electronics",
    "created_at": "2025-01-01T00:00:00.000Z",
    "vendor_total": 3,
    "is_active": true
  }
}
```

### 3.3 Create Category (Admin/Operator)

**POST** `/categories`

**Request:**

```json
{
  "name": "New Category",
  "is_active": true
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "New Category",
    "created_at": "2026-05-24T00:00:00.000Z",
    "vendor_total": 0,
    "is_active": true
  }
}
```

### 3.4 Update Category (Admin/Operator)

**PATCH** `/categories/:id`

**Request:**

```json
{
  "name": "Updated Category Name"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Category Name",
    "created_at": "2025-01-01T00:00:00.000Z",
    "vendor_total": 3,
    "is_active": true
  }
}
```

### 3.5 Delete Category (Admin Only)

**DELETE** `/categories/:id`

**Response (200):**

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 4. Vendors

### 4.1 List Vendors

**GET** `/vendors?page=1&limit=20&search=samsung&sort_by=name&sort_dir=asc`

**Query Params:**

- `page`: Page number
- `limit`: Items per page
- `search`: Search by name or contact person
- `sort_by`: Field to sort by
- `sort_dir`: Sort direction

**Response (200):**

```json
{
  "success": true,
  "message": "Vendors retrieved successfully",
  "data": {
    "total": 18,
    "page": 1,
    "limit": 20,
    "total_pages": 1,
    "data": [
      {
        "id": "uuid",
        "name": "Samsung Supplier",
        "contact_person": "John Doe",
        "contact_info": {
          "primary_phone": "+251911111111",
          "secondary_phone": "+251922222222",
          "email": "supplier@samsung.com"
        },
        "location": {
          "city": "Addis Ababa",
          "country": "Ethiopia"
        },
        "lead_time": 7,
        "is_active": true
      }
    ]
  }
}
```

### 4.2 Get Vendor by ID

**GET** `/vendors/:id`

**Response (200):**

```json
{
  "success": true,
  "message": "Vendor retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Samsung Supplier",
    "contact_person": "John Doe",
    "contact_info": {
      "primary_phone": "+251911111111",
      "secondary_phone": "+251922a222222",
      "email": "supplier@samsung.com"
    },
    "location": {
      "city": "Addis Ababa",
      "country": "Ethiopia"
    },
    "lead_time": 7,
    "is_active": true
  }
}
```

### 4.3 Create Vendor (Admin/Operator)

**POST** `/vendors`

**Request:**

```json
{
  "name": "New Supplier Inc.",
  "contact_person": "Jane Smith",
  "contact_info": {
    "primary_phone": "+251911000000",
    "secondary_phone": "+251922000000",
    "email": "contact@newsupplier.com"
  },
  "location": {
    "city": "Addis Ababa",
    "country": "Ethiopia"
  },
  "lead_time": 5,
  "is_active": true
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Vendor created successfully",
  "data": {
    "id": "uuid",
    "name": "New Supplier Inc.",
    "contact_person": "Jane Smith",
    "contact_info": {
      "primary_phone": "+251911000000",
      "secondary_phone": "+251922000000",
      "email": "contact@newsupplier.com"
    },
    "location": {
      "city": "Addis Ababa",
      "country": "Ethiopia"
    },
    "lead_time": 5,
    "is_active": true
  }
}
```

### 4.4 Update Vendor (Admin/Operator)

**PATCH** `/vendors/:id`

**Request:**

```json
{
  "contact_person": "Updated Contact Person"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Vendor updated successfully",
  "data": {
    "id": "uuid",
    "name": "New Supplier Inc.",
    "contact_person": "Updated Contact Person",
    "contact_info": {
      "primary_phone": "+251911000000",
      "secondary_phone": "+251922000000",
      "email": "contact@newsupplier.com"
    },
    "location": {
      "city": "Addis Ababa",
      "country": "Ethiopia"
    },
    "lead_time": 5,
    "is_active": true
  }
}
```

### 4.5 Delete Vendor (Admin Only)

**DELETE** `/vendors/:id`

**Error Response (409) - Vendor has linked items:**

```json
{
  "success": false,
  "error": {
    "code": "VENDOR_HAS_ITEMS",
    "message": "Vendor linked to items"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Vendor deleted successfully"
}
```

---

## 5. Items

### 5.1 List Items

**GET** `/items?page=1&limit=20&category=uuid&vendor=uuid&low_stock=true&search=keyboard&sort_by=name&sort_dir=asc`

**Query Params:**

- `page`: Page number
- `limit`: Items per page
- `category`: Filter by category ID
- `vendor`: Filter by vendor ID
- `low_stock`: true/false - filter low stock items
- `search`: Search by SKU, name, or description
- `sort_by`: Field to sort by
- `sort_dir`: Sort direction

**Response (200):**

```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": {
    "active_skus": 60,
    "below_threshold": 12,
    "total": 60,
    "page": 1,
    "limit": 20,
    "total_pages": 3,
    "data": [
      {
        "id": "uuid",
        "sku": "SKU-12345",
        "name": "Wireless Keyboard",
        "description": "Mechanical wireless keyboard",
        "quantity_on_hand": 45,
        "minimum_stock_level": 10,
        "cost_price": 1000,
        "selling_price": 1500,
        "category_id": "uuid",
        "vendor_id": "uuid",
        "location": "A1",
        "is_active": true,
        "created_at": "2025-01-01T00:00:00.000Z",
        "updated_at": "2026-05-24T00:00:00.000Z"
      }
    ]
  }
}
```

### 5.2 Get Item by ID

**GET** `/items/:id`

**Response (200):**

```json
{
  "success": true,
  "message": "Item retrieved successfully",
  "data": {
    "id": "uuid",
    "sku": "SKU-12345",
    "name": "Wireless Keyboard",
    "description": "Mechanical wireless keyboard",
    "quantity_on_hand": 45,
    "minimum_stock_level": 10,
    "cost_price": 1000,
    "selling_price": 1500,
    "category_id": "uuid",
    "vendor_id": "uuid",
    "location": "A1",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2026-05-24T00:00:00.000Z"
  }
}
```

### 5.3 Search Items

**GET** `/items/search?q=keyboard`

**Query Params:**

- `q`: Search query

**Response (200):**

```json
{
  "success": true,
  "message": "Items searched successfully",
  "data": [
    {
      "id": "uuid",
      "sku": "SKU-12345",
      "name": "Wireless Keyboard",
      "description": "Mechanical wireless keyboard",
      "quantity_on_hand": 45,
      "minimum_stock_level": 10,
      "cost_price": 1000,
      "selling_price": 1500,
      "category_id": "uuid",
      "vendor_id": "uuid",
      "location": "A1",
      "is_active": true,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2026-05-24T00:00:00.000Z"
    }
  ]
}
```

### 5.4 Get Storage Capacity

**GET** `/items/storage/capacity`

**Response (200):**

```json
{
  "success": true,
  "message": "Storage capacity retrieved successfully",
  "data": {
    "used_percent": 68,
    "free_percent": 32
  }
}
```

### 5.5 Create Item (Admin/Operator)

**POST** `/items`

**Request:**

```json
{
  "sku": "SKU-99999",
  "name": "New Product",
  "description": "Product description",
  "quantity_on_hand": 50,
  "minimum_stock_level": 10,
  "cost_price": 1000,
  "selling_price": 1500,
  "category_id": "uuid",
  "vendor_id": "uuid",
  "location": "B5"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": "uuid",
    "sku": "SKU-99999",
    "name": "New Product"
  }
}
```

**Error (409) - Duplicate SKU:**

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SKU",
    "message": "SKU already exists"
  }
}
```

### 5.6 Update Item (Admin/Operator)

**PATCH** `/items/:id`

- Note: SKU is immutable and cannot be updated

**Request:**

```json
{
  "name": "Updated Product Name",
  "location": "C3"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": "uuid",
    "sku": "SKU-99999",
    "name": "Updated Product Name",
    "description": "Product description",
    "quantity_on_hand": 50,
    "minimum_stock_level": 10,
    "cost_price": 1000,
    "selling_price": 1500,
    "category_id": "uuid",
    "vendor_id": "uuid",
    "location": "C3",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2026-05-24T00:00:00.000Z"
  }
}
```

### 5.7 Delete Item (Admin Only)

**DELETE** `/items/:id`

**Response (200):**

```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

## 6. Transactions

### 6.1 List Transactions

**GET** `/transactions?page=1&limit=20&inbound=true&outbound=false&start_date=2026-01-01&end_date=2026-05-24&search=SKU-12345`

**Query Params:**

- `page`: Page number
- `limit`: Items per page
- `inbound`: true/false - filter inbound transactions (positive quantity change)
- `outbound`: true/false - filter outbound transactions (negative quantity change)
- `start_date`: Start date filter (ISO format)
- `end_date`: End date filter (ISO format)
- `search`: Search by item SKU, name, or transaction ID

**Response (200):**

```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "total_movement": 250,
    "inbound_24h": 80,
    "outbound_24h": 40,
    "anomalies": 3,
    "total": 250,
    "page": 1,
    "limit": 20,
    "total_pages": 13,
    "data": [
      {
        "id": "uuid",
        "item_id": "uuid",
        "quantity_change": 10,
        "reason": "received stock",
        "timestamp": "2026-05-24T10:00:00.000Z",
        "user_id": "uuid"
      }
    ]
  }
}
```

### 6.2 Create Transaction (Admin/Operator)

**POST** `/transactions`

**Request:**

```json
{
  "item_id": "uuid",
  "quantity_change": -5,
  "reason": "sold"
}
```

**Reason options:**

- "received stock"
- "sold"
- "damaged"
- "audit correction"

**Response (201):**

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "transaction_id": "uuid",
    "updated_stock": 40
  }
}
```

**Error (400) - Insufficient Stock:**

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Stock cannot go below zero"
  }
}
```

### 6.3 Get Transaction History

**GET** `/transactions/history`

**Response (200):**

```json
{
  "success": true,
  "message": "Transaction history retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "item_id": "uuid",
      "quantity_change": 10,
      "reason": "received stock",
      "timestamp": "2026-05-24T10:00:00.000Z",
      "user_id": "uuid"
    }
  ]
}
```

---

## 7. Imports

### 7.1 Import CSV (Admin/Operator)

**POST** `/imports/csv`

- Content-Type: `multipart/form-data`
- Field name: `file`

**Response (200):**

```json
{
  "success": true,
  "message": "CSV imported successfully",
  "data": {
    "status": "success",
    "records": 400
  }
}
```

### 7.2 Get Import History

**GET** `/imports/history?page=1&limit=20&search=inventory`

**Query Params:**

- `page`: Page number
- `limit`: Items per page
- `search`: Search by filename

**Response (200):**

```json
{
  "success": true,
  "message": "Import history retrieved successfully",
  "data": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "total_pages": 1,
    "data": [
      {
        "id": "uuid",
        "filename": "import-2026-05-20.csv",
        "status": "success",
        "records": 100,
        "errors": [],
        "timestamp": "2026-05-20T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 8. Replenishment

### 8.1 Get Replenishment Data

**GET** `/replenishment?category=uuid&search=product`

**Query Params:**

- `category`: Filter by category ID
- `search`: Search by item name or SKU

**Response (200):**

```json
{
  "success": true,
  "message": "Replenishment data retrieved successfully",
  "data": {
    "total_reorder_value": 45000,
    "out_of_stock": 8,
    "pending_order": 4,
    "critical_low_stock": 12,
    "items": [
      {
        "id": "uuid",
        "sku": "SKU-12345",
        "name": "Wireless Keyboard",
        "current_stock": 5,
        "threshold": 10,
        "reorder_quantity": 15,
        "cost_price": 1000,
        "vendor_id": "uuid",
        "category_id": "uuid"
      }
    ]
  }
}
```

### 8.2 Get Replenishment Report

**GET** `/replenishment/report`

**Response (200):**

```json
{
  "success": true,
  "message": "Replenishment report retrieved successfully",
  "data": [
    {
      "vendor_id": "uuid",
      "vendor_name": "Samsung Supplier",
      "items_count": 5,
      "total_reorder_value": 25000
    }
  ]
}
```

---

## 9. Dashboard

### 9.1 Get Dashboard Stats

**GET** `/dashboard`

**Response (200):**

```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "total_items": 60,
    "low_stock": 12,
    "inventory_value": 2500000,
    "active_vendors": 18,
    "stock_movement_chart": [
      { "month": "Jan", "movement": 220 },
      { "month": "Feb", "movement": 180 },
      { "month": "Mar", "movement": 250 },
      { "month": "Apr", "movement": 190 },
      { "month": "May", "movement": 280 },
      { "month": "Jun", "movement": 210 },
      { "month": "Jul", "movement": 240 },
      { "month": "Aug", "movement": 200 },
      { "month": "Sep", "movement": 270 },
      { "month": "Oct", "movement": 230 },
      { "month": "Nov", "movement": 195 },
      { "month": "Dec", "movement": 260 }
    ],
    "recent_transactions": [
      {
        "id": "uuid",
        "item_id": "uuid",
        "quantity_change": 10,
        "reason": "received stock",
        "timestamp": "2026-05-24T10:00:00.000Z",
        "user_id": "uuid"
      }
    ]
  }
}
```

### 9.2 Dashboard Search

**GET** `/dashboard/search?q=sku`

**Query Params:**

- `q`: Search query (searches items and vendors)

**Response (200):**

```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "sku": "SKU-12345",
        "name": "Wireless Keyboard"
      }
    ],
    "vendors": [
      {
        "id": "uuid",
        "name": "Samsung Supplier"
      }
    ]
  }
}
```

---

## 10. Alerts

### 10.1 Get Alerts

**GET** `/alerts`

**Response (200):**

```json
{
  "success": true,
  "message": "Alerts retrieved successfully",
  "data": [
    {
      "item_name": "Wireless Keyboard",
      "stock": 2,
      "threshold": 10,
      "severity": "critical"
    },
    {
      "item_name": "Wireless Mouse",
      "stock": 8,
      "threshold": 10,
      "severity": "warning"
    }
  ]
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable error message"
  }
}
```

## Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., duplicate email/SKU)
- `INSUFFICIENT_STOCK`: Stock cannot go below zero
- `VENDOR_HAS_ITEMS`: Cannot delete vendor with linked items
- `DUPLICATE_SKU`: SKU already exists
- `INTERNAL_SERVER_ERROR`: Unexpected server error
