import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  authService,
  categoryService,
  vendorService,
  itemService,
  transactionService,
  importService,
  replenishmentService,
  dashboardService,
  alertsService,
  userService,
} from "../services";
import {
  registerSchema,
  inviteUserSchema,
  loginSchema,
  categorySchema,
  vendorSchema,
  itemSchema,
  itemUpdateSchema,
  transactionSchema,
  paginationQuerySchema,
  itemsQuerySchema,
  transactionsQuerySchema,
} from "../validators";

const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body && Object.keys(req.body).length > 0) {
        schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: error.errors,
          },
        });
      }
      next(error);
    }
  };
};

const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: error.errors,
          },
        });
      }
      next(error);
    }
  };
};

export const authController = {
  register: [
    validateRequest(registerSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = authService.register(req.body);
        res.status(201).json({
          success: true,
          message: "User accepted invitation successfully",
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  login: [
    validateRequest(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = authService.login(req.body.email, req.body.password);
        res.status(200).json({
          success: true,
          message: "Login successful",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const userController = {
  invite: [
    validateRequest(inviteUserSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = userService.invite(req.body);
        res.status(201).json({
          success: true,
          message: "User invited successfully",
          data: user,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  getAll: [
    validateQuery(paginationQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = userService.getAll(req.query);
        res.status(200).json({
          success: true,
          message: "Users retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const categoryController = {
  getAll: [
    validateQuery(paginationQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = categoryService.getAll(req.query);
        res.status(200).json({
          success: true,
          message: "Categories retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  getById: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const category = categoryService.getById(req.params.id);
        res.status(200).json({
          success: true,
          message: "Category retrieved successfully",
          data: category,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  create: [
    validateRequest(categorySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const category = categoryService.create(req.body);
        res.status(201).json({
          success: true,
          message: "Category created successfully",
          data: category,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  update: [
    validateRequest(categorySchema.partial()),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const category = categoryService.update(req.params.id, req.body);
        res.status(200).json({
          success: true,
          message: "Category updated successfully",
          data: category,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  delete: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        categoryService.delete(req.params.id);
        res.status(200).json({
          success: true,
          message: "Category deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const vendorController = {
  getAll: [
    validateQuery(paginationQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = vendorService.getAll(req.query);
        res.status(200).json({
          success: true,
          message: "Vendors retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  getById: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vendor = vendorService.getById(req.params.id);
        res.status(200).json({
          success: true,
          message: "Vendor retrieved successfully",
          data: vendor,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  create: [
    validateRequest(vendorSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vendor = vendorService.create(req.body);
        res.status(201).json({
          success: true,
          message: "Vendor created successfully",
          data: vendor,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  update: [
    validateRequest(vendorSchema.partial()),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vendor = vendorService.update(req.params.id, req.body);
        res.status(200).json({
          success: true,
          message: "Vendor updated successfully",
          data: vendor,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  delete: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        vendorService.delete(req.params.id);
        res.status(200).json({
          success: true,
          message: "Vendor deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const itemController = {
  getAll: [
    validateQuery(itemsQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = itemService.getAll(req.query);
        res.status(200).json({
          success: true,
          message: "Items retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  getById: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = itemService.getById(req.params.id);
        res.status(200).json({
          success: true,
          message: "Item retrieved successfully",
          data: item,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  create: [
    validateRequest(itemSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = itemService.create(req.body);
        res.status(201).json({
          success: true,
          message: "Item created successfully",
          data: {
            id: item.id,
            sku: item.sku,
            name: item.name,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  update: [
    validateRequest(itemUpdateSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = itemService.update(req.params.id, req.body);
        res.status(200).json({
          success: true,
          message: "Item updated successfully",
          data: item,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  delete: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        itemService.delete(req.params.id);
        res.status(200).json({
          success: true,
          message: "Item deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  search: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const items = itemService.search(req.query.q as string);
        res.status(200).json({
          success: true,
          message: "Items searched successfully",
          data: items,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  getStorageCapacity: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const capacity = itemService.getStorageCapacity();
        res.status(200).json({
          success: true,
          message: "Storage capacity retrieved successfully",
          data: capacity,
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const transactionController = {
  getAll: [
    validateQuery(transactionsQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = transactionService.getAll(req.query);
        res.status(200).json({
          success: true,
          message: "Transactions retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  create: [
    validateRequest(transactionSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Unauthorized",
            },
          });
        }
        const result = transactionService.create(req.body, req.user.id);
        res.status(201).json({
          success: true,
          message: "Transaction created successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  getHistory: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const history = transactionService.getHistory();
        res.status(200).json({
          success: true,
          message: "Transaction history retrieved successfully",
          data: history,
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const importController = {
  importCsv: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "CSV file is required",
            },
          });
        }
        const result = await importService.importCsv(
          req.file,
          req.file.originalname,
        );
        res.status(200).json({
          success: true,
          message: "CSV imported successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  getHistory: [
    validateQuery(paginationQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = importService.getHistory(req.query);
        res.status(200).json({
          success: true,
          message: "Import history retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const replenishmentController = {
  getReplenishment: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = replenishmentService.getReplenishment(req.query);
        res.status(200).json({
          success: true,
          message: "Replenishment data retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  getReport: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const report = replenishmentService.getReport();
        res.status(200).json({
          success: true,
          message: "Replenishment report retrieved successfully",
          data: report,
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const dashboardController = {
  getDashboard: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dashboard = dashboardService.getDashboard();
        res.status(200).json({
          success: true,
          message: "Dashboard data retrieved successfully",
          data: dashboard,
        });
      } catch (error) {
        next(error);
      }
    },
  ],

  search: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = dashboardService.search(req.query.q as string);
        res.status(200).json({
          success: true,
          message: "Search completed successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};

export const alertsController = {
  getAlerts: [
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const alerts = alertsService.getAlerts();
        res.status(200).json({
          success: true,
          message: "Alerts retrieved successfully",
          data: alerts,
        });
      } catch (error) {
        next(error);
      }
    },
  ],
};
