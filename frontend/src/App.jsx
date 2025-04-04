import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../components/userAuth";
import LoginPage from "../components/login";
import ReceiptPage from "../components/receiptPage";
import ParkingInfo from "../components/userProfile";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/receipt/:locationId/:txnId" element={<ReceiptPage />} />
          <Route path="/checkin" element={<ParkingInfo />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
