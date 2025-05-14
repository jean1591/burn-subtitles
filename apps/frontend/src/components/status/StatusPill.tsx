import { FormattedMessage } from "react-intl";
import { UIStatus } from "../../constants/process-status";

export const StatusPill = ({
  className,
  status,
}: {
  className?: string;
  status: string | null;
}) => {
  return (
    <div
      className={`px-4 py-1 rounded-full ${getStatusColor(
        status
      )} ${className}`}
    >
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
      return (
        <FormattedMessage
          id="status.pill.completed"
          defaultMessage="Completed"
        />
      );
    case UIStatus.ZIPPING:
      return (
        <FormattedMessage
          id="status.pill.zipping"
          defaultMessage="Creating ZIP"
        />
      );
    case UIStatus.STARTED:
      return (
        <FormattedMessage
          id="status.pill.inProgress"
          defaultMessage="In Progress"
        />
      );
    case UIStatus.QUEUE:
      return (
        <FormattedMessage id="status.pill.queued" defaultMessage="Queued" />
      );
    case UIStatus.ERROR:
      return <FormattedMessage id="status.pill.error" defaultMessage="Error" />;
    default:
      return (
        <FormattedMessage id="status.pill.unknown" defaultMessage="Unknown" />
      );
  }
};
