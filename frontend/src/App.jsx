import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContext from "./Context/Context.jsx";
import {
  Navbar,
  Footer,
  HomePage,
  AllDoctorsPage,
  SpecialitiesPage,
  MedicinesPage,
  LoginPage,
  SignupPage,
  ErrorPage,
  FaqsPage,
  AboutUsPage,
  PrivacyPolicyPage,
  TermsAndConditionsPage,
  OrderHistoryPage,
  AddtoCart,
  ProductsByCategory,
  Bot,
} from "./import-export/ImportExport.js";

import OPDSchedulePage from "./pages/opd/OPDSchedulePage.jsx";
import AdminOPDManagementPage from "./pages/opd/AdminOPDManagementPage.jsx";
import PatientProfilePage from "./pages/opd/PatientDashboardPage.jsx";
import DischargeRequestPage from "./pages/opd/DischargeRequestPage.jsx";
import PatientDashboardPage from "./pages/opd/PatientDashboardPage.jsx";
import DoctorPage from "./pages/opd/DoctorPage.jsx";
import NurseDashboard from "./pages/opd/NurseDashboard.jsx"
import PastDiagnosisPage from './pages/opd/PastDiagnosisPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/alldoctors" element={<AllDoctorsPage />} />
          {/* <Route path="/appointment" element={<Appointment />} /> */}
          <Route path="/specialities" element={<SpecialitiesPage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route
            path="/medicines/shop_by_category/:id"
            element={<ProductsByCategory />}
          />
          {/* <Route path="/buy-medicines/:id" element={<SingleMedicine />} /> */}
          <Route path="/medicines/cart" element={<AddtoCart />} />
          <Route path="/medicines/order_history" element={<OrderHistoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/*" element={<ErrorPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
          <Route path="/termsandconditions" element={<TermsAndConditionsPage />} />
          
          <Route path="/opd-schedule" element={<OPDSchedulePage />} />
          <Route path="/admin/opd-management" element={<AdminOPDManagementPage />} />
          <Route path="/patient-profile" element={<PatientProfilePage />} />
        <Route path="/opd/discharge-request" element={<DischargeRequestPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboardPage />} />
        <Route path="/doctor/dashboard" element={<DoctorPage />} />
        <Route path="/nurse/dashboard" element={<NurseDashboard />} />
        <Route path="/past-diagnosis" element={<PastDiagnosisPage />} /> 



        </Routes>
        <Bot />
        
        <Footer />
        <ToastContainer position="top-right" />
      </AppContext>
    </BrowserRouter>
  );
}

export default App;


