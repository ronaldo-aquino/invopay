type TabType = "all" | "paid" | "pending" | "paidByMe";

interface InvoiceTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    all: number;
    paid: number;
    pending: number;
    paidByMe: number;
  };
}

export function InvoiceTabs({ activeTab, onTabChange, counts }: InvoiceTabsProps) {
  return (
    <div className="border-b-2 border-border/60 bg-muted/30 rounded-t-lg">
      <div className="flex justify-between items-center space-x-1 p-1 overflow-x-auto">
        <div className="flex space-x-1">
          <button
            onClick={() => onTabChange("all")}
            className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === "all"
                ? "bg-background text-primary shadow-sm border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            All Invoices ({counts.all})
          </button>
          <button
            onClick={() => onTabChange("paid")}
            className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === "paid"
                ? "bg-background text-primary shadow-sm border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Paid Invoices ({counts.paid})
          </button>
          <button
            onClick={() => onTabChange("pending")}
            className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === "pending"
                ? "bg-background text-primary shadow-sm border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Pending Invoices ({counts.pending})
          </button>
        </div>
        <button
          onClick={() => onTabChange("paidByMe")}
          className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
            activeTab === "paidByMe"
              ? "bg-background text-primary shadow-sm border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          Invoices I Paid ({counts.paidByMe})
        </button>
      </div>
    </div>
  );
}

