import { v2 as cloudinary } from "cloudinary";
import database from "../database/db.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";


// For creating a new product----->
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
            price / 122,
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



// For fetching all products with filters, pagination, new products, and top-rated products----->
export const fetchAllProducts = catchAsyncErrors(async (req, res, next) => {
    // Extract query parameters
    const { availability, price, category, ratings, search } = req.query;

    // Default to page 1 if not provided or invalid
    const page = parseInt(req.query.page) || 1;

    // Display 10 products per page
    const limit = 10;
    // Skip products for previous pages
    const offset = (page - 1) * limit;

    const conditions = [];
    let values = [];
    let index = 1;

    let paginationPlaceholders = {};

    // Filter products by availability status
    if (availability === "in-stock") {
        conditions.push(`stock > 5`);  // More than 5 items considered in-stock
    } else if (availability === "limited") {
        conditions.push(`stock > 0 AND stock <= 5`);  // 1 to 5 items considered limited stock
    } else if (availability === "out-of-stock") {
        conditions.push(`stock = 0`);  // 0 items considered out-of-stock
    }

    // Filter products by price range
    if (price) {
        const [minPrice, maxPrice] = price.split("-");

        // Validate price range inputs
        if (minPrice && maxPrice) {
            conditions.push(`price BETWEEN $${index} AND $${index + 1}`);
            values.push(minPrice, maxPrice);
            index += 2;
        }
    }

    // Filter products by category
    if (category) {
        conditions.push(`category ILIKE $${index}`);  // ILIKE for Case-insensitive match 
        values.push(`%${category}%`);
        index++;
    }

    // Filter products by rating
    if (ratings) {
        conditions.push(`ratings >= $${index}`);
        values.push(ratings);
        index++;
    }

    // Search products by name or description
    if (search) {
        conditions.push(`(p.name ILIKE $${index} OR p.description ILIKE $${index})`);  
        values.push(`%${search}%`);
        index++;
    }

    /**
    * Constructs the WHERE clause for the SQL query.
    * - If there are multiple conditions, it joins them with "AND" to ensure all conditions are applied.
    * - If there are no conditions, it leaves the WHERE clause empty.
    */
    const whereClause = conditions.length? `WHERE ${conditions.join(" AND ")}`: "";

    // Count total products matching the filters
    const totalProductsResult = await database.query(
        `SELECT COUNT(*) FROM products p ${whereClause}`, values
    );

    const totalProducts = parseInt(totalProductsResult.rows[0].count);

    paginationPlaceholders.limit = `$${index}`;
    values.push(limit);
    index++;

    paginationPlaceholders.offset = `$${index}`;
    values.push(offset);
    index++;

    // Query for fetching filtered and paginated products
    const query = 
    `
        SELECT p.*, COUNT(r.id) AS review_count 
        FROM products p 
        LEFT JOIN reviews r ON p.id = r.product_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ${paginationPlaceholders.limit}
        OFFSET ${paginationPlaceholders.offset}
    `;
    const result = await database.query(query, values);

    // Query for fetching new products (added in last 30 days)
    const newProductsQuery = 
    `
        SELECT p.*, COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 8
  `;
    const newProductsResult = await database.query(newProductsQuery);

    // Query for fetching top-rated products (ratings >= 4.5)
    const topRatedQuery = `
    SELECT p.*,
    COUNT(r.id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.ratings >= 4.5
    GROUP BY p.id
    ORDER BY p.ratings DESC, p.created_at DESC
    LIMIT 8
  `;
    const topRatedResult = await database.query(topRatedQuery);

    // Send response
    res.status(200).json({
        success: true,
        products: result.rows,
        totalProducts,
        newProducts: newProductsResult.rows,
        topRatedProducts: topRatedResult.rows,
    });
});


// For updating an existing product----->
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    // Get product ID from request parameters
    const { productId } = req.params;
    const { name, description, price, category, stock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !stock) {
        return next(
            new ErrorHandler("Please provide complete product details.", 400)
        );
    }

    const product = await database.query("SELECT * FROM products WHERE id = $1", [productId,]);

    // Check if product exists
    if (product.rows.length === 0) {
        return next(new ErrorHandler("Product not found.", 404));
    }

    // Update product details in the database
    const result = await database.query(
        `UPDATE products SET name = $1, description = $2, price = $3, category = $4, stock = $5 WHERE id = $6 RETURNING *`,
        [
            name,
            description, 
            price / 122, 
            category, 
            stock, 
            productId
        ]
    );

    // Send response
    res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        updatedProduct: result.rows[0],
    });
});

// export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
//     const { productId } = req.params;

//     const product = await database.query("SELECT * FROM products WHERE id = $1", [
//         productId,
//     ]);
//     if (product.rows.length === 0) {
//         return next(new ErrorHandler("Product not found.", 404));
//     }

//     const images = product.rows[0].images;

//     const deleteResult = await database.query(
//         "DELETE FROM products WHERE id = $1 RETURNING *",
//         [productId]
//     );

//     if (deleteResult.rows.length === 0) {
//         return next(new ErrorHandler("Failed to delete product.", 500));
//     }

//     // Delete images from Cloudinary
//     if (images && images.length > 0) {
//         for (const image of images) {
//             await cloudinary.uploader.destroy(image.public_id);
//         }
//     }

//     res.status(200).json({
//         success: true,
//         message: "Product deleted successfully.",
//     });
// });