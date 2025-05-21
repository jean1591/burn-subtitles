import { CreditCard, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FormattedMessage } from "react-intl";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { TranslationStatus } from "../utils/status-mapper";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

interface Translation {
  id: string;
  batchId: string;
  fileName: string;
  selectedLanguages: string; // comma-separated string
  createdAt: string;
  status: TranslationStatus;
  creditsUsed: number;
}

interface DashboardData {
  translations: Translation[];
  stats: {
    totalFiles: number;
    totalCreditsUsed: number;
  };
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
        <h1 className="text-3xl font-bold mb-8">
          <FormattedMessage id="dashboard.title" defaultMessage="Dashboard" />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Credit Balance */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border-gray-200 border-1">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold">
                <FormattedMessage
                  id="dashboard.creditBalance.title"
                  defaultMessage="Credit Balance"
                />
              </p>
              <p className="text-sm text-gray-500">
                <FormattedMessage
                  id="dashboard.creditBalance.description"
                  defaultMessage="Your available translation credits"
                />
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-full bg-amber-100 p-4 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <div className="text-3xl font-bold">{user?.credits ?? 0}</div>
                <div className="text-gray-500 text-sm">
                  <FormattedMessage
                    id="dashboard.creditBalance.available"
                    defaultMessage="Available Credits"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 hover:cursor-pointer rounded-sm"
                onClick={() => navigate("/buy-credits")}
              >
                <Plus className="w-4 h-4 mr-2" />
                <FormattedMessage
                  id="dashboard.creditBalance.purchase"
                  defaultMessage="Purchase Credits"
                />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-4 border-gray-200 border-1">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold">
                <FormattedMessage
                  id="dashboard.quickStats.title"
                  defaultMessage="Quick Stats"
                />
              </p>
              <p className="text-sm text-gray-500">
                <FormattedMessage
                  id="dashboard.quickStats.description"
                  defaultMessage="Your translation activity"
                />
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  <FormattedMessage
                    id="dashboard.quickStats.totalTranslations"
                    defaultMessage="Total Translations"
                  />
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.stats.totalFiles}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  <FormattedMessage
                    id="dashboard.quickStats.creditsUsed"
                    defaultMessage="Credits Used"
                  />
                </p>
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
              <div className="text-xl font-semibold">
                <FormattedMessage
                  id="dashboard.history.title"
                  defaultMessage="Translation History"
                />
              </div>
              <div className="text-gray-500 text-sm">
                <FormattedMessage
                  id="dashboard.history.description"
                  defaultMessage="Your recent translation jobs"
                />
              </div>
            </div>
            <Button
              className="bg-amber-500 hover:bg-amber-600 hover:cursor-pointer p-4 rounded-sm"
              onClick={() => navigate("/")}
            >
              <FormattedMessage
                id="dashboard.history.newTranslation"
                defaultMessage="New Translation"
              />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <HistoryTable translations={data.translations} />
          </div>
        </div>
      </div>
    </div>
  );
}
