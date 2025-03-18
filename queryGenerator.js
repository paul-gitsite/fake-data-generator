const fs = require("fs");
const { faker } = require("@faker-js/faker");

const filePath = "query.sql";
const numberOfRecords = 50000;

const generateAlphanumeric = (length) =>
  faker.string.alphanumeric(length).toUpperCase();

const ws = fs.createWriteStream(filePath);

const createTableQuery = `
DROP TABLE IF EXISTS salary_${numberOfRecords};
DROP TABLE IF EXISTS employees_${numberOfRecords};

CREATE TABLE employees_${numberOfRecords} (
  id SERIAL PRIMARY KEY,
  employeeName VARCHAR(50) NOT NULL,
  emailAddress VARCHAR(255) NOT NULL UNIQUE,
  employeeId VARCHAR(6) NOT NULL UNIQUE
);

CREATE INDEX idx_employeeId ON employees_${numberOfRecords} (employeeId);

CREATE TABLE salary_${numberOfRecords} (
  id SERIAL PRIMARY KEY,
  employeeId VARCHAR(6) NOT NULL,
  salary INT CHECK (salary BETWEEN 10000 AND 90000),
  experiencedYear INT CHECK (experiencedYear BETWEEN 1 AND 10),
  FOREIGN KEY (employeeId) REFERENCES employees_${numberOfRecords}(employeeId) ON DELETE CASCADE
);

CREATE INDEX idx_employeeId_salary ON salary_${numberOfRecords} (employeeId);

\n`;

ws.write(createTableQuery);

let employees_insertQuery = `INSERT INTO employees_${numberOfRecords} (employeeName, emailAddress, employeeId) VALUES\n`;
let salary_insertQuery = `INSERT INTO salary_${numberOfRecords} (employeeId, salary, experiencedYear) VALUES\n`;

const employees = [];
const salaries = [];
const usedEmails = new Set();
const usedEmployeeIds = new Set();

for (let i = 0; i < numberOfRecords; i++) {
  let employeeName, emailAddress, employeeId;

  do {
    employeeName = faker.person.firstName();
    emailAddress = faker.internet.email();
  } while (usedEmails.has(emailAddress));

  do {
    employeeId = generateAlphanumeric(6);
  } while (usedEmployeeIds.has(employeeId));

  usedEmails.add(emailAddress);
  usedEmployeeIds.add(employeeId);

  const experiencedYear = faker.number.int({ min: 1, max: 10 });
  const salary = faker.number.int({ min: 10000, max: 90000 });

  employees.push(`('${employeeName}', '${emailAddress}', '${employeeId}')`);
  salaries.push(`('${employeeId}', ${salary}, ${experiencedYear})`);
}

employees_insertQuery += employees.join(",\n") + ";\n\n";
salary_insertQuery += salaries.join(",\n") + ";\n";

ws.write(employees_insertQuery);
ws.write(salary_insertQuery);

ws.end();

ws.on("finish", () => {
  console.log(
    `SQL file (${filePath}) with table creation and ${numberOfRecords} INSERT queries generated successfully.`
  );
});
