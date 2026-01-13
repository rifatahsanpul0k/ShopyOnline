import express from "express";
import {
    createProduct,
    deleteProduct,
    fetchAllProducts,
    fetchSingleProduct,
    updateProduct,
} from "../controllers/productController.js";
import { authorizedRoles, isAuthenticated, } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/admin/create", isAuthenticated, authorizedRoles("Admin"), createProduct);
router.get("/", fetchAllProducts);
router.put("/admin/update/:productId", isAuthenticated, authorizedRoles("Admin"), updateProduct);
router.delete("/admin/delete/:productId", isAuthenticated, authorizedRoles("Admin"), deleteProduct);
router.get("/singleProduct/:productId", fetchSingleProduct);

export default router;