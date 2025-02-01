const { connection } = require('../../config/db.config');
const { db } = require('../../config/env.config');

(() => {
  const schema = db.database;
  const dropSchemaQuery = `DROP SCHEMA IF EXISTS ${schema};`;
  const createSchemaQuery = `CREATE SCHEMA ${schema};`;
  const dropTableQuery = `DROP TABLE IF EXISTS users;`;
  const createTableQuery = `
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      role ENUM('admin', 'user') NOT NULL,
      password VARCHAR(255),
      passwordTimeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");

    // Drop Schema if it exists
    connection.query(dropSchemaQuery, async err => {
      if (err) throw err;
      console.log(`Success: ${schema} schema dropped`);

      // Create Schema
      connection.query(createSchemaQuery, async err => {
        if (err) throw err;
        console.log(`Success: ${schema} schema created`);

        // Switch to the schema
        connection.changeUser({ database: schema }, async err => {
          if (err) throw err;
          console.log(`Success: Switched to ${schema} schema`);
          // Create Table
          connection.query(dropTableQuery, err => {
            if (err) throw err;
            console.log('Success: users table dropped');
          });
          connection.query(createTableQuery, err => {
            if (err) throw err;
            console.log('Success: users table created');
            connection.end();
          });
        });
      });
    });
  });
})();
