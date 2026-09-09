import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import ScanPage from "./ScanPage.jsx";
import Register from "./Register.jsx";
import AddBook from './AddBook.jsx';
import Book from './Book.jsx';
import FlashcardsPage from './flashcards.jsx';

function App() {

  return (
   <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/book/:bookId/scan" element={<ScanPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/add-book" element={<AddBook/>}/>
      <Route path="/book/:bookId" element={<Book/>}/>
      <Route path="/flashcards/:bookId" element={<FlashcardsPage />}/>
   </Routes>
  )
}

export default App