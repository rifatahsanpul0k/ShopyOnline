import database from "../database/db.js";

export const createNotificationsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            related_id UUID,
            related_type VARCHAR(50),
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
    `;

    try {
        await database.query(query);
    } catch (error) {
        console.error("Error creating notifications table:", error);
    }
};
