import jwt from "jsonwebtoken";
import { config } from "../config";
import { ERROR_CODES } from "../constants";
import {
  userRepository,
  categoryRepository,
  vendorRepository,
  itemRepository,
  transactionRepository,
  importHistoryRepository,
} from "../repositories";
import { paginate, sortData, searchData } from "../utils";
import {
  User,
  Category,
  Vendor,
  Item,
  Transaction,
  ImportHistory,
  DashboardStats,
  Alert,
  ReplenishmentStats,
  ReplenishmentItem,
} from "../types";

export const authService = {
  register: (data: { token: string; password: string }) => {
    let invitedUserInfo;
    try {
      invitedUserInfo = jwt.verify(data.token, config.jwtSecret) as any;
    } catch (err) {
      throw {
        statusCode: 401,
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Invalid invitation token",
      };
    }

    const existingUser = userRepository.findByEmail(invitedUserInfo.email);
    if (existingUser) {
      throw {
        statusCode: 409,
        code: ERROR_CODES.CONFLICT,
        message: "User with this email already exists",
      };
    }

    const newUser = userRepository.create({
      name: invitedUserInfo.name,
      email: invitedUserInfo.email,
      password: data.password,
      role: invitedUserInfo.role,
    });

    return newUser;
  },

  login: (email: string, password: string) => {
    const user = userRepository.findByEmail(email);
    if (!user || user.password !== password) {
      throw {
        statusCode: 401,
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Invalid email or password",
      };
    }
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as any,
    );
    return {
      access_token: accessToken,
      token_type: "bearer",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};

export const categoryService = {
  getAll: (query: any) => {
    let data = categoryRepository.findAll().filter((c) => c.is_active);

    if (query.search) {
      data = searchData(data, query.search, ["name"]);
    }

    if (query.sort_by) {
      data = sortData(data, query.sort_by as keyof Category, query.sort_dir);
    }

    return paginate(data, query.page, query.limit);
  },

  getById: (id: string) => {
    const category = categoryRepository.findById(id);
    if (!category) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Category not found",
      };
    }
    return category;
  },

  create: (data: any) => {
    return categoryRepository.create(data);
  },

  update: (id: string, data: any) => {
    const category = categoryRepository.update(id, data);
    if (!category) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Category not found",
      };
    }
    return category;
  },

  delete: (id: string) => {
    const success = categoryRepository.delete(id);
    if (!success) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Category not found",
      };
    }
  },
};

export const vendorService = {
  getAll: (query: any) => {
    let data = vendorRepository.findAll().filter((v) => v.is_active);

    if (query.search) {
      data = searchData(data, query.search, ["name", "contact_person"]);
    }

    if (query.sort_by) {
      data = sortData(data, query.sort_by as keyof Vendor, query.sort_dir);
    }

    return paginate(data, query.page, query.limit);
  },

  getById: (id: string) => {
    const vendor = vendorRepository.findById(id);
    if (!vendor) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Vendor not found",
      };
    }
    return vendor;
  },

  create: (data: any) => {
    return vendorRepository.create(data);
  },

  update: (id: string, data: any) => {
    const vendor = vendorRepository.update(id, data);
    if (!vendor) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Vendor not found",
      };
    }
    return vendor;
  },

  delete: (id: string) => {
    const success = vendorRepository.delete(id);
    if (!success) {
      const db = require("../mock-db").getDatabase();
      const hasItems = db.items.some(
        (i: Item) => i.vendor_id === id && i.is_active,
      );
      if (hasItems) {
        throw {
          statusCode: 409,
          code: ERROR_CODES.VENDOR_HAS_ITEMS,
          message: "Vendor linked to items",
        };
      }
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Vendor not found",
      };
    }
  },
};

