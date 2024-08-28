import React, { useState } from "react";


const Appointment = () => {
  const [appointment, setAppointment] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    doctor: "",
    specialty: "",
  });

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment Details:", appointment);
    // Here you would typically send the data to the backend
  };

  return (
    <div className="appointment-page">
      <h1>Book an Appointment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={appointment.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={appointment.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={appointment.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Appointment Date</label>
          <input
            type="date"
            name="date"
            value={appointment.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Appointment Time</label>
          <input
            type="time"
            name="time"
            value={appointment.time}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Doctor</label>
          <select
            name="doctor"
            value={appointment.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            <option value="Dr. Smith">Dr. Smith</option>
            <option value="Dr. Johnson">Dr. Johnson</option>
            <option value="Dr. Adams">Dr. Adams</option>
          </select>
        </div>
        <div>
          <label>Specialty</label>
          <select
            name="specialty"
            value={appointment.specialty}
            onChange={handleChange}
            required
          >
            <option value="">Select Specialty</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default Appointment;
