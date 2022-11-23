const mysql = require('mysql2');

const pool = mysql.createPool({
// 名字怎樣都可以
    host: 'localhost',
    user: 'root',
    password:'root',
    database: 'ispan_project3',
    waitForConnections: true,
    connectionLimit: 5,
		// 最大連線數
    queueLimit: 0,
		// 允許排隊人數
  });

  module.exports = pool.promise();
	// exports，這邊記得要用mysql2的promise()。