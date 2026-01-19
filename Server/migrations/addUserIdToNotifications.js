import database from "../database/db.js";

async function addUserIdToNotifications() {
    try {
        const query = `
            ALTER TABLE notifications 
            ADD COLUMN IF NOT EXISTS user_id UUID,
            ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        `;
        await database.query(query);
        console.log("✅ Column 'user_id' added to notifications table successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error adding column:", error);
        process.exit(1);
    }
}

addUserIdToNotifications();
