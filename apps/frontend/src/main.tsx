import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppRouter } from "./routes/AppRouter.tsx";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header.tsx";
import { LanguageProvider } from "./contexts/languageContext.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <Header />
          <AppRouter />
        </QueryClientProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
