import { Router } from "express";
import multer from "multer";
import { config } from "../config";
import { ROLES } from "../constants";
import { authenticateToken, requireRole } from "../middleware";
import {
  authController,
  userController,
  categoryController,
  vendorController,
  itemController,
  transactionController,
  importController,
  replenishmentController,
  dashboardController,
  alertsController,
} from "../controllers";

const router = Router();
const upload = multer({ dest: "uploads/" });

const apiPrefix = config.apiPrefix;

const authRouter = Router();
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
router.use(`${apiPrefix}/auth`, authRouter);

router.use(authenticateToken);

const usersRouter = Router();
usersRouter.post("/invite", requireRole(ROLES.ADMIN), userController.invite);
usersRouter.get(
  "/",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  userController.getAll,
);
router.use(`${apiPrefix}/users`, usersRouter);

const categoriesRouter = Router();
categoriesRouter.get("/", categoryController.getAll);
categoriesRouter.get("/:id", categoryController.getById);
categoriesRouter.post(
  "/",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  categoryController.create,
);
categoriesRouter.patch(
  "/:id",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  categoryController.update,
);
categoriesRouter.delete(
  "/:id",
  requireRole(ROLES.ADMIN),
  categoryController.delete,
);
router.use(`${apiPrefix}/categories`, categoriesRouter);

const vendorsRouter = Router();
vendorsRouter.get("/", vendorController.getAll);
vendorsRouter.get("/:id", vendorController.getById);
vendorsRouter.post(
  "/",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  vendorController.create,
);
vendorsRouter.patch(
  "/:id",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  vendorController.update,
);
vendorsRouter.delete("/:id", requireRole(ROLES.ADMIN), vendorController.delete);
router.use(`${apiPrefix}/vendors`, vendorsRouter);

const itemsRouter = Router();
itemsRouter.get("/", itemController.getAll);
itemsRouter.get("/search", itemController.search);
itemsRouter.get("/storage/capacity", itemController.getStorageCapacity);
itemsRouter.get("/:id", itemController.getById);
itemsRouter.post(
  "/",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  itemController.create,
);
itemsRouter.patch(
  "/:id",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  itemController.update,
);
itemsRouter.delete("/:id", requireRole(ROLES.ADMIN), itemController.delete);
router.use(`${apiPrefix}/items`, itemsRouter);

const transactionsRouter = Router();
transactionsRouter.get("/", transactionController.getAll);
transactionsRouter.get("/history", transactionController.getHistory);
transactionsRouter.post(
  "/",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  transactionController.create,
);
router.use(`${apiPrefix}/transactions`, transactionsRouter);

const importsRouter = Router();
importsRouter.post(
  "/csv",
  requireRole(ROLES.ADMIN, ROLES.OPERATOR),
  upload.single("file"),
  importController.importCsv,
);
importsRouter.get("/history", importController.getHistory);
router.use(`${apiPrefix}/imports`, importsRouter);

const replenishmentRouter = Router();
replenishmentRouter.get("/", replenishmentController.getReplenishment);
replenishmentRouter.get("/report", replenishmentController.getReport);
router.use(`${apiPrefix}/replenishment`, replenishmentRouter);

const dashboardRouter = Router();
dashboardRouter.get("/", dashboardController.getDashboard);
dashboardRouter.get("/search", dashboardController.search);
router.use(`${apiPrefix}/dashboard`, dashboardRouter);

const alertsRouter = Router();
alertsRouter.get("/", alertsController.getAlerts);
router.use(`${apiPrefix}/alerts`, alertsRouter);

export default router;
