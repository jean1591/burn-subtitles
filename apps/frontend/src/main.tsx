import "./index.css";

import { AppRouter } from "./routes/AppRouter.tsx";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header.tsx";
import { LanguageProvider } from "./contexts/languageContext.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Header />
        <AppRouter />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
