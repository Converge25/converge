type StatusType = "completed" | "active" | "scheduled" | "draft";

interface StatusBadgeProps {
  status: StatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles = {
    completed: "bg-status-successLight text-status-success",
    active: "bg-status-infoLight text-status-info",
    scheduled: "bg-status-warningLight text-status-warning",
    draft: "bg-neutral-lightest text-neutral-medium"
  };

  const statusText = {
    completed: "Completed",
    active: "Active",
    scheduled: "Scheduled",
    draft: "Draft"
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  );
}
