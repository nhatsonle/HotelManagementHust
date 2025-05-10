import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

// Example function to read data from PostgreSQL
async function readData(tableName, conditions = {}) {
    try {
        // Build the query dynamically based on conditions
        let query = `SELECT * FROM ${tableName}`;
        const values = [];
        
        if (Object.keys(conditions).length > 0) {
            const whereClause = Object.keys(conditions)
                .map((key, index) => `${key} = $${index + 1}`)
                .join(' AND ');
            query += ` WHERE ${whereClause}`;
            values.push(...Object.values(conditions));
        }
        
        // Execute the query using template literal syntax
        const result = await sql`${sql.unsafe(query)}`;
        return result;
    } catch (error) {
        console.error('Error reading data:', error);
        throw error;
    }
}

// Export both the sql connection and the readData function
export { sql as default, readData };

// Test function
async function testDatabase() {
    try {
        // Test reading all rooms
        const rooms = await readData('rooms');
        console.log('All rooms:', rooms);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testDatabase();
