
import mysql from "mysql2/promise";
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Asus@1234',
  database: 'examportal'
}).catch((error) => {
  console.error("Error connecting to MySQL database:", error);
});
export default db;
