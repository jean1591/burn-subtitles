import "./index.css";

import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/languageContext.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
