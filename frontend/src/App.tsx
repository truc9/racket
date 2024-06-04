import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./screens/auth/login";
import Layout from "./screens/layout";
import Public from "./screens/public";

const DashboardScreen = lazy(() => import("./screens/dashboard"));
const MatchesScreen = lazy(() => import("./screens/matches"));
const PlayerScreen = lazy(() => import("./screens/players"));
const HealthScreen = lazy(() => import("./screens/health"));
const SportCentersScreen = lazy(() => import("./screens/sportcenter"));
const SettingsScreen = lazy(() => import("./screens/settings"));
const PageNotFoundScreen = lazy(() => import("./screens/page-not-found"));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/players" element={<PlayerScreen />} />
        <Route path="/matches" element={<MatchesScreen />} />
        <Route path="/sportcenters" element={<SportCentersScreen />} />
        <Route path="/health" element={<HealthScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<PageNotFoundScreen />} />
      </Route>
      <Route path="/public" element={<Public />}>
        <Route path="request" element={<DashboardScreen />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
