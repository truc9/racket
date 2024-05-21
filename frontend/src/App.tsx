import Loading from "./components/loading";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Layout = lazy(() => import("./screens/layout"));
const Dashboard = lazy(() => import("./screens/dashboard"));
const Matches = lazy(() => import("./screens/matches"));
const Players = lazy(() => import("./screens/players"));
const Health = lazy(() => import("./screens/health"));
const PageNotFound = lazy(() => import("./screens/pageNotFound"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/health" element={<Health />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
