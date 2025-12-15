export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200";
    case "cancelled_by_creator":
    case "cancelled_by_payer":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200";
    case "paused":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200";
  }
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusColor(status)}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}


