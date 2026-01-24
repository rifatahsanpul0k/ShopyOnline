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
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

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
      JSON.stringify(uploadedImages), // Store as JSON string
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

  // Allow custom limit, default to 24 products per page
  const limit = parseInt(req.query.limit) || 24;
  // Skip products for previous pages
  const offset = (page - 1) * limit;

  const conditions = [];
  let values = [];
  let index = 1;

  let paginationPlaceholders = {};

  // Filter products by availability status
  if (availability === "in-stock") {
    conditions.push(`stock > 5`); // More than 5 items considered in-stock
  } else if (availability === "limited") {
    conditions.push(`stock > 0 AND stock <= 5`); // 1 to 5 items considered limited stock
  } else if (availability === "out-of-stock") {
    conditions.push(`stock = 0`); // 0 items considered out-of-stock
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
    conditions.push(`category ILIKE $${index}`); // ILIKE for Case-insensitive match
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
    conditions.push(
      `(p.name ILIKE $${index} OR p.description ILIKE $${index})`
    );
    values.push(`%${search}%`);
    index++;
  }

  /**
   * Constructs the WHERE clause for the SQL query.
   * - If there are multiple conditions, it joins them with "AND" to ensure all conditions are applied.
   * - If there are no conditions, it leaves the WHERE clause empty.
   */
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // Count total products matching the filters
  const totalProductsResult = await database.query(
    `SELECT COUNT(*) FROM products p ${whereClause}`,
    values
  );

  const totalProducts = parseInt(totalProductsResult.rows[0].count);

  paginationPlaceholders.limit = `$${index}`;
  values.push(limit);
  index++;

  paginationPlaceholders.offset = `$${index}`;
  values.push(offset);
  index++;

  // Query for fetching filtered and paginated products
  const query = `
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

  // Parse images from JSON string to array for each product
  const productsWithParsedImages = result.rows.map(product => ({
    ...product,
    images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images
  }));

  // Query for fetching new products (added in last 30 days)
  const newProductsQuery = `
        SELECT p.*, COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 15
  `;
  const newProductsResult = await database.query(newProductsQuery);

  // Parse images for new products
  const newProductsWithParsedImages = newProductsResult.rows.map(product => ({
    ...product,
    images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images
  }));

  // Query for fetching top-rated products (ratings >= 4.0)
  const topRatedQuery = `
    SELECT p.*,
    COUNT(r.id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.ratings >= 4.0
    GROUP BY p.id
    ORDER BY p.ratings DESC, p.created_at DESC
    LIMIT 15
  `;
  const topRatedResult = await database.query(topRatedQuery);

  // Parse images for top-rated products
  const topRatedWithParsedImages = topRatedResult.rows.map(product => ({
    ...product,
    images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images
  }));

  // Send response
  res.status(200).json({
    success: true,
    products: productsWithParsedImages,
    totalProducts,
    newProducts: newProductsWithParsedImages,
    topRatedProducts: topRatedWithParsedImages,
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

  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);

  // Check if product exists
  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Update product details in the database
  const result = await database.query(
    `UPDATE products SET name = $1, description = $2, price = $3, category = $4, stock = $5 WHERE id = $6 RETURNING *`,
    [name, description, price, category, stock, productId]
  );

  // Send response
  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    updatedProduct: result.rows[0],
  });
});

// For deleting a product----->
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);

  // Check if product exists
  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Get images associated with the product
  const images = product.rows[0].images;

  // Delete product from the database
  const deleteResult = await database.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [productId]
  );

  // Check if deletion was successful
  if (deleteResult.rows.length === 0) {
    return next(new ErrorHandler("Failed to delete product.", 500));
  }

  // Delete images from Cloudinary
  if (images && images.length > 0) {
    for (const image of images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  // Send response
  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});

// For fetching a single product by ID----->
export const fetchSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  // Query to fetch product details along with associated reviews and reviewer information
  const result = await database.query(
    `
        SELECT p.*,
        COALESCE(
        json_agg(
        json_build_object(
            'review_id', r.id,
            'rating', r.rating,
            'comment', r.comment,
            'reviewer', json_build_object(
            'id', u.id,
            'name', u.name,
            'avatar', u.avatar
            ))
        ) FILTER (WHERE r.id IS NOT NULL), '[]') AS reviews
         FROM products p
         LEFT JOIN reviews r ON p.id = r.product_id
         LEFT JOIN users u ON r.user_id = u.id
         WHERE p.id  = $1
         GROUP BY p.id`,
    [productId]
  );

  // Send response
  res.status(200).json({
    success: true,
    message: "Product fetched successfully.",
    product: result.rows[0],
  });
});

// Check if user has purchased a product----->
export const checkUserPurchase = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const purchaseCheckQuery = `
    SELECT oi.product_id
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.buyer_id = $1
    AND oi.product_id = $2
    AND o.order_status IN ('Processing', 'Shipped', 'Delivered')
    LIMIT 1
  `;

  const { rows } = await database.query(purchaseCheckQuery, [
    req.user.id,
    productId,
  ]);

  res.status(200).json({
    success: true,
    hasPurchased: rows.length > 0,
  });
});

// For posting a product review----->
export const postProductReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  // Validate required fields
  if (!rating || !comment) {
    return next(new ErrorHandler("Please provide rating and comment.", 400));
  }

  // Check if the user has purchased the product before allowing review
  const purchasheCheckQuery = `
        SELECT oi.product_id
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.buyer_id = $1
        AND oi.product_id = $2
        AND o.order_status IN ('Processing', 'Shipped', 'Delivered')
        LIMIT 1
    `;

  // Execute the purchase check query
  const { rows } = await database.query(purchasheCheckQuery, [
    req.user.id,
    productId,
  ]);

  // If no purchase record found, deny the review
  if (rows.length === 0) {
    return res.status(403).json({
      success: false,
      message: "You can only review a product you've purchased.",
    });
  }

  // Check if the product exists
  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);

  // If product not found, return error
  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Check if the user has already reviewed the product
  const isAlreadyReviewed = await database.query(
    ` SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2`,
    [productId, req.user.id]
  );

  let review;

  // If already reviewed, update the existing review; otherwise, create a new review
  if (isAlreadyReviewed.rows.length > 0) {
    review = await database.query(
      "UPDATE reviews SET rating = $1, comment = $2 WHERE product_id = $3 AND user_id = $4 RETURNING *",
      [rating, comment, productId, req.user.id]
    );
  } else {
    review = await database.query(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [productId, req.user.id, rating, comment]
    );
  }

  // Recalculate and update the average rating for the product
  const allReviews = await database.query(
    `SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = $1`,
    [productId]
  );

  // Get the new average rating
  const newAvgRating = allReviews.rows[0].avg_rating;

  // Update the product's average rating in the database
  const updatedProduct = await database.query(
    `UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *`,
    [newAvgRating, productId]
  );

  // Send response
  res.status(200).json({
    success: true,
    message: "Review posted.",
    review: review.rows[0],
    product: updatedProduct.rows[0],
  });
});

// For deleting a product review----->
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  // Delete the review from the database
  const review = await database.query(
    "DELETE FROM reviews WHERE product_id = $1 AND user_id = $2 RETURNING *",
    [productId, req.user.id]
  );

  // Check if the review existed
  if (review.rows.length === 0) {
    return next(new ErrorHandler("Review not found.", 404));
  }

  // Recalculate the average rating after deletion
  const allReviews = await database.query(
    `SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = $1`,
    [productId]
  );

  const newAvgRating = allReviews.rows[0].avg_rating;

  // Update the product's average rating in the database
  const updatedProduct = await database.query(
    `UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *`,
    [newAvgRating, productId]
  );

  // Send response
  res.status(200).json({
    success: true,
    message: "Your review has been deleted.",
    review: review.rows[0],
    product: updatedProduct.rows[0],
  });
});

// Helper function to get AI recommendations----->
// export const fetchAIFilteredProducts = catchAsyncErrors(
//     async (req, res, next) => {
//         const { userPrompt } = req.body;

//         // Validate user prompt
//         if (!userPrompt) {
//             return next(new ErrorHandler("Provide a valid prompt.", 400));
//         }

//         // Function to get AI recommendations
//         const filterKeywords = (query) => {
//             const stopWords = new Set([
//                 "the",
//                 "they",
//                 "them",
//                 "then",
//                 "I",
//                 "we",
//                 "you",
//                 "he",
//                 "she",
//                 "it",
//                 "is",
//                 "a",
//                 "an",
//                 "of",
//                 "and",
//                 "or",
//                 "to",
//                 "for",
//                 "from",
//                 "on",
//                 "who",
//                 "whom",
//                 "why",
//                 "when",
//                 "which",
//                 "with",
//                 "this",
//                 "that",
//                 "in",
//                 "at",
//                 "by",
//                 "be",
//                 "not",
//                 "was",
//                 "were",
//                 "has",
//                 "have",
//                 "had",
//                 "do",
//                 "does",
//                 "did",
//                 "so",
//                 "some",
//                 "any",
//                 "how",
//                 "can",
//                 "could",
//                 "should",
//                 "would",
//                 "there",
//                 "here",
//                 "just",
//                 "than",
//                 "because",
//                 "but",
//                 "its",
//                 "it's",
//                 "if",
//                 ".",
//                 ",",
//                 "!",
//                 "?",
//                 ">",
//                 "<",
//                 ";",
//                 "`",
//                 "1",
//                 "2",
//                 "3",
//                 "4",
//                 "5",
//                 "6",
//                 "7",
//                 "8",
//                 "9",
//                 "10",
//             ]);

//             // Process the query to extract meaningful keywords
//             return query
//                 .toLowerCase()
//                 .replace(/[^\w\s]/g, "")
//                 .split(/\s+/)
//                 .filter((word) => !stopWords.has(word))
//                 .map((word) => `%${word}%`);
//         };

//         // Function to get AI recommendations (mock implementation)
//         const keywords = filterKeywords(userPrompt);

//         // STEP 1: BASIC FILTERING
//         const result = await database.query(
//         `
//             SELECT * FROM products
//             WHERE name ILIKE ANY($1)
//             OR description ILIKE ANY($1)
//             OR category ILIKE ANY($1)
//             LIMIT 200;
//         `,[keywords]);

//         const filteredProducts = result.rows;

//         // Handle case when no products match the basic filtering
//         if (filteredProducts.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "No products found matching your prompt.",
//                 products: [],
//             });
//         }

//         // STEP 2: AI-BASED RECOMMENDATION (Mocked for demonstration)
//         const { success, products } = await getAIRecommendation(
//             req,
//             res,
//             userPrompt,
//             filteredProducts
//         );

//         // Send response
//         res.status(200).json({
//             success: success,
//             message: "AI filtered products.",
//             products,
//         });
//     }
// );
