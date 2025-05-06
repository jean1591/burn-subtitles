import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { JobStatus, UIStatus } from "../../constants/process-status";

import { Job } from "../StatusPage";

export const DetailsPanel = ({
  status,
  jobs,
}: {
  status: string | null;
  jobs: Job[];
}) => {
  switch (status) {
    case UIStatus.COMPLETED:
      return <DonePanel />;
    case UIStatus.ZIPPING:
      return <ZippingPanel />;
    case UIStatus.QUEUE:
      return <QueuePanel />;
    case UIStatus.STARTED:
      return <InProgressPanel jobs={jobs} />;
    default:
      return null;
  }
};

const DonePanel = () => {
  return (
    <Alert className="mb-6 bg-green-50 border-green-200">
      <AlertTitle>
        <p className="text-xl font-semibold text-green-800">
          Your translations are ready!
        </p>
      </AlertTitle>

      <AlertDescription>
        <p className="text-lg text-green-800">
          Download the zip file containing all your translated subtitle files.
        </p>
      </AlertDescription>
    </Alert>
  );
};

const ZippingPanel = () => {
  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertTitle>
        <p className="text-xl font-semibold text-amber-800">
          Creating your download...
        </p>
      </AlertTitle>

      <AlertDescription>
        <p className="text-lg text-amber-800">
          All translations are complete. We're packaging your files into a ZIP
          archive.
        </p>
      </AlertDescription>
    </Alert>
  );
};

const QueuePanel = () => {
  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertTitle>
        <p className="text-xl font-semibold text-amber-800">
          Your files are in the queue
        </p>
      </AlertTitle>

      <AlertDescription>
        <p className="text-lg text-amber-800">Current position: 3 in line</p>
      </AlertDescription>
    </Alert>
  );
};

const InProgressPanel = ({ jobs }: { jobs: Job[] }) => {
  const current = jobs.filter((job) => job.status === JobStatus.DONE).length;
  const total = jobs.length;
  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertTitle>
        <p className="text-xl font-semibold text-amber-800">
          Translation in progress
        </p>
      </AlertTitle>

      <AlertDescription className="mt-4">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
        <div className="w-full flex items-center justify-end">
          <p className="text-right mt-2 text-amber-800">
            {current} of {total} files completed
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
