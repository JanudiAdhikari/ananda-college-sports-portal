import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded public pages
const Home = lazy(() => import("../pages/public/Home"));
const Sports = lazy(() => import("../pages/public/Sports"));
const SportDetails = lazy(() => import("../pages/public/SportDetails"));
const TeamDetails = lazy(() => import("../pages/public/TeamDetails"));
const PlayerProfile = lazy(() => import("../pages/public/PlayerProfile"));
const Gallery = lazy(() => import("../pages/public/Gallery"));
const LiveMatches = lazy(() => import("../pages/public/LiveMatches"));
const Login = lazy(() => import("../pages/auth/Login"));
const GalleryAlbumDetails = lazy(() => import("../pages/public/GalleryAlbumDetails"));
const FixturesResults = lazy(() => import("../pages/public/FixturesResults"));
const NotFound = lazy(() => import("../pages/public/NotFound"));

// Lazy-loaded admin pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminSports = lazy(() => import("../pages/admin/AdminSports"));
const AdminTeams = lazy(() => import("../pages/admin/AdminTeams"));
const AdminPlayers = lazy(() => import("../pages/admin/AdminPlayers"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminGallery = lazy(() => import("../pages/admin/AdminGallery"));
const AdminLiveMatches = lazy(() => import("../pages/admin/AdminLiveMatches"));
const AdminFixtures = lazy(() => import("../pages/admin/AdminFixtures"));

// Non-lazy components (small files, needed immediately)
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../components/layout/AdminLayout";

function AppRoutes() {
  const loadingFallback = (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ananda-gold/30 border-t-ananda-maroon" />
      <p className="font-display text-xs font-bold tracking-wider text-ananda-maroon animate-pulse">
        Loading page...
      </p>
    </div>
  );

  return (
    <Suspense fallback={loadingFallback}>
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
    </Suspense>
  );
}

export default AppRoutes;
