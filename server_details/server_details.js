const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3030;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'formdetails'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Route to handle registration form submission
app.post('/register', (req, res) => {
  const { firstName, lastName, email, mobile, highestQualification, password } = req.body;
  const sql = 'INSERT INTO registrationdetails (firstName, lastName, email, mobile, highestQualification, password) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [firstName, lastName, email, mobile, highestQualification, password], (err, result) => {
    if (err) {
      console.error('Error registering:', err); // Log the error message
      res.status(500).send('Error registering. Please try again later.');
      return;
    }
    console.log('Registration successful!');
    res.status(200).send('Registration successful!');
  });
});

// Route to update student details
// Route to update student details
app.put('/student/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, mobile, highestQualification, password } = req.body;
  const sql = `UPDATE registrationdetails SET firstName = ?, lastName = ?, email = ?, mobile = ?, highestQualification = ?, password = ? WHERE id = ?`;
  connection.query(sql, [firstName, lastName, email, mobile, highestQualification, password, id], (err, result) => {
    if (err) {
      console.error('Error updating student details:', err);
      res.status(500).send('Error updating student details. Please try again later.');
      return;
    }
    console.log('Student details updated successfully!');
    res.status(200).send('Student details updated successfully!');
  });
});

// Route to fetch student details
app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM registrationdetails';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.status(500).send('Error fetching students. Please try again later.');
      return;
    }
    res.status(200).json(result);
  });
});
// Add the route to delete student data
// Add the route to delete student data
app.delete('/student/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM registrationdetails WHERE id = ?`;
  connection.query(sql, id, (err, result) => {
    if (err) {
      console.error('Error deleting student data:', err);
      res.status(500).send('Error deleting student data. Please try again later.');
      return;
    }
    console.log('Student data deleted successfully!');
    res.status(200).send('Student data deleted successfully!');
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
