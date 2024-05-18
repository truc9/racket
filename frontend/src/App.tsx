import { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./components/loading";

const Layout = lazy(() => import("./screens/layout"));
const Dashboard = lazy(() => import("./screens/dashboard"));
const Matches = lazy(() => import("./screens/matches"));
const Players = lazy(() => import("./screens/players"));
const PageNotFound = lazy(() => import("./screens/pageNotFound"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
