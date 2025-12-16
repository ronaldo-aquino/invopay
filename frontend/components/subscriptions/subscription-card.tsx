import Link from "next/link";
import { Copy, Check, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { truncateAddress, formatDate } from "@/lib/utils";
import type { Subscription } from "@backend/lib/supabase";

type TabType = "all" | "active" | "created" | "paying";

interface SubscriptionCardProps {
  subscription: Subscription;
  address: string;
  activeTab: TabType;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  getStatusColor: (status: string) => string;
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

export function SubscriptionCard({
  subscription,
  address,
  activeTab,
  copiedId,
  onCopy,
  getStatusColor,
}: SubscriptionCardProps) {
  const isSubscriptionCreatedByUser =
    subscription.creator_wallet_address.toLowerCase() === address?.toLowerCase();
  const isSubscriptionPaidByUser =
    subscription.payer_wallet_address.toLowerCase() === address?.toLowerCase();

  const nextPaymentDate = new Date(subscription.next_payment_due);
  const isPaymentDue = nextPaymentDate <= new Date();

  return (
    <Card className="border-2 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
      <CardContent className="pt-6">
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {subscription.amount} {subscription.currency}
                </h3>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusColor(
                    subscription.status
                  )}`}
                >
                  {subscription.status}
                </span>
                {isPaymentDue && subscription.status === "active" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900">
                    <Clock className="h-3 w-3" />
                    Payment Due
                  </span>
                )}
              </div>
              {subscription.description && (
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {subscription.description}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onCopy(
                    `${window.location.origin}/subscription/${subscription.id}`,
                    subscription.id
                  )
                }
                className="h-9 w-9 p-0 hover:bg-primary/10"
                title="Copy subscription link"
              >
                {copiedId === subscription.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Link href={`/subscription/${subscription.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-primary/10"
                  title="View subscription"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-border/60">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Period
              </p>
              <p className="text-sm font-medium">{formatPeriod(subscription.period_seconds)}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Next Payment
              </p>
              <p className="text-sm font-medium">{formatDate(subscription.next_payment_due)}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Total Payments
              </p>
              <p className="text-sm font-medium">{subscription.total_payments}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-border/60">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Subscription ID
              </p>
              <p className="font-mono text-sm font-medium break-all bg-muted/50 px-2 py-1.5 rounded-md">
                {truncateAddress(subscription.id)}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {activeTab === "paying" ? "Receiver" : "Payer"}
              </p>
              <p className="font-mono text-sm font-medium bg-muted/50 px-2 py-1.5 rounded-md">
                {activeTab === "paying"
                  ? truncateAddress(subscription.receiver_wallet_address)
                  : truncateAddress(subscription.payer_wallet_address)}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Created
              </p>
              <p className="text-sm font-medium">{formatDate(subscription.created_at)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



