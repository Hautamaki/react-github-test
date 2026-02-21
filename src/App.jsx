import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import { Button } from "/components/base/buttons/button";
// import { Input } from "/components/base/input/input";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";

import Home from "./pages/home";
import ColorPalette from "./pages/color-palette";
import FileConverter from "./pages/file-converter";
import About from "./pages/about";
import Contact from "./pages/contact";


import './App.css'


function App() {
  return (
    <BrowserRouter basename='/react-github-test'>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/color-palette" element={<ColorPalette />} />
        <Route path="/file-converter" element={<FileConverter />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
