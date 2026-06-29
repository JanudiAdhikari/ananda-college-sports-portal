import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Sports from "../pages/public/Sports";
import SportDetails from "../pages/public/SportDetails";
import TeamDetails from "../pages/public/TeamDetails";
import PlayerProfile from "../pages/public/PlayerProfile";
import Gallery from "../pages/public/Gallery";
import LiveMatches from "../pages/public/LiveMatches";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/sports/:sportId" element={<SportDetails />} />
      <Route path="/teams/:teamId" element={<TeamDetails />} />
      <Route path="/players/:playerId" element={<PlayerProfile />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/live-matches" element={<LiveMatches />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AppRoutes;