import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppRouter } from "./routes/AppRouter.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { LanguageProvider } from "./contexts/languageContext.tsx";
import { StrictMode } from "react";
import { UmamiScript } from "./components/UmamiScript.tsx";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">
                <AppRouter />
              </div>
              <Footer />
            </div>
            <UmamiScript />
          </AuthProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
