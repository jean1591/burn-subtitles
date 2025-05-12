import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { HomePage } from "../screens/Home";
import { Login } from "../screens/Login";
import { PrivacyPolicy } from "../screens/PrivacyPolicy";
import { Register } from "../screens/Register";
import { TermsOfService } from "../screens/TermsOfService";

const StatusPage = lazy(() =>
  import("@/components/StatusPage").then((m) => ({ default: m.StatusPage }))
);

export const AppRouter = () => (
  <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/status/:uuid" element={<StatusPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Suspense>
);
