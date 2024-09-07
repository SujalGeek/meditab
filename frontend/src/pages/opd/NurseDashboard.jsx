import React from "react";
import "./Nurse.css"; 

const NurseDashboard = () => {
  const overviewData = [
    { title: "Patient", count: "2,543", subtext: "Last 7 days", percentage: "+24%" },
    { title: "Lab reports", count: "453", subtext: "Last 7 days", percentage: "+13%" },
  ];

  const patients = [
    { id: "#A-125011", name: "Jaydon Vetrows", dateCheck: "20.03.2023", disease: "Ventricular resection", room: "A-105" },
    { id: "#A-125015", name: "Liam Anderson", dateCheck: "22.03.2023", disease: "Coronary artery bypass", room: "B-210" },
    { id: "#A-125019", name: "Sophia Williams", dateCheck: "25.03.2023", disease: "Appendectomy", room: "C-310" },
    { id: "#A-125020", name: "Oliver Johnson", dateCheck: "27.03.2023", disease: "Cholecystectomy", room: "D-115" },
    { id: "#A-125090", name: "Isabella Martinez", dateCheck: "01.04.2023", disease: "Hernia repair", room: "E-202" },
    { id: "#A-122109", name: "Mason Brown", dateCheck: "05.04.2023", disease: "Heart valve repair", room: "F-120" },
    { id: "#A-122210", name: "Emma Davis", dateCheck: "08.04.2023", disease: "Hip replacement", room: "G-305" },
    { id: "#A-122315", name: "Noah Wilson", dateCheck: "12.04.2023", disease: "Knee replacement", room: "H-410" },
    { id: "#A-122419", name: "Ava Moore", dateCheck: "15.04.2023", disease: "Gallbladder removal", room: "I-208" },
    { id: "#A-122520", name: "James Taylor", dateCheck: "18.04.2023", disease: "Lung resection", room: "J-307" },
    { id: "#A-122625", name: "Ella White", dateCheck: "22.04.2023", disease: "Mastectomy", room: "K-214" },
    { id: "#A-122729", name: "Lucas Harris", dateCheck: "25.04.2023", disease: "Hysterectomy", room: "L-301" },
    { id: "#A-122830", name: "Charlotte Clark", dateCheck: "28.04.2023", disease: "Prostatectomy", room: "M-410" },
    { id: "#A-122935", name: "Benjamin Lewis", dateCheck: "30.04.2023", disease: "Spinal fusion", room: "N-105" },
    { id: "#A-123040", name: "Amelia Walker", dateCheck: "02.05.2023", disease: "Thyroidectomy", room: "O-102" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li>Dashboard</li>
          <li>Patients</li>
          <li>Staffs</li>
          <li>Reports</li>
          <li>My Team</li>
          <li>Chat</li>
        </ul>
      </aside>

     
      <main className="main-content">
        <div className="overview-section">
          {overviewData.map((data, index) => (
            <div key={index} className="overview-card">
              <h4>{data.title}</h4>
              <p>{data.count}</p>
              <small>{data.subtext}</small>
              <span>{data.percentage}</span>
            </div>
          ))}
        </div>

       
        <div className="patient-list">
          <h3>Patient List</h3>
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Date Check</th>
                <th>Disease</th>
                <th>Room No</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.dateCheck}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default NurseDashboard;
