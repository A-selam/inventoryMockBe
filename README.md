# Inventory Management Mock Backend

Complete mock backend for inventory management frontend development and testing.

## Tech Stack

- Express.js
- TypeScript
- Zod (validation)
- JWT (authentication)
- Faker (seed data)
- Multer (file uploads)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The server will start on `http://localhost:4000`

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## API Base URL

All endpoints are prefixed with: `/api/v1`

## Mock Users

| Role     | Email                  | Password    |
| -------- | ---------------------- | ----------- |
| Admin    | admin@inventory.com    | admin123    |
| Operator | operator@inventory.com | operator123 |
| Viewer   | viewer@inventory.com   | viewer123   |

## Authentication

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@inventory.com",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "jwt-token-here",
    "token_type": "bearer",
    "user": {
      "id": "uuid",
      "name": "Admin",
      "email": "admin@inventory.com",
      "role": "admin"
    }
  }
}
```

Use the `access_token` in subsequent requests:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth

- `POST /api/v1/auth/register` - Accept invitation for new user
- `POST /api/v1/auth/login` - User login

### Users

- `POST /api/v1/users/invite` - Invite new user (admin only)
- `GET /api/v1/users` - List users

### Categories

- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create category
- `PATCH /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category (soft delete)

### Vendors

- `GET /api/v1/vendors` - List vendors
- `GET /api/v1/vendors/:id` - Get vendor by ID
- `POST /api/v1/vendors` - Create vendor
- `PATCH /api/v1/vendors/:id` - Update vendor
- `DELETE /api/v1/vendors/:id` - Delete vendor

### Items

- `GET /api/v1/items` - List items
- `GET /api/v1/items/search?q=query` - Search items
- `GET /api/v1/items/storage/capacity` - Get storage capacity
- `GET /api/v1/items/:id` - Get item by ID
- `POST /api/v1/items` - Create item
- `PATCH /api/v1/items/:id` - Update item
- `DELETE /api/v1/items/:id` - Delete item

### Transactions

- `GET /api/v1/transactions` - List transactions
- `GET /api/v1/transactions/history` - Transaction history
- `POST /api/v1/transactions` - Create transaction

### Imports

- `POST /api/v1/imports/csv` - Import CSV
- `GET /api/v1/imports/history` - Import history

### Replenishment

- `GET /api/v1/replenishment` - Get replenishment data
- `GET /api/v1/replenishment/report` - Replenishment report

### Dashboard

- `GET /api/v1/dashboard` - Dashboard stats
- `GET /api/v1/dashboard/search?q=query` - Dashboard search

### Alerts

- `GET /api/v1/alerts` - Get alerts

## Query Parameters

Most list endpoints support:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `search` - Search term
- `sort_by` - Field to sort by
- `sort_dir` - Sort direction (asc/desc)

## Response Format

Success:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable explanation"
  }
}
```

## Features

- ✅ JWT Authentication
- ✅ Role-based Access Control (RBAC)
- ✅ Pagination
- ✅ Filtering
- ✅ Sorting
- ✅ Search
- ✅ Validation (Zod)
- ✅ Artificial delays (200-700ms)
- ✅ Complete seed data
- ✅ Mock analytics
- ✅ Low stock alerts
- ✅ CSV import endpoint
