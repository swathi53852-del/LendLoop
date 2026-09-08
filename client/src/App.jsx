import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/MyItems";
import Lending from "./pages/Lending";
import Borrowing from "./pages/Borrowing";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/items" element={<Items />} />

        <Route path="/lending" element={<Lending />} />

        <Route path="/borrowing" element={<Borrowing />} />

        <Route path="/requests" element={<Requests />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;