// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Use bodyParser to parse incoming JSON data from the frontend
app.use(bodyParser.json());

// Serve static files (like your index.html) from the 'public' folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Define the path for the data file (will be created in the root project folder)
const dataFilePath = path.join(__dirname, '..', 'user_data.csv');

// --- Main Data Submission Endpoint ---
app.post('/submit-data', (req, res) => {
    const { name, age, location, skills } = req.body;
    
    // Simple validation (pro-developer standard)
    if (!name || !age || !location || !skills) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    // Format the data as a CSV row
    // Excel/CSV files use '\r\n' for a new line on Windows
    const csvRow = `${name},${age},${location},"${skills}"\r\n`;

    // Write the data to the file (appending it)
    fs.appendFile(dataFilePath, csvRow, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send({ message: 'Error saving data on the server.' });
        }
        
        console.log('Data successfully saved:', csvRow.trim());
        res.status(200).send({ message: 'Data successfully recorded!' });
    });
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Data will be saved in: ${dataFilePath}`);
    
    // Check if the file exists, if not, create it and add the header row
    if (!fs.existsSync(dataFilePath)) {
        console.log('Creating new data file with headers...');
        const header = 'Name,Age,Location,Skills\r\n';
        fs.writeFileSync(dataFilePath, header);
    }
});