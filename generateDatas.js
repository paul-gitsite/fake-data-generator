const fs = require("fs");
const { faker } = require("@faker-js/faker");
const fastCsv = require("fast-csv");

const filePath = "employees.csv";
const numberOfRecords =5; 

const generateAlphanumeric = (length) => faker.string.alphanumeric(length).toUpperCase();

const ws = fs.createWriteStream(filePath);
const csvStream = fastCsv.format({ headers: true });

csvStream.pipe(ws);

for (let i = 0; i < numberOfRecords; i++) {
  csvStream.write({
    username: generateAlphanumeric(8), 
    emailaddress: faker.internet.email(), 
    employeeId: generateAlphanumeric(6), 
    experienceId: faker.number.int({ min: 1, max: 10 }), 
    salary: faker.number.int({ min: 10000, max: 90000 }), 
  });
}

csvStream.end();

ws.on("finish", () => {
  console.log(`CSV file (${filePath}) with ${numberOfRecords} records generated successfully.`);
});
