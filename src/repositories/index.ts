import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../mock-db';
import {
  User,
  Category,
  Vendor,
  Item,
  Transaction,
  ImportHistory
} from '../types';

export const userRepository = {
  findAll: (): User[] => {
    return getDatabase().users;
  },
  findById: (id: string): User | undefined => {
    return getDatabase().users.find(u => u.id === id);
  },
  findByEmail: (email: string): User | undefined => {
    return getDatabase().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  create: (user: Omit<User, 'id'>): User => {
    const newUser = { ...user, id: uuidv4() };
    getDatabase().users.push(newUser);
    return newUser;
  }
};

export const categoryRepository = {
  findAll: (): Category[] => {
    return getDatabase().categories;
  },
  findById: (id: string): Category | undefined => {
    return getDatabase().categories.find(c => c.id === id);
  },
  create: (category: Omit<Category, 'id' | 'created_at' | 'vendor_total'>): Category => {
    const newCategory = {
      ...category,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      vendor_total: 0
    };
    getDatabase().categories.push(newCategory);
    return newCategory;
  },
  update: (id: string, data: Partial<Category>): Category | undefined => {
    const db = getDatabase();
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    db.categories[index] = { ...db.categories[index], ...data };
    return db.categories[index];
  },
  delete: (id: string): boolean => {
    const db = getDatabase();
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    db.categories[index].is_active = false;
    return true;
  }
};

export const vendorRepository = {
  findAll: (): Vendor[] => {
    return getDatabase().vendors;
  },
  findById: (id: string): Vendor | undefined => {
    return getDatabase().vendors.find(v => v.id === id);
  },
  create: (vendor: Omit<Vendor, 'id'>): Vendor => {
    const newVendor = { ...vendor, id: uuidv4() };
    getDatabase().vendors.push(newVendor);
    return newVendor;
  },
  update: (id: string, data: Partial<Vendor>): Vendor | undefined => {
    const db = getDatabase();
    const index = db.vendors.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    db.vendors[index] = { ...db.vendors[index], ...data };
    return db.vendors[index];
  },
  delete: (id: string): boolean => {
    const db = getDatabase();
    const hasItems = db.items.some(i => i.vendor_id === id && i.is_active);
    if (hasItems) return false;
    const index = db.vendors.findIndex(v => v.id === id);
    if (index === -1) return false;
    db.vendors[index].is_active = false;
    return true;
  }
};

export const itemRepository = {
  findAll: (): Item[] => {
    return getDatabase().items;
  },
  findById: (id: string): Item | undefined => {
    return getDatabase().items.find(i => i.id === id);
  },
  findBySku: (sku: string): Item | undefined => {
    return getDatabase().items.find(i => i.sku.toLowerCase() === sku.toLowerCase());
  },
  create: (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Item => {
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      id: uuidv4(),
      created_at: now,
      updated_at: now
    };
    getDatabase().items.push(newItem);
    return newItem;
  },
  update: (id: string, data: Partial<Omit<Item, 'sku'>>): Item | undefined => {
    const db = getDatabase();
    const index = db.items.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    db.items[index] = { 
      ...db.items[index], 
      ...data,
      updated_at: new Date().toISOString()
    };
    return db.items[index];
  },
  delete: (id: string): boolean => {
    const db = getDatabase();
    const hasTransactions = db.transactions.some(t => t.item_id === id);
    const index = db.items.findIndex(i => i.id === id);
    if (index === -1) return false;
    if (hasTransactions) {
      db.items[index].is_active = false;
    } else {
      db.items.splice(index, 1);
    }
    return true;
  },
  updateQuantity: (id: string, quantityChange: number): Item | undefined => {
    const db = getDatabase();
    const index = db.items.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    db.items[index].quantity_on_hand += quantityChange;
    db.items[index].updated_at = new Date().toISOString();
    return db.items[index];
  }
};

export const transactionRepository = {
  findAll: (): Transaction[] => {
    return getDatabase().transactions;
  },
  findById: (id: string): Transaction | undefined => {
    return getDatabase().transactions.find(t => t.id === id);
  },
  findByItemId: (itemId: string): Transaction[] => {
    return getDatabase().transactions.filter(t => t.item_id === itemId);
  },
  create: (transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    };
    getDatabase().transactions.push(newTransaction);
    return newTransaction;
  }
};

export const importHistoryRepository = {
  findAll: (): ImportHistory[] => {
    return getDatabase().importHistory;
  },
  create: (importHistory: Omit<ImportHistory, 'id'>): ImportHistory => {
    const newImportHistory = {
      ...importHistory,
      id: uuidv4()
    };
    getDatabase().importHistory.push(newImportHistory);
    return newImportHistory;
  }
};
