const {Client}  = require('pg');

const client = new Client({
    user: 'postgres.owmhoegdsaeilrpkardv',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',  
    database: 'postgres',
    password: 'hmshms',
    port: 5432, 
});

client.connect();

client.query('SELECT * from roomtypes', (err, res) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(res.rows);
    }
    client.end();
});