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
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminSports from "../pages/admin/AdminSports";
import AdminTeams from "../pages/admin/AdminTeams";
import AdminPlayers from "../pages/admin/AdminPlayers";
import AdminUsers from "../pages/admin/AdminUsers";
import GalleryAlbumDetails from "../pages/public/GalleryAlbumDetails";
import AdminGallery from "../pages/admin/AdminGallery";
import AdminLiveMatches from "../pages/admin/AdminLiveMatches";
import FixturesResults from "../pages/public/FixturesResults";
import AdminFixtures from "../pages/admin/AdminFixtures";
import AdminLayout from "../components/layout/AdminLayout";
import NotFound from "../pages/public/NotFound";

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
      <Route path="/gallery/:albumSlug" element={<GalleryAlbumDetails />} />
      <Route path="/fixtures-results" element={<FixturesResults />} />
      <Route path="/fixtures-results" element={<FixturesResults />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={[
              "SUPER_ADMIN",
              "SPORTS_TEACHER",
              "PHOTO_CLUB",
              "VIDEO_CLUB",
            ]}
          >
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sports"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "SPORTS_TEACHER"]}>
            <AdminLayout>
              <AdminSports />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teams"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "SPORTS_TEACHER"]}>
            <AdminLayout>
              <AdminTeams />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/players"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "SPORTS_TEACHER"]}>
            <AdminLayout>
              <AdminPlayers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "SPORTS_TEACHER"]}>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/gallery"
        element={
          <ProtectedRoute
            allowedRoles={["SUPER_ADMIN", "SPORTS_TEACHER", "PHOTO_CLUB"]}
          >
            <AdminLayout>
              <AdminGallery />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/live-matches"
        element={
          <ProtectedRoute
            allowedRoles={["SUPER_ADMIN", "SPORTS_TEACHER", "VIDEO_CLUB"]}
          >
            <AdminLayout>
              <AdminLiveMatches />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fixtures"
        element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "SPORTS_TEACHER"]}>
            <AdminLayout>
              <AdminFixtures />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
