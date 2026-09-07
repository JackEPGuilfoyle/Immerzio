import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import ScanPage from "./ScanPage.jsx";
import Register from "./Register.jsx";

function App() {

  return (
   <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
   </Routes>
  )
}

export default App