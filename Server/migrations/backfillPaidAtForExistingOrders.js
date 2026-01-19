import database from "../database/db.js";

async function backfillPaidAt() {
    try {
        // Update paid_at for orders where paid_at is NULL (set it to created_at as fallback)
        const query = `
            UPDATE orders 
            SET paid_at = created_at 
            WHERE paid_at IS NULL;
        `;

        const result = await database.query(query);
        console.log(`✅ Successfully backfilled paid_at for ${result.rowCount} orders`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error backfilling paid_at:", error);
        process.exit(1);
    }
}

backfillPaidAt();
