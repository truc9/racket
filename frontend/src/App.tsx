import Layout from "./screens/layout";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DashboardScreen = lazy(() => import("./screens/dashboard"));
const MatchesScreen = lazy(() => import("./screens/matches"));
const PlayerScreen = lazy(() => import("./screens/players"));
const HealthScreen = lazy(() => import("./screens/health"));
const LoginScreen = lazy(() => import("./screens/auth/login"));
const PageNotFound = lazy(() => import("./screens/pageNotFound"));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/players" element={<PlayerScreen />} />
        <Route path="/matches" element={<MatchesScreen />} />
        <Route path="/health" element={<HealthScreen />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  );
}

export default App;
