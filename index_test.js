const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// File paths
const inputFilePath = path.join(__dirname, 'json_data.txt'); // Change 'data.txt' if the input file is named differently

// Function to convert JSON array to Excel and save with a timestamp
function convertJsonToExcel() {
  try {
    // Read the JSON array data from the text file
    const jsonData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

    // Check if the data is an array
    if (!Array.isArray(jsonData)) {
      console.error('Data in file is not a valid JSON array');
      return;
    }

    // Create a new workbook and worksheet from the JSON data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate the filename with timestamp and title
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const outputFilePath = path.join(__dirname, `member_${timestamp}.xlsx`);

    // Write the workbook to the Excel file
    XLSX.writeFile(workbook, outputFilePath);

    console.log(`Excel file created successfully: ${outputFilePath}`);
  } catch (error) {
    console.error('Error converting JSON to Excel:', error);
  }
}

// Run the conversion
convertJsonToExcel();
