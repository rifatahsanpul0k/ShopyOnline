import { v2 as cloudinary } from "cloudinary";
import database from "../database/db.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";


// For creating a new product---------------------->
export const createProduct = catchAsyncErrors(async (req, res, next) => {
    const { name, description, price, category, stock } = req.body;
    const created_by = req.user.id;

    // Validate required fields
    if (!name || !description || !price || !category || !stock) {
        return next(
            new ErrorHandler("Please provide complete product details.", 400)
        );
    }

    // Handle image uploads
    let uploadedImages = [];

    if (req.files && req.files.images) {
        const images = Array.isArray(req.files.images)? req.files.images: [req.files.images];

        // Upload each image to Cloudinary
        for (const image of images) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "ShopyOnline_Product_Images",
                width: 1000,
                crop: "scale",
            });

            // Store the uploaded image details to the array
            uploadedImages.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }
    }


    // Insert product details into the database
    const product = await database.query(
        `INSERT INTO products (name, description, price, category, stock, images, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
            name,
            description,
            price,
            category,
            stock,
            JSON.stringify(uploadedImages),  // Store as JSON string
            created_by,
        ]
    );

    // Send response
    res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product: product.rows[0],
    });
});