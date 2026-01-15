import bcrypt from "bcrypt";
import database from "../database/db.js";

async function resetAdminPassword() {
  try {
    const newPassword = "admin123";
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update admin@example.com password
    await database.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, "admin@example.com"]
    );
    
    // Update rifat@gmail.com password
    await database.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, "rifat@gmail.com"]
    );
    
    console.log("\n✅ Admin passwords have been reset!");
    console.log("\nYou can now login with:");
    console.log("  Email: admin@example.com OR rifat@gmail.com");
    console.log("  Password: admin123\n");
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

resetAdminPassword();
