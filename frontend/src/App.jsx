import { useEffect, useRef, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import HomePage from "./Home.jsx";

function App() {

  return (
   <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
   </Routes>
  )
}

export default App