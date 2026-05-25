import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import {
  User,
  Category,
  Vendor,
  Item,
  Transaction,
  ImportHistory,
} from "../types";

export const generateSeedData = () => {
  const users: User[] = [
    {
      id: uuidv4(),
      name: "Admin User",
      email: "admin@inventory.com",
      password: "admin123",
      role: "admin",
    },
    {
      id: uuidv4(),
      name: "Operator User",
      email: "operator@inventory.com",
      password: "operator123",
      role: "operator",
    },
    {
      id: uuidv4(),
      name: "Viewer User",
      email: "viewer@inventory.com",
      password: "viewer123",
      role: "viewer",
    },
  ];

  const categories: Category[] = Array.from({ length: 12 }, () => ({
    id: uuidv4(),
    name: faker.commerce.department(),
    created_at: faker.date.past({ years: 2 }).toISOString(),
    vendor_total: faker.number.int({ min: 1, max: 5 }),
    is_active: true,
  }));

  const vendors: Vendor[] = Array.from({ length: 18 }, () => ({
    id: uuidv4(),
    name: faker.company.name(),
    contact_person: faker.person.fullName(),
    contact_info: {
      primary_phone: faker.phone.number(),
      secondary_phone: faker.helpers.maybe(() => faker.phone.number()),
      email: faker.helpers.maybe(() => faker.internet.email()),
    },
    location: {
      city: faker.location.city(),
      country: faker.location.country(),
    },
    lead_time: faker.number.int({ min: 1, max: 14 }),
    is_active: faker.datatype.boolean(0.9),
  }));

  const items: Item[] = Array.from({ length: 60 }, () => {
    const category = faker.helpers.arrayElement(categories);
    const vendor = faker.helpers.arrayElement(vendors);
    const quantityOnHand = faker.number.int({ min: 0, max: 200 });
    const minimumStockLevel = faker.number.int({ min: 5, max: 30 });

    return {
      id: uuidv4(),
      sku: `SKU-${faker.number.int({ min: 1000, max: 99999 })}`,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      quantity_on_hand: quantityOnHand,
      minimum_stock_level: minimumStockLevel,
      cost_price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      selling_price: parseFloat(faker.commerce.price({ min: 20, max: 2000 })),
      category_id: category.id,
      vendor_id: vendor.id,
      location: `${faker.helpers.arrayElement(["A", "B", "C", "D"])}${faker.number.int({ min: 1, max: 20 })}`,
      is_active: faker.datatype.boolean(0.95),
      created_at: faker.date.past({ years: 1 }).toISOString(),
      updated_at: faker.date.recent().toISOString(),
    };
  });

  const transactions: Transaction[] = Array.from({ length: 250 }, () => {
    const item = faker.helpers.arrayElement(items);
    const user = faker.helpers.arrayElement(users);
    const reason = faker.helpers.arrayElement([
      "received stock",
      "sold",
      "damaged",
      "audit correction",
    ] as const);
    const quantityChange =
      reason === "received stock"
        ? faker.number.int({ min: 1, max: 50 })
        : -faker.number.int({ min: 1, max: 20 });

    return {
      id: uuidv4(),
      item_id: item.id,
      quantity_change: quantityChange,
      reason: reason,
      timestamp: faker.date.past({ years: 1 }).toISOString(),
      user_id: user.id,
    };
  });

  const importHistory: ImportHistory[] = Array.from({ length: 5 }, () => ({
    id: uuidv4(),
    filename: `import-${faker.date.recent().toISOString().split("T")[0]}.csv`,
    status: faker.helpers.arrayElement(["success", "failed"]),
    records: faker.number.int({ min: 10, max: 100 }),
    errors: [],
    timestamp: faker.date.recent().toISOString(),
  }));

  return {
    users,
    categories,
    vendors,
    items,
    transactions,
    importHistory,
  };
};
