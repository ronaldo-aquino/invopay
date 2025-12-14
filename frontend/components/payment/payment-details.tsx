import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/invoices/status-badge";
import type { Invoice } from "@backend/lib/supabase";

interface PaymentDetailsProps {
  invoice: Invoice;
}

export function PaymentDetails({ invoice }: PaymentDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Amount to Pay
        </p>
        <p className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {invoice.amount} {invoice.currency}
        </p>
      </div>

      <div className="space-y-5 p-5 rounded-xl bg-muted/30 border border-border/60">
        {invoice.description && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Description
            </p>
            <p className="text-sm font-medium leading-relaxed">{invoice.description}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Receiver Address
          </p>
          <p className="font-mono text-sm font-medium break-all bg-background px-3 py-2 rounded-md border">
            {invoice.receiver_wallet_address}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Status
          </p>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Created
            </p>
            <p className="text-sm font-medium">{formatDate(invoice.created_at)}</p>
          </div>
          {invoice.paid_at && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Paid
              </p>
              <p className="text-sm font-medium">{formatDate(invoice.paid_at)}</p>
            </div>
          )}
        </div>

        {invoice.transaction_hash && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Transaction Hash
            </p>
            <a
              href={`https://testnet.arcscan.app/tx/${invoice.transaction_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline break-all font-mono bg-background px-3 py-2 rounded-md border block"
            >
              {invoice.transaction_hash}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

