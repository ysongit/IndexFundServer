require("dotenv").config();
const mysql = require("mysql2/promise");

// Adjust these connection details to match your SingleStore deployment:
const HOST = process.env.HOST;
const PORT = 3306;
const USER = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

// main is run at the end
async function connect() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: HOST,
      port: PORT,
      user: USER,
      password: PASSWORD,
      database: DATABASE
    });
    return conn;
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
}

module.exports = connect;