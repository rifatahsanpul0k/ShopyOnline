import jwt from "jsonwebtoken";
import database from "../database/db.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";

// Check if user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await database.query(
        "SELECT * FROM users WHERE id = $1 LIMIT 1", [decoded.id]  //fetching user by id
    );
    req.user = user.rows[0];
    next();
});


// Authorize roles
export const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource.`,
                    403
                )
            );
        }
        next();
    };
};