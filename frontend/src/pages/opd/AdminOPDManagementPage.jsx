import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { styled } from "@mui/system";

const ProfilePicture = styled('img')({
  borderRadius: '50%',
  width: '200px',
  height: '200px',
  margin: '10px',
});

const AdminOPDManagementPage = () => {
  const [opdSchedules, setOpdSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddCostDialog, setOpenAddCostDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [emergency, setEmergency] = useState(false);
  const [roomCharge, setRoomCharge] = useState("");
  const [medicineCharge, setMedicineCharge] = useState("");
  const [doctorVisitCharge, setDoctorVisitCharge] = useState("");
  const [additionalRoomCharge, setAdditionalRoomCharge] = useState("");
  const [additionalMedicineCharge, setAdditionalMedicineCharge] = useState("");
  const [additionalDoctorVisitCharge, setAdditionalDoctorVisitCharge] = useState("");
  const [profilePic] = useState('/admin_pic.jpeg');

  useEffect(() => {
    const fetchOPDSchedules = async () => {
      setLoading(true);
      try {
        const mockData = [
          {
            _id: "1",
            patient: "Patient A",
            doctor: "Doctor X",
            checkInDate: "2024-09-01T10:00:00Z",
            bedType: "Single",
            status: "Pending",
            isBedAllocated: false,
            totalCost: 0.00,
            isEmergency: false
          },
          {
              _id: "2",
              patient: "Patient B",
              doctor: "Doctor Y",
              checkInDate: "2024-09-02T11:00:00Z",
              bedType: "Double",
              status: "Pending",
              isBedAllocated: false,
              totalCost: 0.00,
              isEmergency: false

            },
            {
              _id: "3",
              patient: "Patient C",
              doctor: "Doctor Z",
              checkInDate: "2024-09-03T12:00:00Z",
              bedType: "Single",
              status: "Pending",
              isBedAllocated: false,
              totalCost: 0.00,
              isEmergency: false

            },
            {
              _id: "4",
              patient: "Patient D",
              doctor: "Doctor A",
              checkInDate: "2024-09-04T13:00:00Z",
              bedType: "Double",
              status: "Pending",
              isBedAllocated: false,
              totalCost: 0.00,
              isEmergency: false

            },
            {
              _id: "5",
              patient: "Patient E",
              doctor: "Doctor B",
              checkInDate: "2024-09-05T14:00:00Z",
              bedType: "Single",
              status: "Pending",
              isBedAllocated: false,
              totalCost: 0.00,
              isEmergency: false

            },
            {
              _id: "6",
              patient: "Patient F",
              doctor: "Doctor C",
              checkInDate: "2024-09-06T15:00:00Z",
              bedType: "Double",
              status: "Pending",
              isBedAllocated: false,
              totalCost: 0.00,
              isEmergency: false

            },
          ];

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOpdSchedules(mockData);
      } catch (error) {
        console.error("Error fetching OPD schedules", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOPDSchedules();
  }, []);

  const handleAllocate = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenDialog(true);
  };

  const handleAddCost = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenAddCostDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setOpenAddCostDialog(false);
    setEmergency(false);
    setRoomCharge("");
    setMedicineCharge("");
    setDoctorVisitCharge("");
    setAdditionalRoomCharge("");
    setAdditionalMedicineCharge("");
    setAdditionalDoctorVisitCharge("");
  };

  const handleAllocateConfirm = () => {
    try {
      const roomChargeValue = parseFloat(roomCharge) || 0;
      const medicineChargeValue = parseFloat(medicineCharge) || 0;
      const doctorVisitChargeValue = parseFloat(doctorVisitCharge) || 0;

      const updatedSchedules = opdSchedules.map((schedule) =>
        schedule._id === selectedSchedule._id
          ? { 
              ...schedule, 
              status: "Allocated", 
              isBedAllocated: true,
              totalCost: roomChargeValue + medicineChargeValue + doctorVisitChargeValue,
              isEmergency: emergency
            }
          : schedule
      );
      setOpdSchedules(updatedSchedules);
      handleDialogClose();
    } catch (error) {
      console.error("Error allocating bed", error);
      alert("Failed to allocate bed. Please try again.");
    }
  };

  const handleAddCostConfirm = () => {
    try {
      const additionalRoomChargeValue = parseFloat(additionalRoomCharge) || 0;
      const additionalMedicineChargeValue = parseFloat(additionalMedicineCharge) || 0;
      const additionalDoctorVisitChargeValue = parseFloat(additionalDoctorVisitCharge) || 0;

      const updatedSchedules = opdSchedules.map((schedule) =>
        schedule._id === selectedSchedule._id
          ? { 
              ...schedule,
              totalCost: schedule.totalCost + additionalRoomChargeValue + additionalMedicineChargeValue + additionalDoctorVisitChargeValue,
              additionalCharges: {
                room: (schedule.additionalCharges?.room || 0) + additionalRoomChargeValue,
                medicine: (schedule.additionalCharges?.medicine || 0) + additionalMedicineChargeValue,
                doctor: (schedule.additionalCharges?.doctor || 0) + additionalDoctorVisitChargeValue
              }
            }
          : schedule
      );
      setOpdSchedules(updatedSchedules);
      handleDialogClose();
    } catch (error) {
      console.error("Error adding costs", error);
      alert("Failed to add costs. Please try again.");
    }
  };

  const handleDischarge = (id) => {
    try {
      alert("Patient discharged successfully!");
      const updatedSchedules = opdSchedules.filter((schedule) => schedule._id !== id);
      setOpdSchedules(updatedSchedules);
    } catch (error) {
      console.error("Error discharging patient", error);
      alert("Failed to discharge patient. Please try again.");
    }
  };

  const handleChargeChange = (e, type) => {
    const value = e.target.value;
    if (type === 'room') setRoomCharge(value);
    if (type === 'medicine') setMedicineCharge(value);
    if (type === 'doctor') setDoctorVisitCharge(value);
    if (type === 'additionalRoom') setAdditionalRoomCharge(value);
    if (type === 'additionalMedicine') setAdditionalMedicineCharge(value);
    if (type === 'additionalDoctor') setAdditionalDoctorVisitCharge(value);
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <ProfilePicture src={profilePic} alt="Admin Profile" />
          <Typography variant="h5">Admin</Typography>
        </Grid>
      </Grid>

      <Typography variant="h4" gutterBottom>
        Admin OPD Management
      </Typography>
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" style={{ height: "70vh" }}>
          <CircularProgress />
        </Grid>
      ) : opdSchedules && opdSchedules.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>Doctor ID</TableCell>
                <TableCell>Check-In Date</TableCell>
                <TableCell>Bed Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opdSchedules.map((schedule) => (
                <TableRow 
                  key={schedule._id}
                  sx={{ backgroundColor: schedule.isEmergency ? 'lightcoral' : 'transparent' }}
                >
                  <TableCell>{schedule.patient}</TableCell>
                  <TableCell>{schedule.doctor}</TableCell>
                  <TableCell>{new Date(schedule.checkInDate).toLocaleString()}</TableCell>
                  <TableCell>{schedule.bedType}</TableCell>
                  <TableCell>{schedule.status}</TableCell>
                  <TableCell>{schedule.totalCost.toFixed(2)}</TableCell>
                  <TableCell>
                    {!schedule.isBedAllocated ? (
                      <Button
                        variant="contained"
                        onClick={() => handleAllocate(schedule)}
                        sx={{
                          backgroundColor: "green",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "darkgreen",
                          },
                        }}
                      >
                        Allocate
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => handleAddCost(schedule)}
                          sx={{
                            backgroundColor: "blue",
                            color: "white",
                            marginRight: "10px",
                            "&:hover": {
                              backgroundColor: "darkblue",
                            },
                          }}
                        >
                          Add Cost
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDischarge(schedule._id)}
                          sx={{
                            backgroundColor: "red",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "darkred",
                            },
                          }}
                        >
                          Discharge
                        </Button>
                      </>
                    )}
                    <Button
                      variant="contained"
                      color={schedule.isEmergency ? "success" : "warning"}
                      onClick={() => {
                        const updatedSchedules = opdSchedules.map((sched) =>
                          sched._id === schedule._id
                            ? { ...sched, isEmergency: !sched.isEmergency }
                            : sched
                        );
                        setOpdSchedules(updatedSchedules);
                      }}
                      sx={{
                        marginLeft: "10px",
                      }}
                    >
                      {schedule.isEmergency ? "Emergency Activated" : "Mark as Emergency"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center">
          No OPD schedules found.
        </Typography>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Allocate Bed</DialogTitle>
        <DialogContent>
          <TextField
            label="Room Charge"
            type="number"
            fullWidth
            margin="normal"
            value={roomCharge}
            onChange={(e) => handleChargeChange(e, 'room')}
          />
          <TextField
            label="Medicine Charge"
            type="number"
            fullWidth
            margin="normal"
            value={medicineCharge}
            onChange={(e) => handleChargeChange(e, 'medicine')}
          />
          <TextField
            label="Doctor Visit Charge"
            type="number"
            fullWidth
            margin="normal"
            value={doctorVisitCharge}
            onChange={(e) => handleChargeChange(e, 'doctor')}
          />
          {/* <TextField
            label="Emergency Status"
            type="button"
            checked={emergency}
            onChange={(e) => setEmergency(e.target.checked)}
            fullWidth
            margin="normal"
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAllocateConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddCostDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Additional Costs</DialogTitle>
        <DialogContent>
          <TextField
            label="Additional Room Charge"
            type="number"
            fullWidth
            margin="normal"
            value={additionalRoomCharge}
            onChange={(e) => handleChargeChange(e, 'additionalRoom')}
          />
          <TextField
            label="Additional Medicine Charge"
            type="number"
            fullWidth
            margin="normal"
            value={additionalMedicineCharge}
            onChange={(e) => handleChargeChange(e, 'additionalMedicine')}
          />
          <TextField
            label="Additional Doctor Visit Charge"
            type="number"
            fullWidth
            margin="normal"
            value={additionalDoctorVisitCharge}
            onChange={(e) => handleChargeChange(e, 'additionalDoctor')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddCostConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOPDManagementPage;
