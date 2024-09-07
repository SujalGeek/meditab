import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, CircularProgress, Container, Typography, Grid } from "@mui/material";

const OPDSchedulePage = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    checkInDate: "",
    bedType: "General",
    isUrgent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/v1/opdSchedule", formData, {
        withCredentials: true,
      });
      alert("Appointment scheduled successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error scheduling appointment", error);
      setError("Failed to schedule appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Schedule an OPD Appointment</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Patient ID"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Doctor ID"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Check-In Date"
              name="checkInDate"
              type="datetime-local"
              value={formData.checkInDate}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Bed Type</InputLabel>
              <Select
                name="bedType"
                value={formData.bedType}
                onChange={handleInputChange}
              >
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="ICU">ICU</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleInputChange}
                />
              }
              label="Urgent"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default OPDSchedulePage;
