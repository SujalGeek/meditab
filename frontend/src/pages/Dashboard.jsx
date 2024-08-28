import React, { useState } from "react";
import "./Dashboard.css"; // Ensure the path is correct

const Dashboard = () => {
  // Static data for testing
  const [doctorData, setDoctorData] = useState({
    doctor: {
      _id: "1",
      opdAppointments: [
        {
          _id: "1",
          patientName: "John Doe",
          status: "Completed",
        },
        {
          _id: "2",
          patientName: "Jane Smith",
          status: "Pending",
        },
      ],
    },
    todayOPDList: [
      {
        _id: "1",
        patientName: "Alice Brown",
        status: "Completed",
      },
      {
        _id: "2",
        patientName: "Bob Johnson",
        status: "Pending",
      },
    ],
  });

  // State to manage edit mode and selected appointment
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({
    patientName: "",
    time: "",
    status: "Pending",
  });

  // Toggle status between "Pending" and "Completed"
  const toggleStatus = (appointmentId, type) => {
    const updatedData = { ...doctorData };
    const appointments = updatedData[type].map((appointment) => {
      if (appointment._id === appointmentId) {
        return {
          ...appointment,
          status: appointment.status === "Pending" ? "Completed" : "Pending",
        };
      }
      return appointment;
    });

    updatedData[type] = appointments;
    setDoctorData(updatedData);
  };

  // Enter edit mode and set data
  const enterEditMode = (appointment, type) => {
    setEditMode({ id: appointment._id, type });
    setEditData({
      patientName: appointment.patientName,
      time: appointment.time,
      status: appointment.status,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited data
  const saveEdit = () => {
    const updatedData = { ...doctorData };
    const appointments = updatedData[editMode.type].map((appointment) => {
      if (appointment._id === editMode.id) {
        return { ...appointment, ...editData };
      }
      return appointment;
    });

    updatedData[editMode.type] = appointments;
    setDoctorData(updatedData);
    setEditMode(null);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditMode(null);
  };

  const { doctor, todayOPDList } = doctorData;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Doctor Dashboard</h1>
      <div className="dashboard-content">
        {/* Today's Appointments */}
        <div className="dashboard-item">
          <h2 className="dashboard-item-title">Today's Appointments</h2>
          {todayOPDList.length > 0 ? (
            <ul className="appointment-list">
              {todayOPDList.map((appointment) => (
                <li key={appointment._id} className="appointment-item">
                  <div className="appointment-details">
                    <p>
                      <strong>Patient:</strong> {appointment.patientName}
                    </p>
                  </div>
                  <div className="appointment-actions">
                    <div className="status-toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={appointment.status === "Completed"}
                          onChange={() =>
                            toggleStatus(appointment._id, "todayOPDList")
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                      <p className="status-text">{appointment.status}</p>
                    </div>
                    <button
                      className="edit-btn"
                      onClick={() => enterEditMode(appointment, "todayOPDList")}
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments for today.</p>
          )}
        </div>

        {/* OPD Appointments */}
        <div className="dashboard-item">
          <h2 className="dashboard-item-title">OPD Appointments</h2>
          {doctor.opdAppointments.length > 0 ? (
            <ul className="appointment-list">
              {doctor.opdAppointments.map((appointment) => (
                <li key={appointment._id} className="appointment-item">
                  <div className="appointment-details">
                    <p>
                      <strong>Patient:</strong> {appointment.patientName}
                    </p>
                  </div>
                  <div className="appointment-actions">
                    <div className="status-toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={appointment.status === "Completed"}
                          onChange={() =>
                            toggleStatus(appointment._id, "opdAppointments")
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                      <p className="status-text">{appointment.status}</p>
                    </div>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        enterEditMode(appointment, "opdAppointments")
                      }
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No OPD appointments available.</p>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {editMode && (
        <div className="edit-form">
          <h2>Edit Appointment</h2>
          <label>
            Patient Name:
            <input
              type="text"
              name="patientName"
              value={editData.patientName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Time:
            <input
              type="text"
              name="time"
              value={editData.time}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Status:
            <select
              name="status"
              value={editData.status}
              onChange={handleInputChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <button onClick={saveEdit}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
