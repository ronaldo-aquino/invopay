type TabType = "all" | "active" | "created" | "paying";

interface SubscriptionTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    all: number;
    active: number;
    created: number;
    paying: number;
  };
}

export function SubscriptionTabs({ activeTab, onTabChange, counts }: SubscriptionTabsProps) {
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
            All Subscriptions ({counts.all})
          </button>
          <button
            onClick={() => onTabChange("active")}
            className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === "active"
                ? "bg-background text-primary shadow-sm border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Active ({counts.active})
          </button>
          <button
            onClick={() => onTabChange("created")}
            className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === "created"
                ? "bg-background text-primary shadow-sm border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Created by Me ({counts.created})
          </button>
        </div>
        <button
          onClick={() => onTabChange("paying")}
          className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
            activeTab === "paying"
              ? "bg-background text-primary shadow-sm border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          I'm Paying ({counts.paying})
        </button>
      </div>
    </div>
  );
}
