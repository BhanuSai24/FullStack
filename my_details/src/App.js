import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [view, setView] = useState('registration');
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    id: '', // Add id field
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    highestQualification: '',
    password: ''
  });
  const [editData, setEditData] = useState({
    id: '',
    columnName: '',
    newValue: ''
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3030/register', formData);
      alert('Registration successful!');
      setFormData({
        id: '', // Reset id field
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        highestQualification: '',
        password: ''
      });
      fetchStudents(); // Refresh student list after registration
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error registering. Please try again later.');
    }
  };
  // Inside the handleDelete function
const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this student's data?");
  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:3030/student/${id}`);
      alert('Student data deleted successfully!');
      fetchStudents(); // Refresh student list after deletion
    } catch (error) {
      console.error('Error deleting student data:', error);
      alert('Error deleting student data. Please try again later.');
    }
  }
};



// Inside handleEditSubmit function
const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://localhost:3030/student/${selectedStudent.id}`, formData);
    alert('Student details updated successfully!');
    // After updating, fetch updated data
    fetchStudents(); 
  } catch (error) {
    console.error('Error updating student details:', error);
    alert('Error updating student details. Please try again later.');
  }
};

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3030/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error fetching students. Please try again later.');
    }
  };
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setView('studentDetails');
  };

  const handleEditDetails = (student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      mobile: student.mobile,
      highestQualification: student.highestQualification,
      password: student.password
    });
    setView('editDetails');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <ul>
          <li onClick={() => setView('registration')} className={view === 'registration' ? 'active' : ''}>
            Registration Form
          </li>
          <li onClick={() => setView('students')} className={view === 'students' ? 'active' : ''}>
            Student Details
          </li>
        </ul>
      </nav>

      <div className={view === 'registration' ? 'form-container' : 'hidden'}>
        <h2>Registration Form</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" required />
          <input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleChange} placeholder="Highest Qualification" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      </div>
      
      {view === 'studentDetails' && selectedStudent && (
        <div className="student-details-container">
          <h2>Student Details</h2>
          <table className="student-details-table">
            <tbody>
              <tr>
                <td><strong>ID:</strong></td>
                <td>{selectedStudent.id}</td>
              </tr>
              <tr>
                <td><strong>First Name:</strong></td>
                <td>{selectedStudent.firstName}</td>
              </tr>
              <tr>
                <td><strong>Last Name:</strong></td>
                <td>{selectedStudent.lastName}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{selectedStudent.email}</td>
              </tr>
              <tr>
                <td><strong>Mobile:</strong></td>
                <td>{selectedStudent.mobile}</td>
              </tr>
              <tr>
                <td><strong>Highest Qualification:</strong></td>
                <td>{selectedStudent.highestQualification}</td>
              </tr>
              <tr>
                <td><strong>Password:</strong></td>
                <td>{selectedStudent.password}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={() => setView('students')}>Back</button>
        </div>
      )}


      {view === 'students' && (
        <div className="table-container">
          <h2>Student Details</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Highest Qualification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.id}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.mobile}</td>
                    <td>{student.highestQualification}</td>
                    <td>
                      <span className="action-icons">
                        <FontAwesomeIcon icon={faEdit} onClick={() => handleEditDetails(student)} />
                        <FontAwesomeIcon icon={faEye} onClick={() => handleViewDetails(student)} />
                        <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(student.id)} />

                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No student data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedStudent && (
        <div className={view === 'editDetails' ? 'form-container' : 'hidden'}>
        <h2>Edit Student Details</h2>
        <form onSubmit={handleEditSubmit}>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" required />
          <input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleChange} placeholder="Highest Qualification" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <button type="submit">Update</button>
        </form>
      </div>
      )}
    </div>
  );
}

export default App;
