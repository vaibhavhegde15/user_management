const { pool } = require('../../config/db.config');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const adminPass = await bcrypt.hash('admin', 10);
    const userPass = await bcrypt.hash('user', 10)
    const insertUsersQuery = `
      INSERT INTO users (name, email, role, password)
      VALUES
        ('Admin User', 'admin@example.com', 'admin', ?),
        ('Regular User', 'user@example.com', 'user', ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        role = VALUES(role),
        password = VALUES(password)
    `;

    await pool.execute(insertUsersQuery, [adminPass, userPass]);
    console.log('Seeding success');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
})();
