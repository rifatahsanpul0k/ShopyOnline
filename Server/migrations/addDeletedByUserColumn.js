import database from "../database/db.js";

async function addDeletedByUserColumn() {
    try {
        const query = `ALTER TABLE orders ADD COLUMN IF NOT EXISTS deleted_by_user BOOLEAN DEFAULT false;`;
        await database.query(query);
        console.log("✅ Column 'deleted_by_user' added to orders table successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error adding column:", error);
        process.exit(1);
    }
}

addDeletedByUserColumn();
