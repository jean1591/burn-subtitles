import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { HomePage } from "../screens/Home";

const WsTestPage = lazy(() =>
  import("@/components/WsTestPage").then((m) => ({ default: m.WsTestPage }))
);
const StatusPage = lazy(() =>
  import("@/components/StatusPage").then((m) => ({ default: m.StatusPage }))
);

export const AppRouter = () => (
  <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/status/:uuid" element={<StatusPage />} />
      <Route path="/ws-test" element={<WsTestPage />} />
    </Routes>
  </Suspense>
);
