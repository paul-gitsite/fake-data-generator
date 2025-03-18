require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const { performance } = require("perf_hooks");

const app = express();
const PORT = 3005;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

app.get("/employees/withOutIndex/:count", (req, res) => {

    const startTime = performance.now(); 
    const count = req.params.count; 

    const sql =  `SELECT e.employeeId, e.employeeName, e.emailAddress, s.salary, s.experienceYear
FROM employee_${count} e
JOIN salary_${count} s ON e.employeeId = s.employeeId;
`
//   const sql = `SELECT * FROM employee_${count}`;
//   const sql = `SELECT * FROM salary_${count}`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }
    const endTime = performance.now(); 
    const executionTime = (endTime - startTime).toFixed(2);
    res.json({ success: true, responseTime: `${executionTime} ms`,length: results.length, data: results });
  });
});


app.get("/employees/withOutIndex/:count/:employeeName", (req, res) => {
    const startTime = performance.now(); 

    const employeeName = req.params.employeeName; 
    const count = req.params.count; 
    const sql =  `SELECT e.employeeId, e.employeeName, e.emailAddress, s.salary, s.experienceYear
FROM employee_${count} e
JOIN salary_${count} s ON e.employeeId = s.employeeId WHERE e.employeeName =?;
`
    // const sql = `SELECT * FROM employee_${count} WHERE employeeId = ?`;
    // const sql = `SELECT * FROM salary_${count} WHERE employeeId = ?`;

  
    db.query(sql, [employeeName], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Employee not found" });
      }
      const endTime = performance.now(); 
      const executionTime = (endTime - startTime).toFixed(2);
      res.json({ success: true,responseTime: `${executionTime} ms`, data: results[0] }); 
    });
  });



//  ---------------------------------x--------------------------


app.get("/employees/withIndex/:count", (req, res) => {

    const startTime = performance.now(); 
    const count = req.params.count; 

    const sql =  `SELECT e.employeeId, e.employeeName, e.emailAddress, s.salary, s.experienceYear
    FROM employee_${count} e
    JOIN salary_${count} s ON e.employeeId = s.employeeId;`
//   const sql = `SELECT * FROM employee_${req.params.count}`;    

  db.query(sql,[req.params.employeeId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }
    const endTime = performance.now(); 
    const executionTime = (endTime - startTime).toFixed(2);
    res.json({ success: true, length: results.length, responseTime: `${executionTime} ms`, data: results });
  });
});



app.get("/employees/withIndex/:count/:employeeId", (req, res) => {

    const startTime = performance.now(); 
    const employeeId = req.params.employeeId; 

    const count = req.params.count; 

//   const sql = `SELECT * FROM employee_${req.params.count} WHERE employeeId = ?`; 
const sql =  `SELECT e.employeeId, e.employeeName, e.emailAddress, s.salary, s.experienceYear
FROM employee_${count} e
JOIN salary_${count} s ON e.employeeId = s.employeeId WHERE e.employeeId = ?;`

  db.query(sql,[employeeId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }
    const endTime = performance.now(); 
    const executionTime = (endTime - startTime).toFixed(2);
    res.json({ success: true, responseTime: `${executionTime} ms`, data: results });
  });
});




  

  
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
