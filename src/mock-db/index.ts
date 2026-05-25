import { generateSeedData } from '../seed';
import {
  User,
  Category,
  Vendor,
  Item,
  Transaction,
  ImportHistory
} from '../types';

export interface MockDatabase {
  users: User[];
  categories: Category[];
  vendors: Vendor[];
  items: Item[];
  transactions: Transaction[];
  importHistory: ImportHistory[];
}

let db: MockDatabase;

export const initializeDatabase = () => {
  db = generateSeedData();
};

export const getDatabase = (): MockDatabase => {
  if (!db) {
    initializeDatabase();
  }
  return db;
};
