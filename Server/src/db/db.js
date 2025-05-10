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
        
        // Execute the query
        const result = await sql(query, values);
        return result;
    } catch (error) {
        console.error('Error reading data:', error);
        throw error;
    }
}

// Export both the sql connection and the readData function
export { sql as default, readData };

// Example usage:
// Read all records from a table
const allRecords = await readData('rooms');

// // Read records with conditions
// const filteredRecords = await readData('guests', { 
//     status: 'active',
//     role: 'admin'
// });