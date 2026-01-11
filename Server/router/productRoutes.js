import express from "express";
import {
    createProduct,
    fetchAllProducts,
} from "../controllers/productController.js";
import { authorizedRoles, isAuthenticated, } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
    "/admin/create",
    isAuthenticated,
    authorizedRoles("Admin"),
    createProduct
);
router.get("/", fetchAllProducts);


export default router;