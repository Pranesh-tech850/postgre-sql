import { useState } from "react";
import "./Students.css";

function Students() {

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");

    const [searchTime, setSearchTime] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [editingStudent, setEditingStudent] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        course: ""
    });


    // ========================================
    // FETCH ALL STUDENTS
    // ========================================

    const fetchStudents = async () => {

        try {

            setLoading(true);

            const startTime = performance.now();

            const response = await fetch(
                "http://localhost:8000/students"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }

            const data = await response.json();

            const endTime = performance.now();

            setStudents(data);

            setSearchTime(endTime - startTime);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // SEARCH STUDENT
    // ========================================

    const searchStudent = async () => {

        if (!email.trim()) {

            fetchStudents();

            return;
        }


        try {

            setLoading(true);

            const startTime = performance.now();


            const response = await fetch(
                `http://localhost:8000/students/search?email=${encodeURIComponent(email)}`
            );


            if (!response.ok) {
                throw new Error("Failed to search students");
            }


            const data = await response.json();


            const endTime = performance.now();


            setStudents(data);

            setSearchTime(endTime - startTime);


        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // FORM INPUT CHANGE
    // ========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // ========================================
    // OPEN ADD FORM
    // ========================================

    const handleAdd = () => {

        setEditingStudent(null);

        setFormData({
            name: "",
            email: "",
            age: "",
            course: ""
        });

        setShowForm(true);

    };


    // ========================================
    // OPEN EDIT FORM
    // ========================================

    const handleEdit = (student) => {

        setEditingStudent(student);

        setFormData({
            name: student.name,
            email: student.email,
            age: student.age,
            course: student.course
        });

        setShowForm(true);

    };


    // ========================================
    // ADD / UPDATE STUDENT
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            // ====================================
            // UPDATE
            // ====================================

            if (editingStudent) {

                const response = await fetch(
                    `http://localhost:8000/students/${editingStudent.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            age: Number(formData.age),
                            course: formData.course
                        })
                    }
                );


                if (!response.ok) {
                    throw new Error("Failed to update student");
                }

            }


            // ====================================
            // ADD
            // ====================================

            else {

                const response = await fetch(
                    "http://localhost:8000/students",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            age: Number(formData.age),
                            course: formData.course
                        })
                    }
                );


                if (!response.ok) {
                    throw new Error("Failed to add student");
                }

            }


            // Refresh table

            await fetchStudents();

            setShowForm(false);


        } catch (error) {

            console.error(error);

        }

    };


    // ========================================
    // DELETE STUDENT
    // ========================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8000/students/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {
                throw new Error("Failed to delete student");
            }


            await fetchStudents();


        } catch (error) {

            console.error(error);

        }

    };


    // ========================================
    // CLEAR SEARCH
    // ========================================

    const clearSearch = () => {

        setEmail("");

        setSearchTime(null);

        fetchStudents();

    };


    return (

        <section className="students-section">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="students-header">


                <div>

                    <span className="section-label">
                        DATABASE
                    </span>

                    <h2>
                        Students
                    </h2>

                    <p>
                        Manage and explore student records
                    </p>

                </div>


                <div className="student-actions">


                    {/* ADD */}

                    <button
                        className="add-student-btn"
                        onClick={handleAdd}
                    >
                        + Add Student
                    </button>


                    {/* FETCH */}

                    <button
                        className="fetch-btn"
                        onClick={fetchStudents}
                    >
                        {loading
                            ? "Loading..."
                            : "Fetch Students"
                        }
                    </button>


                </div>

            </div>


            {/* ========================================
                STUDENTS CARD
            ======================================== */}

            <div className="students-card">


                {/* ========================================
                    TOP BAR
                ======================================== */}

                <div className="table-top">


                    <div>

                        <h3>
                            Student Records
                        </h3>

                        <span>
                            {students.length} records
                        </span>


                        {/* SEARCH TIME */}

                        {searchTime !== null && (

                            <span className="search-time">

                                Search time:
                                {" "}
                                {searchTime.toFixed(2)}
                                {" "}
                                ms

                            </span>

                        )}

                    </div>


                    {/* ========================================
                        SEARCH
                    ======================================== */}

                    <div className="student-search">


                        <input
                            type="text"
                            placeholder="Search student..."
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    searchStudent();
                                }

                            }}
                        />


                        <button
                            className="search-btn"
                            onClick={searchStudent}
                        >
                            Search
                        </button>


                        {email && (

                            <button
                                className="clear-search-btn"
                                onClick={clearSearch}
                            >
                                Clear
                            </button>

                        )}

                    </div>

                </div>


                {/* ========================================
                    EMPTY STATE
                ======================================== */}

                {students.length === 0 ? (

                    <div className="empty-state">


                        <div className="empty-icon">
                            👨‍🎓
                        </div>


                        <h3>
                            No students found
                        </h3>


                        <p>
                            Fetch students or search for a student.
                        </p>


                    </div>

                ) : (


                    /* ========================================
                        TABLE
                    ======================================== */

                    <div className="table-wrapper">


                        <table>


                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Age
                                    </th>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>


                                {students.map((student) => (

                                    <tr key={student.id}>


                                        {/* ID */}

                                        <td>

                                            <span className="id-badge">
                                                #{student.id}
                                            </span>

                                        </td>


                                        {/* NAME */}

                                        <td>

                                            <div className="student-name">
                                                {student.name}
                                            </div>

                                        </td>


                                        {/* EMAIL */}

                                        <td>
                                            {student.email}
                                        </td>


                                        {/* AGE */}

                                        <td>
                                            {student.age}
                                        </td>


                                        {/* COURSE */}

                                        <td>

                                            <span className="course-badge">
                                                {student.course}
                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="student-table-actions">


                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(student)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(student.id)
                                                    }
                                                >
                                                    Delete
                                                </button>


                                            </div>

                                        </td>


                                    </tr>

                                ))}


                            </tbody>


                        </table>


                    </div>

                )}

            </div>


            {/* ========================================
                ADD / EDIT MODAL
            ======================================== */}

            {showForm && (

                <div className="student-modal-overlay">


                    <div className="student-modal">


                        {/* MODAL HEADER */}

                        <div className="student-modal-header">


                            <h3>

                                {editingStudent
                                    ? "Edit Student"
                                    : "Add Student"
                                }

                            </h3>


                            <button
                                className="close-modal-btn"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                ×
                            </button>


                        </div>


                        {/* FORM */}

                        <form onSubmit={handleSubmit}>


                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* AGE */}

                            <div className="form-group">

                                <label>
                                    Age
                                </label>

                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* COURSE */}

                            <div className="form-group">

                                <label>
                                    Course
                                </label>

                                <input
                                    type="text"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* MODAL BUTTONS */}

                            <div className="modal-actions">


                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-btn"
                                >

                                    {editingStudent
                                        ? "Update Student"
                                        : "Add Student"
                                    }

                                </button>


                            </div>


                        </form>


                    </div>


                </div>

            )}

        </section>

    );

}

export default Students;