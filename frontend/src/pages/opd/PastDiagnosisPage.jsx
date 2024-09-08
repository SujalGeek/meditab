import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, Avatar, Grid } from '@mui/material';

const PastDiagnosisPage = () => {
  const [patient, setPatient] = useState({ name: 'Patient Name', photo: '/admin_pic.jpeg' }); // Replace with actual data
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    const fetchPastDiagnoses = async () => {
      const sampleData = [
        { id: 1, diagnosis: 'Diabetes', date: '2023-07-21', doctor: 'Dr. Smith', totalBill: 5000 },
        { id: 2, diagnosis: 'Hypertension', date: '2022-12-05', doctor: 'Dr. Lee', totalBill: 3500 },
        { id: 3, diagnosis: 'Asthma', date: '2021-06-11', doctor: 'Dr. Johnson', totalBill: 4200 },
      ];
      setDiagnoses(sampleData);
    };

    fetchPastDiagnoses();
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', color: 'rgb(17, 60, 73)' }}>
      <Paper elevation={3} style={{ padding: '2rem', backgroundColor: '#f0f8f8' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar alt={patient.name} src={patient.photo} sx={{ width: 100, height: 100, border: '3px solid rgb(17, 60, 73)' }} />
          </Grid>
          <Grid item>
            <Typography variant="h5" style={{ color: 'rgb(17, 60, 73)' }}>{patient.name}</Typography>
          </Grid>
        </Grid>

        <Typography variant="h4" gutterBottom style={{ marginTop: '2rem', color: 'rgb(17, 60, 73)' }}>
          Past Diagnoses
        </Typography>

        <List>
          {diagnoses.map((diagnosis) => (
            <React.Fragment key={diagnosis.id}>
              <ListItem style={{ backgroundColor: '#e1f0f0', borderRadius: '8px', marginBottom: '10px' }}>
                <ListItemText
                  primary={
                    <Typography variant="h6" style={{ color: 'rgb(17, 60, 73)' }}>
                      {diagnosis.diagnosis}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" style={{ color: 'rgba(17, 60, 73, 0.8)' }}>
                      Date: {diagnosis.date} | Doctor: {diagnosis.doctor} | Total Bill: ₹{diagnosis.totalBill}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        {diagnoses.length === 0 && (
          <Typography variant="body1" color="textSecondary">
            No past diagnoses available.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default PastDiagnosisPage;
