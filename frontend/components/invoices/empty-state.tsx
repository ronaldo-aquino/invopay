import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

type TabType = "all" | "paid" | "pending" | "paidByMe";

interface EmptyStateProps {
  activeTab: TabType;
}

export function EmptyState({ activeTab }: EmptyStateProps) {
  const messages = {
    all: {
      title: "No invoices created yet",
      description: "Start creating invoices to receive payments in USDC or EURC",
      showButton: true,
    },
    paid: {
      title: "No paid invoices yet",
      description: "Invoices you've created that have been paid will appear here",
      showButton: false,
    },
    pending: {
      title: "No pending invoices yet",
      description: "Invoices you've created that are waiting for payment will appear here",
      showButton: true,
    },
    paidByMe: {
      title: "No invoices paid yet",
      description: "Invoices created by others that you've paid will appear here",
      showButton: false,
    },
  };

  const message = messages[activeTab];

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="pt-6 text-center py-16">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold mb-2">{message.title}</p>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{message.description}</p>
        {message.showButton && (
          <Link href="/create">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Invoice
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

