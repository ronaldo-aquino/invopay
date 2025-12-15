"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Plus, Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { InvoiceCard } from "@/components/invoices/invoice-card";
import { InvoiceStatsCard } from "@/components/invoices/invoice-stats-card";
import { InvoiceTabs } from "@/components/invoices/invoice-tabs";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { SubscriptionTabs } from "@/components/subscriptions/subscription-tabs";
import { EmptyState } from "@/components/invoices/empty-state";
import { LoadingState } from "@/components/invoices/loading-state";
import { getStatusColor as getInvoiceStatusColor } from "@/components/invoices/status-badge";
import { getStatusColor as getSubscriptionStatusColor } from "@/components/subscriptions/status-badge";
import { useInvoiceList } from "@/hooks/useInvoiceList";
import { useSubscriptionList } from "@/hooks/useSubscriptionList";
import type { Invoice } from "@backend/lib/supabase";
import type { Subscription } from "@backend/lib/supabase";

type InvoiceTabType = "all" | "paid" | "pending" | "paidByMe";
type SubscriptionTabType = "all" | "active" | "created" | "paying";
type ViewType = "invoices" | "subscriptions";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [viewType, setViewType] = useState<ViewType>("invoices");
  const [activeInvoiceTab, setActiveInvoiceTab] = useState<InvoiceTabType>("all");
  const [activeSubscriptionTab, setActiveSubscriptionTab] = useState<SubscriptionTabType>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    allInvoices,
    paidInvoices,
    pendingInvoices,
    invoicesIPaid,
    totalCounts: invoiceCounts,
    loading: invoicesLoading,
    loadingMore: invoicesLoadingMore,
    hasMore: invoicesHasMore,
    loadMore: loadMoreInvoices,
  } = useInvoiceList(address);

  const {
    allSubscriptions,
    activeSubscriptions,
    subscriptionsICreated,
    subscriptionsIPay,
    totalCounts: subscriptionCounts,
    loading: subscriptionsLoading,
    loadingMore: subscriptionsLoadingMore,
    hasMore: subscriptionsHasMore,
    loadMore: loadMoreSubscriptions,
  } = useSubscriptionList(address);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (viewType === "invoices") {
          if (
            entries[0].isIntersecting &&
            invoicesHasMore[activeInvoiceTab] &&
            !invoicesLoadingMore &&
            !invoicesLoading
          ) {
            loadMoreInvoices(activeInvoiceTab);
          }
        } else {
          if (
            entries[0].isIntersecting &&
            subscriptionsHasMore[activeSubscriptionTab] &&
            !subscriptionsLoadingMore &&
            !subscriptionsLoading
          ) {
            loadMoreSubscriptions(activeSubscriptionTab);
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [
    viewType,
    activeInvoiceTab,
    activeSubscriptionTab,
    invoicesHasMore,
    subscriptionsHasMore,
    invoicesLoadingMore,
    subscriptionsLoadingMore,
    invoicesLoading,
    subscriptionsLoading,
    loadMoreInvoices,
    loadMoreSubscriptions,
  ]);

  if (!isConnected || !address) {
    return null;
  }

  const currentInvoices =
    activeInvoiceTab === "all"
      ? allInvoices
      : activeInvoiceTab === "paid"
        ? paidInvoices
        : activeInvoiceTab === "pending"
          ? pendingInvoices
          : invoicesIPaid;

  const currentSubscriptions =
    activeSubscriptionTab === "all"
      ? allSubscriptions
      : activeSubscriptionTab === "active"
        ? activeSubscriptions
        : activeSubscriptionTab === "created"
          ? subscriptionsICreated
          : subscriptionsIPay;

  const isLoading = viewType === "invoices" ? invoicesLoading : subscriptionsLoading;
  const isLoadingMore = viewType === "invoices" ? invoicesLoadingMore : subscriptionsLoadingMore;
  const hasMore = viewType === "invoices" ? invoicesHasMore : subscriptionsHasMore;
  const activeTab = viewType === "invoices" ? activeInvoiceTab : activeSubscriptionTab;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Manage all your {viewType === "invoices" ? "invoices" : "subscriptions"} in one place
              </p>
            </div>
            <Link href="/create">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Create {viewType === "invoices" ? "Invoice" : "Subscription"}
              </Button>
            </Link>
          </div>

          {/* View Type Selector */}
          <div className="flex gap-2 border-b-2 border-border/60 pb-2">
            <button
              onClick={() => setViewType("invoices")}
              className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ${
                viewType === "invoices"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setViewType("subscriptions")}
              className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ${
                viewType === "subscriptions"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              Subscriptions
            </button>
          </div>

          {viewType === "invoices" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InvoiceStatsCard title="All Invoices" count={invoiceCounts.all} icon="all" />
                <InvoiceStatsCard
                  title="Invoices I Paid"
                  count={invoiceCounts.paidByMe}
                  icon="paid"
                />
              </div>

              <InvoiceTabs
                activeTab={activeInvoiceTab}
                onTabChange={setActiveInvoiceTab}
                counts={{
                  all: invoiceCounts.all,
                  paid: invoiceCounts.paid,
                  pending: invoiceCounts.pending,
                  paidByMe: invoiceCounts.paidByMe,
                }}
              />

              {isLoading ? (
                <LoadingState />
              ) : currentInvoices.length === 0 ? (
                <EmptyState activeTab={activeInvoiceTab} />
              ) : (
                <>
                  <div className="grid gap-4">
                    {currentInvoices.map((invoice) => (
                      <InvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        address={address}
                        activeTab={activeInvoiceTab}
                        copiedId={copiedId}
                        onCopy={copyToClipboard}
                        getStatusColor={getInvoiceStatusColor}
                      />
                    ))}
                  </div>
                  {invoicesHasMore[activeInvoiceTab] && (
                    <div ref={observerTarget} className="flex justify-center py-8">
                      {isLoadingMore && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm">Loading more invoices...</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InvoiceStatsCard
                  title="All Subscriptions"
                  count={subscriptionCounts.all}
                  icon="all"
                />
                <InvoiceStatsCard
                  title="Active Subscriptions"
                  count={subscriptionCounts.active}
                  icon="paid"
                />
              </div>

              <SubscriptionTabs
                activeTab={activeSubscriptionTab}
                onTabChange={setActiveSubscriptionTab}
                counts={{
                  all: subscriptionCounts.all,
                  active: subscriptionCounts.active,
                  created: subscriptionCounts.created,
                  paying: subscriptionCounts.paying,
                }}
              />

              {isLoading ? (
                <LoadingState />
              ) : currentSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No subscriptions found</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {currentSubscriptions.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        address={address}
                        activeTab={activeSubscriptionTab}
                        copiedId={copiedId}
                        onCopy={copyToClipboard}
                        getStatusColor={getSubscriptionStatusColor}
                      />
                    ))}
                  </div>
                  {subscriptionsHasMore[activeSubscriptionTab] && (
                    <div ref={observerTarget} className="flex justify-center py-8">
                      {isLoadingMore && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm">Loading more subscriptions...</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
