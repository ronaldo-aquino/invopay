import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/subscriptions/status-badge";
import type { Subscription } from "@backend/lib/supabase";

interface SubscriptionDetailsProps {
  subscription: Subscription;
}

function formatPeriod(periodSeconds: number): string {
  const days = Math.floor(periodSeconds / 86400);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months >= 1) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  } else if (weeks >= 1) {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  } else {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }
}

export function SubscriptionDetails({ subscription }: SubscriptionDetailsProps) {
  const nextPaymentDate = new Date(subscription.next_payment_due);
  const isPaymentDue = nextPaymentDate <= new Date();

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Amount per Period
        </p>
        <p className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {subscription.amount} {subscription.currency}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Every {formatPeriod(subscription.period_seconds)}
        </p>
      </div>

      <div className="space-y-5 p-5 rounded-xl bg-muted/30 border border-border/60">
        {subscription.description && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Description
            </p>
            <p className="text-sm font-medium leading-relaxed">{subscription.description}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Status
          </p>
          <StatusBadge status={subscription.status} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Period
            </p>
            <p className="text-sm font-medium">{formatPeriod(subscription.period_seconds)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Total Payments
            </p>
            <p className="text-sm font-medium">{subscription.total_payments}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Next Payment Due
          </p>
          <p className={`text-sm font-medium ${isPaymentDue ? "text-orange-600 dark:text-orange-400" : ""}`}>
            {formatDate(subscription.next_payment_due)}
            {isPaymentDue && subscription.status === "active" && (
              <span className="ml-2 text-xs font-semibold">(Due Now)</span>
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Payer Address
            </p>
            <p className="font-mono text-sm font-medium break-all bg-background px-3 py-2 rounded-md border">
              {subscription.payer_wallet_address}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Receiver Address
            </p>
            <p className="font-mono text-sm font-medium break-all bg-background px-3 py-2 rounded-md border">
              {subscription.receiver_wallet_address}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Created
          </p>
          <p className="text-sm font-medium">{formatDate(subscription.created_at)}</p>
        </div>
      </div>
    </div>
  );
}



