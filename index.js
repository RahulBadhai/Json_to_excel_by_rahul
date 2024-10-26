const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
const upload = multer(); // No file storage configuration (keeps files in memory)

// Endpoint to upload text file and return Excel file
app.use(express.static('public'));

// app.get('/',(req,res) => {
//     console.log('hiiii')
//     res.status(200).json({ error: 'Failed to process the file' });
// })
app.post('/convert-to-excel', upload.single('file'), (req, res) => {
    // res.status(500).json({ error: 'Failed to process the file' });
  try {
    // Ensure file is provided and read its contents
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const jsonData = JSON.parse(req.file.buffer.toString('utf-8'));

    // Check if data is a valid JSON array
    if (!Array.isArray(jsonData)) {
      return res.status(400).json({ error: 'File content is not a valid JSON array' });
    }

    // Convert JSON data to Excel format in memory
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate the Excel file as a buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers and send the file as attachment
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const filename = `member_${timestamp}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process the file' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});


