import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import History from "./pages/History";
import AnalysisResult from "./pages/AnalysisResult";
import Profile from "./pages/Profile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />      
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
       <Route
              path="/analysis/:analysisId"
              element={<AnalysisResult />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
