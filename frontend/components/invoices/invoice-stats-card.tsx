import { Card, CardContent } from "@/components/ui/card";
import { FileText, Check } from "lucide-react";

interface InvoiceStatsCardProps {
  title: string;
  count: number;
  icon: "all" | "paid";
}

export function InvoiceStatsCard({ title, count, icon }: InvoiceStatsCardProps) {
  const IconComponent = icon === "all" ? FileText : Check;
  const iconColor =
    icon === "all" ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400";
  const bgColor =
    icon === "all"
      ? "from-blue-500/10 to-blue-600/20 dark:from-blue-500/20 dark:to-blue-600/30"
      : "from-green-500/10 to-green-600/20 dark:from-green-500/20 dark:to-green-600/30";

  return (
    <Card className="border-2 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-background to-muted/30">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {count}
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${bgColor} flex items-center justify-center shadow-sm`}
          >
            <IconComponent className={`w-7 h-7 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

