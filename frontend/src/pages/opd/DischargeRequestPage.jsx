import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, CircularProgress, Container, Typography, Grid } from "@mui/material";

const DischargeRequestPage = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/v1/dischargeRequest", formData, {
        withCredentials: true,
      });
      alert("Discharge request submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting discharge request", error);
      setError("Failed to submit discharge request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Request Discharge</Typography>
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
          <Grid item xs={12}>
            <TextField
              label="Reason for Discharge"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              fullWidth
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

export default DischargeRequestPage;
