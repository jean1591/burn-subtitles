export const StatusPill = ({ status }: { status: string | null }) => {
  return (
    <div className={`px-4 py-1 rounded-full ${getStatusColor(status)}`}>
      <p className="font-medium">{getStatusText(status)}</p>
    </div>
  );
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-800";
    case "zipping":
      return "bg-green-50 text-green-800";
    case "started":
      return "bg-blue-50 text-blue-800";
    case "queue":
      return "bg-amber-50 text-amber-800";
    case "error":
      return "bg-red-50 text-red-800";
    default:
      return "bg-gray-50 text-gray-800";
  }
};

const getStatusText = (status: string | null) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "zipping":
      return "Creating ZIP";
    case "started":
      return "In Progress";
    case "queue":
      return "Queued";
    case "error":
      return "Error";
    default:
      return "Unknown";
  }
};
