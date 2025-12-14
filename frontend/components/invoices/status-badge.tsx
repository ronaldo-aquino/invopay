export function getStatusColor(status: string): string {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200";
    case "expired":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200";
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200";
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
      {status}
    </span>
  );
}