export const itemService = {
  getAll: (query: any) => {
    let data = itemRepository.findAll().filter((i) => i.is_active);

    if (query.category) {
      data = data.filter((i) => i.category_id === query.category);
    }

    if (query.vendor) {
      data = data.filter((i) => i.vendor_id === query.vendor);
    }

    if (query.low_stock) {
      data = data.filter((i) => i.quantity_on_hand <= i.minimum_stock_level);
    }

    if (query.search) {
      data = searchData(data, query.search, ["sku", "name", "description"]);
    }

    if (query.sort_by) {
      data = sortData(data, query.sort_by as keyof Item, query.sort_dir);
    }

    const belowThreshold = data.filter(
      (i) => i.quantity_on_hand <= i.minimum_stock_level,
    ).length;
    const activeSkus = data.length;

    const paginated = paginate(data, query.page, query.limit);

    return {
      active_skus: activeSkus,
      below_threshold: belowThreshold,
      ...paginated,
    };
  },

  getById: (id: string) => {
    const item = itemRepository.findById(id);
    if (!item) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Item not found",
      };
    }
    return item;
  },

  create: (data: any) => {
    const existingSku = itemRepository.findBySku(data.sku);
    if (existingSku) {
      throw {
        statusCode: 409,
        code: ERROR_CODES.DUPLICATE_SKU,
        message: "SKU already exists",
      };
    }
    return itemRepository.create(data);
  },

  update: (id: string, data: any) => {
    const item = itemRepository.update(id, data);
    if (!item) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Item not found",
      };
    }
    return item;
  },

  delete: (id: string) => {
    const success = itemRepository.delete(id);
    if (!success) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Item not found",
      };
    }
  },

  search: (q: string) => {
    let data = itemRepository.findAll().filter((i) => i.is_active);
    data = searchData(data, q, ["sku", "name", "description"]);
    return data;
  },

  getStorageCapacity: () => {
    return {
      used_percent: 68,
      free_percent: 32,
    };
  },
};

export const transactionService = {
  getAll: (query: any) => {
    let data = [...transactionRepository.findAll()].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    if (query.inbound) {
      data = data.filter((t) => t.quantity_change > 0);
    }

    if (query.outbound) {
      data = data.filter((t) => t.quantity_change < 0);
    }

    if (query.start_date) {
      data = data.filter(
        (t) => new Date(t.timestamp) >= new Date(query.start_date),
      );
    }

    if (query.end_date) {
      data = data.filter(
        (t) => new Date(t.timestamp) <= new Date(query.end_date),
      );
    }

    if (query.search) {
      const items = itemRepository.findAll();
      const matchingItemIds = searchData(items, query.search, [
        "sku",
        "name",
      ]).map((i) => i.id);
      data = data.filter(
        (t) =>
          matchingItemIds.includes(t.item_id) || t.id.includes(query.search),
      );
    }

    const totalMovement = data.length;
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const inbound24h = data.filter(
      (t) => t.quantity_change > 0 && new Date(t.timestamp) >= yesterday,
    ).length;
    const outbound24h = data.filter(
      (t) => t.quantity_change < 0 && new Date(t.timestamp) >= yesterday,
    ).length;

    const paginated = paginate(data, query.page, query.limit);

    return {
      total_movement: totalMovement,
      inbound_24h: inbound24h,
      outbound_24h: outbound24h,
      anomalies: 3,
      ...paginated,
    };
  },

  create: (data: any, userId: string) => {
    const item = itemRepository.findById(data.item_id);
    if (!item) {
      throw {
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: "Item not found",
      };
    }

    const newQuantity = item.quantity_on_hand + data.quantity_change;
    if (newQuantity < 0) {
      throw {
        statusCode: 400,
        code: ERROR_CODES.INSUFFICIENT_STOCK,
        message: "Stock cannot go below zero",
      };
    }

    const updatedItem = itemRepository.updateQuantity(
      data.item_id,
      data.quantity_change,
    );
    if (!updatedItem) {
      throw {
        statusCode: 500,
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Failed to update item quantity",
      };
    }

    const transaction = transactionRepository.create({
      ...data,
      user_id: userId,
    });

    return {
      transaction_id: transaction.id,
      updated_stock: updatedItem.quantity_on_hand,
    };
  },

  getHistory: () => {
    return transactionRepository
      .findAll()
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  },
};

export const importService = {
  importCsv: async (file: Express.Multer.File, filename: string) => {
    return {
      status: "success",
      records: 400,
    };
  },

  getHistory: (query: any) => {
    let data = importHistoryRepository
      .findAll()
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    if (query.search) {
      data = searchData(data, query.search, ["filename"]);
    }

    return paginate(data, query.page, query.limit);
  },
};

