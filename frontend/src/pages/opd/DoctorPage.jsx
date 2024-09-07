import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button, TextField, Card, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  marginBottom: '20px',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
});

const UploadCard = styled(Card)({
  marginTop: '20px',
  padding: '20px',
  backgroundColor: '#D4DBDE',
  borderRadius: '10px',
});

const Title = styled(Typography)({
  color: '#113C49',
  fontSize: '1.5rem',
  marginBottom: '10px',
});

const DoctorImage = styled('img')({
  borderRadius: '50%',
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  marginBottom: '10px',
});

const DoctorDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [mildPatients, setMildPatients] = useState([]);
  const [seriousPatients, setSeriousPatients] = useState([]);
  const [emergencyPatients, setEmergencyPatients] = useState([]);
  const [username, setUsername] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorImage, setDoctorImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctor = new URLSearchParams(window.location.search).get('rishi');
        const today = new Date().toISOString().split('T')[0];

        const [appResponse, mildResponse, seriousResponse, emergencyResponse, doctorResponse] = await Promise.all([
          axios.get(`/api/v1/appointments?doctor=${doctor}&date=${today}`, { withCredentials: true }),
          axios.get(`/api/v1/appointments?doctor=${doctor}&disease=mild&date=${today}`, { withCredentials: true }),
          axios.get(`/api/v1/appointments?doctor=${doctor}&disease=serious&date=${today}`, { withCredentials: true }),
          axios.get(`/api/v1/appointments?doctor=${doctor}&disease=emergency&date=${today}`, { withCredentials: true }),
          axios.get(`/api/v1/doctors/${doctor}`, { withCredentials: true }), // Fetch doctor information
        ]);

        setAppointments(Array.isArray(appResponse.data) ? appResponse.data : []);
        setMildPatients(Array.isArray(mildResponse.data) ? mildResponse.data : []);
        setSeriousPatients(Array.isArray(seriousResponse.data) ? seriousResponse.data : []);
        setEmergencyPatients(Array.isArray(emergencyResponse.data) ? emergencyResponse.data : []);
        setDoctorImage(doctorResponse.data.image || 'default-image-url'); // Set doctor image URL
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('prescription', file);

    try {
      await axios.post('/api/v1/prescriptions', formData, { withCredentials: true });
      alert('Prescription uploaded successfully');
    } catch (error) {
      console.error('Error uploading prescription', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Doctor Dashboard</Typography>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Title>Today's Appointments:</Title>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <Typography key={appointment.id}>Name: {appointment.username}, Time Slot: {appointment.time}, Date: {appointment.date}</Typography>
                ))
              ) : (
                <Typography>No Appointments Today!</Typography>
              )}
            </CardContent>
          </StyledCard>

          <StyledCard>
            <CardContent>
              <Title>Mild Problem Patients</Title>
              {mildPatients.length > 0 ? (
                mildPatients.map((patient) => (
                  <Typography key={patient.id}>Name: {patient.username}</Typography>
                ))
              ) : (
                <Typography>No Mild Problem Patients Today</Typography>
              )}
            </CardContent>
          </StyledCard>

          <StyledCard>
            <CardContent>
              <Title>Serious Problem Patients</Title>
              {seriousPatients.length > 0 ? (
                seriousPatients.map((patient) => (
                  <Typography key={patient.id}>Name: {patient.username}</Typography>
                ))
              ) : (
                <Typography>No Serious Problem Patients Today</Typography>
              )}
            </CardContent>
          </StyledCard>

          <StyledCard>
            <CardContent>
              <Title>Emergency Problem Patients</Title>
              {emergencyPatients.length > 0 ? (
                emergencyPatients.map((patient) => (
                  <Typography key={patient.id}>Name: {patient.username}</Typography>
                ))
              ) : (
                <Typography>No Emergency Problem Patients Today</Typography>
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <UploadCard>
          {doctorImage && <DoctorImage src={doctorImage} alt="Doctor" />}
            <CardContent>
              <Typography variant="h4" gutterBottom>Upload Prescription:</Typography>
             
              <form onSubmit={handleUpload}>
                <TextField
                  label="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <input type="file" onChange={handleFileChange} />
                <Button type="submit" variant="contained" color="success" style={{ marginTop: '10px' }}>Upload</Button>
              </form>
            </CardContent>
          </UploadCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboardPage;
