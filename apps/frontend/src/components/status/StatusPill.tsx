import { UIStatus } from "../../constants/process-status";

export const StatusPill = ({ status }: { status: string | null }) => {
  return (
    <div className={`px-4 py-1 rounded-full ${getStatusColor(status)}`}>
      <p className="font-medium">{getStatusText(status)}</p>
    </div>
  );
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case UIStatus.COMPLETED:
      return "bg-green-50 text-green-800";
    case UIStatus.ZIPPING:
      return "bg-green-50 text-green-800";
    case UIStatus.STARTED:
      return "bg-blue-50 text-blue-800";
    case UIStatus.QUEUE:
      return "bg-amber-50 text-amber-800";
    case UIStatus.ERROR:
      return "bg-red-50 text-red-800";
    default:
      return "bg-gray-50 text-gray-800";
  }
};

const getStatusText = (status: string | null) => {
  switch (status) {
    case UIStatus.COMPLETED:
      return "Completed";
    case UIStatus.ZIPPING:
      return "Creating ZIP";
    case UIStatus.STARTED:
      return "In Progress";
    case UIStatus.QUEUE:
      return "Queued";
    case UIStatus.ERROR:
      return "Error";
    default:
      return "Unknown";
  }
};
