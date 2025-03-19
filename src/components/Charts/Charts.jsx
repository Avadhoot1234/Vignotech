import React, { useState, useEffect, useMemo } from "react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Charts = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // State for filters
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
      })
      .catch((error) => console.error("Error fetching student data:", error));
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
        student.marks?.maths >= minMaths &&
        student.marks?.science >= minScience &&
        student.marks?.english >= minEnglish
    );

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when filters are applied
  }, [selectedClass, selectedSection, minAttendance, minMaths, minScience, minEnglish, students]);

  // Compute chart data
  const attendanceData = useMemo(() =>
    students.map((student) => ({ name: student.name, attendance: student.attendance || 0 })),
    [students]
  );

  const marksData = useMemo(() =>
    students.map((student) => ({
      name: student.name,
      maths: student.marks?.maths || 0,
      science: student.marks?.science || 0,
      english: student.marks?.english || 0,
    })),
    [students]
  );

  const pieData = useMemo(() => {
    const classCount = students.reduce((acc, student) => {
      acc[student.class] = (acc[student.class] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(classCount).map((className) => ({
      name: `Class ${className}`,
      value: classCount[className],
    }));
  }, [students]);

  // Get current students for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

        {/* Charts Section */}
        <div className="charts-container">
          <div className="chart-box">
            <h3>📊 Attendance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>📈 Subject-wise Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marksData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="maths" stroke="#8884d8" />
                <Line type="monotone" dataKey="science" stroke="#82ca9d" />
                <Line type="monotone" dataKey="english" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>📊 Class-wise Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
