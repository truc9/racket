import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useClaims } from "./hooks/useClaims";
import AdminLayout from "./screens/layouts/admin";
import PublicLayout from "./screens/layouts/public";
import Landing from "./screens/landing";

const DashboardScreen = lazy(() => import("./screens/dashboard"));
const MatchesScreen = lazy(() => import("./screens/matches"));
const PlayerScreen = lazy(() => import("./screens/players"));
const HealthScreen = lazy(() => import("./screens/health"));
const SportCentersScreen = lazy(() => import("./screens/sportcenter"));
const SettingsScreen = lazy(() => import("./screens/settings"));
const PageNotFoundScreen = lazy(() => import("./screens/page-not-found"));
const AttendantRequestScreen = lazy(
  () => import("./components/attendant-requests"),
);
const AdminRequestScreen = lazy(() => import("./screens/admin-requests"));
const Reportings = lazy(() => import("./screens/reporting"));
const PublicOutstandingReport = lazy(
  () => import("./screens/public/outstanding-report"),
);

function App() {
  const { isAdmin } = useClaims();

  return (
    <Routes>
      {isAdmin ? (
        <Route element={<AdminLayout />}>
          <Route index={true} path="/" element={<DashboardScreen />} />
          <Route path="requests" element={<AdminRequestScreen />} />
          <Route path="players" element={<PlayerScreen />} />
          <Route path="matches" element={<MatchesScreen />} />
          <Route path="sportcenters" element={<SportCentersScreen />} />
          <Route path="reports" element={<Reportings />} />
          <Route path="health" element={<HealthScreen />} />
          <Route path="settings" element={<SettingsScreen />} />
          <Route path="*" element={<PageNotFoundScreen />} />
        </Route>
      ) : (
        <Route element={<PublicLayout />}>
          <Route index element={<AttendantRequestScreen />} />
        </Route>
      )}
      <Route path="/login" element={<Landing />} />
      <Route
        path="/public/outstanding-report"
        element={<PublicOutstandingReport />}
      />
    </Routes>
  );
}

export default App;
