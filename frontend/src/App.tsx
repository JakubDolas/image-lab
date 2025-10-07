import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "../pages/Home";
import Convert from "../pages/Convert";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/convert" element={<Convert />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}