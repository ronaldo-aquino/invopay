import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeeCardProps {
  title: string;
  description: string;
  availableAmount: string;
  withdrawnAmount: string;
  isLoadingWithdrawn: boolean;
  isWithdrawing: boolean;
  isConfirming: boolean;
  onWithdraw: () => void;
  onRefresh: () => void;
  iconColor: string;
  bgGradient: string;
  buttonColor: string;
}

export function FeeCard({
  title,
  description,
  availableAmount,
  withdrawnAmount,
  isLoadingWithdrawn,
  isWithdrawing,
  isConfirming,
  onWithdraw,
  onRefresh,
  iconColor,
  bgGradient,
  buttonColor,
}: FeeCardProps) {
  const hasFees = parseFloat(availableAmount) > 0;

  return (
    <Card
      className={`border-2 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gradient-to-br from-background ${bgGradient}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center`}
          >
            <svg
              className={`w-6 h-6 ${iconColor.split(" ")[0]}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Available to Withdraw
            </p>
            <div className={`text-4xl font-bold ${iconColor.split(" ")[0]}`}>
              {availableAmount
                ? isNaN(parseFloat(availableAmount))
                  ? "0.000000"
                  : parseFloat(availableAmount).toFixed(6)
                : "0.000000"}
            </div>
            <p className={`text-sm font-semibold ${iconColor.split(" ")[0]}`}>
              {title.split(" ")[0]}
            </p>
          </div>

          <div className="pt-3 border-t border-border/40">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Total Withdrawn
              </p>
              <button
                onClick={onRefresh}
                disabled={isLoadingWithdrawn}
                className={`text-xs ${iconColor.split(" ")[0]} hover:underline disabled:opacity-50`}
              >
                {isLoadingWithdrawn ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <p className={`text-lg font-bold ${iconColor.split(" ")[0]}`}>
              {isLoadingWithdrawn
                ? "Loading..."
                : withdrawnAmount && !isNaN(parseFloat(withdrawnAmount))
                  ? parseFloat(withdrawnAmount).toFixed(6)
                  : "0.000000"}{" "}
              {title.split(" ")[0]}
            </p>
          </div>

          <Button
            onClick={onWithdraw}
            disabled={isWithdrawing || isConfirming || !hasFees}
            className={`w-full ${buttonColor} text-white`}
          >
            {isWithdrawing || isConfirming
              ? "Processing..."
              : !hasFees
                ? "No Fees to Withdraw"
                : `Withdraw ${title.split(" ")[0]} Fees`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
