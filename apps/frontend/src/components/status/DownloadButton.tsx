import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { FormattedMessage } from "react-intl";

export const DownloadButton = ({
  handleDownloadZip,
}: {
  handleDownloadZip: () => Promise<void>;
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <Button
        className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-4 py-6 px-8 rounded-lg"
        onClick={handleDownloadZip}
      >
        <Download className="size-5" />
        <p className="text-lg font-medium">
          <FormattedMessage
            id="status.download.button"
            defaultMessage="Download All Translations"
          />
        </p>
      </Button>
    </div>
  );
};

export const ZippingButton = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <Button
        disabled
        className="bg-amber-300 text-white flex items-center gap-4 py-6 px-8 rounded-lg"
      >
        <Download className="size-5" />
        <p className="text-lg font-medium">
          <FormattedMessage
            id="status.download.preparing"
            defaultMessage="Preparing Download"
          />
        </p>
      </Button>
    </div>
  );
};
