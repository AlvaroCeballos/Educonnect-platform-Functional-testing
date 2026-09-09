const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  port:             Number(process.env.DB_PORT) || 3306,
  database:         process.env.DB_NAME     || 'educonnect',
  user:             process.env.DB_USER     || 'eduuser',
  password:         process.env.DB_PASSWORD || 'edupassword',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  timezone:         '+00:00',
});

module.exports = pool;