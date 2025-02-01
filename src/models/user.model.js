const { pool } = require('../config/db.config');

async function createUser({ name, email, role, password }) {
  const query = `INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)`;
  const [result] = await pool.execute(query, [name, email, role, password]);
  return result.insertId;
}

async function getAllUsers() {
  const query = 'SELECT id, name, email, role FROM users';
  const [rows] = await pool.execute(query);
  return rows;
}

async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await pool.execute(query, [email]);
  return rows[0];
}

async function getUserById(id) {
  const query = 'SELECT id, name, email, role FROM users WHERE id = ?';
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
}

async function updateUser(id, userData) {
  let queryString = '', queryData = [];
  for(key in userData){
    queryString += ` ${key} = ?,`;
    queryData.push(userData[key]);
  }
  if(Object.keys(userData).includes('password')){
    queryString += ` passwordTimeStamp = ?,`;
    queryData.push(new Date());
  }
  queryString = queryString.slice(0, -1);
  const query = `UPDATE users SET${queryString} WHERE id = ?`;
  const [result] = await pool.execute(query, [...queryData, id]);
  return result.affectedRows;
}

async function deleteUser(id) {
  const query = 'DELETE FROM users WHERE id = ?';
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
}

async function getPasswordTimeStampById(id) {
  const query = 'SELECT passwordTimeStamp FROM users WHERE id = ?';
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getPasswordTimeStampById
};
