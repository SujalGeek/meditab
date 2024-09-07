// src/pages/user/PatientDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PatientDashboardPage = () => {
  const [formData, setFormData] = useState({
    date: '',
    username: '',
    doctor_name: '',
    time: '',
    disease: '',
  });
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('/api/v1/user/patient/me', { withCredentials: true });
        setUserData(userResponse.data);

        const [appointmentsResponse, prescriptionsResponse] = await Promise.all([
          axios.get('/api/v1/appointments', { withCredentials: true }),
          axios.get('/api/v1/prescriptions', { withCredentials: true })
        ]);

        // Ensure the response data is in array format
        setAppointments(appointmentsResponse.data || []);
        setPrescriptions(Array.isArray(prescriptionsResponse.data) ? prescriptionsResponse.data : []);

      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/appointments', formData, { withCredentials: true });
      alert('Appointment booked successfully!');
    } catch (err) {
      alert('Failed to book appointment.');
    }
  };

  const handleLogout = () => {
    axios.post('/api/v1/logout', {}, { withCredentials: true })
      .then(() => navigate('/login'))
      .catch(() => alert('Logout failed.'));
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Welcome {userData?.name}</Typography>
      <Button onClick={handleLogout} color="error" variant="contained">Log Out</Button>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4">Book An Appointment Here!</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Select Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Enter Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Doctor</InputLabel>
              <Select
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleInputChange}
              >
              
                <MenuItem value="Doctor1">Doctor1</MenuItem>
                <MenuItem value="Doctor2">Doctor2</MenuItem>
              </Select>
            </FormControl>
            <FormControl component="fieldset" margin="normal">
              <Typography>Time Slot</Typography>
              <RadioGroup
                name="time"
                value={formData.time}
                onChange={handleInputChange}
              >
                <FormControlLabel value="9-11" control={<Radio />} label="09:00 a.m-11:00 a.m" />
                <FormControlLabel value="11-1" control={<Radio />} label="11:00 a.m-01:00 p.m" />
                <FormControlLabel value="6-8" control={<Radio />} label="06:00 p.m-08:00 p.m" />
                <FormControlLabel value="8-10" control={<Radio />} label="08:00 p.m-10:00 p.m" />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" margin="normal">
              <Typography>Disease Type</Typography>
              <RadioGroup
                name="disease"
                value={formData.disease}
                onChange={handleInputChange}
              >
                <FormControlLabel value="mild" control={<Radio />} label="Simple Problem" />
                <FormControlLabel value="serious" control={<Radio />} label="Serious Problems" />
                <FormControlLabel value="emergency" control={<Radio />} label="Very Emergency Problems" />
              </RadioGroup>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </form>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error">Last Visit:</Typography>
              {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                  <Typography key={prescription.id}>DATE: {prescription.date}</Typography>
                ))
              ) : (
                <Typography>No prescriptions found.</Typography>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error">Pending Appointments:</Typography>
              {/* {appointments.length > 0 ? (
                <ul>
                  {appointments.map((appointment) => (
                    <li key={appointment.id}>DATE: {appointment.date} TIME Slot: {appointment.time}</li>
                  ))}
                </ul>
              ) : (
                <Typography>No pending appointments.</Typography>
              )} */}
            </CardContent>
          </Card>
          {prescriptions.length > 0 && (
            <a href={`prescription_upload/${prescriptions[0].filename}`}>
              <img src="assets/Images/prescription copy.jpg" alt="Prescription" style={{ width: '300px', height: '380px' }} />
            </a>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboardPage;
