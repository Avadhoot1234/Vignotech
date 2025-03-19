import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Charts from "../Charts/Charts";


const StudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // State for filters
  const [searchName, setSearchName] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [minAttendance, setMinAttendance] = useState(0);
  const [minMaths, setMinMaths] = useState(0);
  const [minScience, setMinScience] = useState(0);
  const [minEnglish, setMinEnglish] = useState(0);

  useEffect(() => {
    fetch("/students_data.json")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data.students || []);
        setFilteredStudents(data.students || []);
      })
      .catch((error) => console.error("Error fetching student data:", error));
      const attendanceData = students.map((student) => ({
        name: student.name,
        attendance: student.attendance || 0,
      }));

      // Generate Marks Data for Line Chart
      const marksData = students.map((student) => ({
        name: student.name,
        maths: student.marks.maths || 0,
        science: student.marks.science || 0,
        english: student.marks.english || 0,
    }));
  }, []);

  // Function to filter students
  useEffect(() => {
    let filtered = students;

    if (selectedClass !== "All") {
      filtered = filtered.filter((student) => student.class === selectedClass);
    }
    if (selectedSection !== "All") {
      filtered = filtered.filter((student) => student.section === selectedSection);
    }
    filtered = filtered.filter(
      (student) =>
        student.attendance >= minAttendance &&
        student.marks.maths >= minMaths &&
        student.marks.science >= minScience &&
        student.marks.english >= minEnglish
    );

    if (searchName.trim() !== "") {
        filtered = filtered.filter((student) =>
          student.name.toLowerCase().includes(searchName.toLowerCase())
        );
      }
    

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when filters are applied
  }, [searchName,selectedClass, selectedSection, minAttendance, minMaths, minScience, minEnglish, students]);

  // Get current students for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">📚 Student Dashboard</h2>

        {/* Filter Section */}
        <div className="filter-container">
          <div className="filter-group">
            <label>Class:</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="All">All</option>
              <option value="9th">Class 9</option>
              <option value="10th">Class 10</option>
              <option value="11th">Class 11</option>
              <option value="12th">Class 12</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search by Name:</label>
  <input 
    type="text" 
    placeholder="Enter student name..." 
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
  />
</div>

          <div className="filter-group">
            <label>Section:</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              <option value="All">All</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Attendance (%):</label>
            <input
              type="number"
              value={minAttendance}
              onChange={(e) => setMinAttendance(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div className="filter-group">
            <label>Min Maths Marks:</label>
            <input
              type="number"
              value={minMaths}
              onChange={(e) => setMinMaths(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div className="filter-group">
            <label>Min Science Marks:</label>
            <input
              type="number"
              value={minScience}
              onChange={(e) => setMinScience(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div className="filter-group">
            <label>Min English Marks:</label>
            <input
              type="number"
              value={minEnglish}
              onChange={(e) => setMinEnglish(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Class</th>
                <th>Section</th>
                <th>Attendance (%)</th>
                <th>Maths</th>
                <th>Science</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.roll_number}</td>
                    <td>{student.class}</td>
                    <td>{student.section}</td>
                    <td>{student.attendance}%</td>
                    <td>{student.marks.maths}</td>
                    <td>{student.marks.science}</td>
                    <td>{student.marks.english}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">No matching students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
              {i + 1}
            </button>
          ))}
        </div>
        
        <Charts/>
        

      </div>
    </div>
  );
};

export default StudentDashboard;
