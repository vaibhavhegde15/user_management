const mysql = require('mysql2/promise');
const { db } = require('./env.config');
const mysqlCon = require('mysql2');


const connection = mysqlCon.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
});

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = {pool, connection};
