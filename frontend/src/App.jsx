import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReceiptPage from "../components/receiptPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<ReceiptPage />} />
        </Routes>
      </Router>
  );
}

export default App;
