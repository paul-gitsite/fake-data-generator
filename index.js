const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3004;

app.get("/data/:count", async (req, res) => {
  try {
    const startTime = performance.now();

    const count = req.params.count;
    const { employeeId, employeeName } = req.query; 

    if (isNaN(count)) {
      return res.status(400).json({ error: "Invalid count parameter" });
    }

    let query = `
        SELECT e.employeeId, e.employeeName, e.emailAddress, s.salary, s.experiencedYear
        FROM employee_${count} e
        JOIN salary_${count} s ON e.employeeId = s.employeeId `;

    const queryParams = [];

    if (employeeId) {
      query += ` WHERE e.employeeId = $1;`;
      queryParams.push(employeeId);
    } else if (employeeName) {
      query += ` WHERE e.employeeName ILIKE $1;`;
      queryParams.push(`%${employeeName}%`);
    }

    const result = await pool.query(query, queryParams);

    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);

    res.json({
      success: true,
      length: result.rows.length,
      responseTime: `${executionTime} ms`,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// app.get("/data/:count", async (req, res) => {
//   try {
//     const startTime = performance.now();

//     const count = req.params.count
//     const result =  await pool.query(`SELECT e.employeeId, e.employeeName, e.emailAddress, s.salary, s.experiencedYear
//     FROM employees_${count} e
//     JOIN salary_${count} s ON e.employeeId = s.employeeId;`)
//         const endTime = performance.now();
//         const executionTime = (endTime - startTime).toFixed(2);
//     res.json({ success: true,length:result.rows.length, responseTime: `${executionTime} ms`,data:result.rows, });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// app.get("/data/:count/:employeeId", async (req, res) => {
//     try {
//       const startTime = performance.now();

//       const count =req.params.count;
//       const employeeId = req.params.employeeId;

//       if (isNaN(count)) {
//         return res.status(400).json({ error: "Invalid count parameter" });
//       }

//       const query = `
//         SELECT e.employeeId, e.employeeName, e.emailAddress, s.salary, s.experiencedYear
//         FROM employees_${count} e
//         JOIN salary_${count} s ON e.employeeId = s.employeeId
//         WHERE e.employeeId = $1;
//       `;

//       const result = await pool.query(query, [employeeId]);

//       const endTime = performance.now();
//       const executionTime = (endTime - startTime).toFixed(2);

//       res.json({
//         success: true,
//         length: result.rows.length,
//         responseTime: `${executionTime} ms`,
//         data: result.rows,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Database error" });
//     }
//   });

//   app.get("/data/:count/:employeeName", async (req, res) => {
//     try {
//       const startTime = performance.now();

//       const count = req.params.count;
//       const employeeName = req.params.employeeName;
//   console.log(employeeName);

//       if (isNaN(count)) {
//         return res.status(400).json({ error: "Invalid count parameter" });
//       }

//       const query = `
//         SELECT e.employeeId, e.employeeName, e.emailAddress, s.salary, s.experiencedYear
//         FROM employees_${count} e
//         JOIN salary_${count} s ON e.employeeId = s.employeeId
//         WHERE e.employeeName = $1;
//       `;

//       const result = await pool.query(query, [employeeName]);

//       const endTime = performance.now();
//       const executionTime = (endTime - startTime).toFixed(2);

//       res.json({
//         success: true,
//         length: result.rows.length,
//         responseTime: `${executionTime} ms`,
//         data: result.rows,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Database error" });
//     }
//   });
