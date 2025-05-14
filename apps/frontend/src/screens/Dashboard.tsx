import { CreditCard, ExternalLink, FileText, Plus } from "lucide-react";
import {
  TranslationStatus,
  mapTranslationStatusToUI,
} from "../utils/status-mapper";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status/StatusPill";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

interface DashboardData {
  translations: Translation[];
  stats: {
    totalFiles: number;
    totalCreditsUsed: number;
  };
}

interface Translation {
  id: string;
  batchId: string;
  fileName: string;
  selectedLanguages: string; // comma-separated string
  createdAt: string;
  status: TranslationStatus;
  creditsUsed: number;
}

// Language code to name mapping
const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
  it: "Italian",
  de: "German",
  fr: "French",
};

// Helper to format date as relative time
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // in seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  // Fallback to locale date string
  return date.toLocaleDateString();
}

export function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchApi("/dashboard")
      .then((res) => {
        setData(res);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
        <div className="text-lg font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
        <div className="text-lg font-medium text-red-600">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-4 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Credit Balance */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border-gray-200 border-1">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold">Credit Balance</p>
              <p className="text-sm text-gray-500">
                Your available translation credits
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-full bg-amber-100 p-4 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <div className="text-3xl font-bold">{user?.credits ?? 0}</div>
                <div className="text-gray-500 text-sm">Available credits</div>
              </div>
            </div>

            <Button
              className="mt-2 w-full bg-amber-500 hover:bg-amber-600 hover:cursor-pointer rounded-sm"
              onClick={() => navigate("/buy-credits")}
            >
              <Plus className="w-4 h-4" />
              <p>Purchase Credits</p>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border-gray-200 border-1">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold">Quick Stats</p>
              <p className="text-sm text-gray-500">Your translation activity</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">Total Translations</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.stats.totalFiles}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">Credits Used</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.stats.totalCreditsUsed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Translation History */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xl font-semibold">Translation History</div>
              <div className="text-gray-500 text-sm">
                Your recent translation jobs
              </div>
            </div>
            <Button
              className="bg-amber-500 hover:bg-amber-600 hover:cursor-pointer p-4 rounded-sm"
              onClick={() => navigate("/")}
            >
              New Translation
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-4 text-left font-medium">File Name</th>
                  <th className="py-4 text-left font-medium">Languages</th>
                  <th className="py-4 text-left font-medium">Date</th>
                  <th className="py-4 text-left font-medium">Status</th>
                  <th className="py-4 text-left font-medium">Credits</th>
                  <th className="py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.translations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-8">
                      No translation jobs yet.
                    </td>
                  </tr>
                ) : (
                  [...data.translations].map((t) => (
                    <tr
                      key={t.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="py-4 font-medium text-gray-800">
                        <div className="flex gap-2 justify-start items-center">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <p>{t.fileName}</p>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="flex gap-2 items-center flex-wrap">
                          {t.selectedLanguages.split(",").map((lang) => {
                            const code = lang.trim();
                            return (
                              <span
                                key={code}
                                className="font-medium bg-gray-100 rounded-full px-2 py-0.5 text-xs"
                              >
                                {LANGUAGE_MAP[code] || code}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-4">
                        {formatRelativeDate(t.createdAt)}
                      </td>

                      <td className="py-4 flex">
                        <StatusPill
                          className="text-xs border border-gray-200"
                          status={mapTranslationStatusToUI(t.status)}
                        />
                      </td>

                      <td className="py-4 text-left">{t.creditsUsed}</td>

                      <td className="py-4">
                        <Button
                          className="rounded-sm flex gap-4 items-center p-4 hover:cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/status/${t.batchId}`)}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <p>View</p>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
