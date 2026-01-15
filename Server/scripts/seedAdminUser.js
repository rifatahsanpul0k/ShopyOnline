import bcrypt from "bcrypt";
import database from "../database/db.js";
import { config } from "dotenv";

config({ path: "./config/config.env" });

const seedAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await database.query(
      "SELECT * FROM users WHERE role = 'Admin' LIMIT 1"
    );

    if (existingAdmin.rows.length > 0) {
      console.log("Admin user already exists!");
      console.log("Email:", existingAdmin.rows[0].email);
      process.exit(0);
    }

    // Create admin user
    const adminEmail = "admin@shopy.com";
    const adminPassword = "admin123"; // Change this to a secure password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const result = await database.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      ["Admin User", adminEmail, hashedPassword, "Admin"]
    );

    console.log("✅ Admin user created successfully!");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("⚠️  Please change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

seedAdminUser();
