import { ExternalLink, FileText } from "lucide-react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { Button } from "../ui/button";
import { StatusPill } from "../status/StatusPill";
import { TranslationStatus } from "../../utils/status-mapper";
import { mapTranslationStatusToUI } from "../../utils/status-mapper";
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

function formatRelativeDate(dateString: string, intl: IntlShape): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // in seconds

  if (diff < 60) return intl.formatMessage({ id: "date.justNow" });
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return intl.formatMessage({ id: "date.minutesAgo" }, { minutes: mins });
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return intl.formatMessage({ id: "date.hoursAgo" }, { hours });
  }
  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return intl.formatMessage({ id: "date.daysAgo" }, { days });
  }
  // Fallback to locale date string
  return date.toLocaleDateString(intl.locale);
}

export const HistoryTable = ({
  translations,
}: {
  translations: Translation[];
}) => {
  const navigate = useNavigate();

  const intl = useIntl();

  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-gray-500 border-b">
          <th className="py-4 text-left font-medium w-56">
            <FormattedMessage
              id="dashboard.history.fileName"
              defaultMessage="File Name"
            />
          </th>
          <th className="py-4 text-left font-medium w-64">
            <FormattedMessage
              id="dashboard.history.languages"
              defaultMessage="Languages"
            />
          </th>
          <th className="py-4 text-left font-medium w-32">
            <FormattedMessage
              id="dashboard.history.date"
              defaultMessage="Date"
            />
          </th>
          <th className="py-4 text-left font-medium w-32">
            <FormattedMessage
              id="dashboard.history.status"
              defaultMessage="Status"
            />
          </th>
          <th className="py-4 text-left font-medium w-24">
            <FormattedMessage
              id="dashboard.history.credits"
              defaultMessage="Credits"
            />
          </th>
          <th className="py-4 text-left font-medium w-32">
            <FormattedMessage
              id="dashboard.history.actions"
              defaultMessage="Actions"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {translations.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center text-gray-400 py-8">
              <FormattedMessage
                id="dashboard.history.noJobs"
                defaultMessage="No translation jobs yet."
              />
            </td>
          </tr>
        ) : (
          translations.map((t) => (
            <tr
              key={t.id}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >
              <td className="py-4 font-medium text-gray-800 w-56">
                <div className="flex gap-2 justify-start items-center">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <p className="truncate max-w-56">{t.fileName}</p>
                </div>
              </td>

              <td className="py-4 w-64">
                <div className="flex gap-2 items-center flex-wrap">
                  {t.selectedLanguages.split(",").map((lang: string) => {
                    const code = lang.trim();
                    const displayText =
                      code === "zh" ? "中文" : code.toUpperCase();
                    return (
                      <span
                        key={code}
                        className="font-medium bg-gray-100 rounded-full px-2 py-0.5 text-xs"
                      >
                        <FormattedMessage
                          id={`languages.${code}`}
                          defaultMessage={displayText}
                        />
                      </span>
                    );
                  })}
                </div>
              </td>

              <td className="py-4 w-32">
                {formatRelativeDate(t.createdAt, intl)}
              </td>

              <td className="py-4 flex w-32">
                <StatusPill
                  className="text-xs border border-gray-200"
                  status={mapTranslationStatusToUI(t.status)}
                />
              </td>

              <td className="py-4 text-left w-24">{t.creditsUsed}</td>

              <td className="py-4 w-32">
                <Button
                  className="rounded-sm flex gap-4 items-center p-4 hover:cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/status/${t.batchId}`)}
                >
                  <ExternalLink className="w-4 h-4" />
                  <p>
                    <FormattedMessage
                      id="dashboard.history.view"
                      defaultMessage="View"
                    />
                  </p>
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
