import database from "../database/db.js";

async function checkUsers() {
  try {
    const result = await database.query(
      "SELECT id, name, email, role FROM users ORDER BY id"
    );
    
    console.log("\n========================================");
    console.log("   Users in Database");
    console.log("========================================\n");
    
    if (result.rows.length === 0) {
      console.log("No users found in database!");
    } else {
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user.id}\n`);
      });
    }
    
    console.log("========================================\n");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkUsers();