export const replenishmentService = {
  getReplenishment: (query: any): ReplenishmentStats => {
    const items = itemRepository
      .findAll()
      .filter(
        (i) => i.is_active && i.quantity_on_hand <= i.minimum_stock_level,
      );

    let filteredItems = items;
    if (query.category) {
      filteredItems = filteredItems.filter(
        (i) => i.category_id === query.category,
      );
    }
    if (query.search) {
      filteredItems = searchData(filteredItems, query.search, ["name", "sku"]);
    }

    const replenishmentItems: ReplenishmentItem[] = filteredItems.map(
      (item) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        current_stock: item.quantity_on_hand,
        threshold: item.minimum_stock_level,
        reorder_quantity: Math.max(
          0,
          item.minimum_stock_level * 2 - item.quantity_on_hand,
        ),
        cost_price: item.cost_price,
        vendor_id: item.vendor_id,
        category_id: item.category_id,
      }),
    );

    const totalReorderValue = replenishmentItems.reduce(
      (sum, item) => sum + item.reorder_quantity * item.cost_price,
      0,
    );
    const outOfStock = replenishmentItems.filter(
      (i) => i.current_stock === 0,
    ).length;
    const criticalLowStock = replenishmentItems.filter(
      (i) => i.current_stock < i.threshold / 2,
    ).length;

    return {
      total_reorder_value: Math.round(totalReorderValue),
      out_of_stock: outOfStock,
      pending_order: 4,
      critical_low_stock: criticalLowStock,
      items: replenishmentItems,
    };
  },

  getReport: () => {
    const replenishment = replenishmentService.getReplenishment({});
    const vendors = vendorRepository.findAll();

    const byVendor = vendors
      .map((vendor) => {
        const vendorItems = replenishment.items.filter(
          (i) => i.vendor_id === vendor.id,
        );
        return {
          vendor_id: vendor.id,
          vendor_name: vendor.name,
          items_count: vendorItems.length,
          total_reorder_value: vendorItems.reduce(
            (sum, item) => sum + item.reorder_quantity * item.cost_price,
            0,
          ),
        };
      })
      .filter((v) => v.items_count > 0);

    return byVendor;
  },
};

export const dashboardService = {
  getDashboard: (): DashboardStats => {
    const items = itemRepository.findAll().filter((i) => i.is_active);
    const vendors = vendorRepository.findAll().filter((v) => v.is_active);
    const transactions = transactionRepository.findAll();

    const totalItems = items.length;
    const lowStock = items.filter(
      (i) => i.quantity_on_hand <= i.minimum_stock_level,
    ).length;
    const inventoryValue = items.reduce(
      (sum, item) => sum + item.quantity_on_hand * item.cost_price,
      0,
    );
    const activeVendors = vendors.length;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const stockMovementChart = months.map((month) => ({
      month,
      movement: Math.floor(Math.random() * 300) + 100,
    }));

    const recentTransactions = [...transactions]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10);

    return {
      total_items: totalItems,
      low_stock: lowStock,
      inventory_value: Math.round(inventoryValue),
      active_vendors: activeVendors,
      stock_movement_chart: stockMovementChart,
      recent_transactions: recentTransactions,
    };
  },

  search: (q: string) => {
    const items = itemService.search(q);
    const vendors = searchData(
      vendorRepository.findAll().filter((v) => v.is_active),
      q,
      ["name"],
    );

    return {
      items,
      vendors,
    };
  },
};

export const alertsService = {
  getAlerts: (): Alert[] => {
    const items = itemRepository
      .findAll()
      .filter(
        (i) => i.is_active && i.quantity_on_hand <= i.minimum_stock_level,
      );

    return items.map((item) => ({
      item_name: item.name,
      stock: item.quantity_on_hand,
      threshold: item.minimum_stock_level,
      severity:
        item.quantity_on_hand === 0 ||
        item.quantity_on_hand < item.minimum_stock_level / 2
          ? "critical"
          : "warning",
    }));
  },
};

export const userService = {
  invite: (data: any) => {
    const invitationToken = jwt.sign(
      { name: data.name, email: data.email, role: data.role },
      config.jwtSecret,
      { expiresIn: "7d" } as any,
    );
    return {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      role: data.role,
      invitation_token: invitationToken,
    };
  },

  getAll: (query: any) => {
    let data = userRepository.findAll();

    if (query.role) {
      data = data.filter((u) => u.role === query.role);
    }

    if (query.search) {
      data = searchData(data, query.search, ["name", "email"]);
    }

    return {
      total_users: data.length,
      active_now: 7,
      pending_invites: 4,
      data: paginate(data, query.page, query.limit),
    };
  },
};
