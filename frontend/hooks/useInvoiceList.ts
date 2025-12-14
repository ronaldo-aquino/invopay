import { useState, useEffect, useCallback } from "react";
import type { Invoice } from "@backend/lib/supabase";
import {
  getAllInvoicesByUserPaginated,
  getPaidInvoicesByUserPaginated,
  getPendingInvoicesByUserPaginated,
  getInvoicesPaidByUserPaginated,
  getAllInvoicesByUser,
  getPaidInvoicesByUser,
  getPendingInvoicesByUser,
  getInvoicesPaidByUser,
} from "@backend/lib/services/invoice-db.service";

type TabType = "all" | "paid" | "pending" | "paidByMe";

export function useInvoiceList(address: string | undefined) {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
  const [invoicesIPaid, setInvoicesIPaid] = useState<Invoice[]>([]);
  const [totalCounts, setTotalCounts] = useState({
    all: 0,
    paid: 0,
    pending: 0,
    paidByMe: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState({
    all: true,
    paid: true,
    pending: true,
    paidByMe: true,
  });
  const [currentPage, setCurrentPage] = useState({
    all: 0,
    paid: 0,
    pending: 0,
    paidByMe: 0,
  });

  const fetchInitialData = async () => {
    if (!address) return;

    try {
      setLoading(true);

      const [allData, paidData, pendingData, paidByMeData] = await Promise.all([
        getAllInvoicesByUser(address),
        getPaidInvoicesByUser(address),
        getPendingInvoicesByUser(address),
        getInvoicesPaidByUser(address),
      ]);

      setTotalCounts({
        all: allData.length,
        paid: paidData.length,
        pending: pendingData.length,
        paidByMe: paidByMeData.length,
      });

      const [allPaginated, paidPaginated, pendingPaginated, paidByMePaginated] = await Promise.all([
        getAllInvoicesByUserPaginated(address, 0),
        getPaidInvoicesByUserPaginated(address, 0),
        getPendingInvoicesByUserPaginated(address, 0),
        getInvoicesPaidByUserPaginated(address, 0),
      ]);

      setAllInvoices(allPaginated.data);
      setPaidInvoices(paidPaginated.data);
      setPendingInvoices(pendingPaginated.data);
      setInvoicesIPaid(paidByMePaginated.data);

      setHasMore({
        all: allPaginated.hasMore,
        paid: paidPaginated.hasMore,
        pending: pendingPaginated.hasMore,
        paidByMe: paidByMePaginated.hasMore,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(
    async (tab: TabType) => {
      if (!address || loadingMore || !hasMore[tab]) return;

      try {
        setLoadingMore(true);
        const nextPage = currentPage[tab] + 1;

        let result: { data: Invoice[]; hasMore: boolean };
        switch (tab) {
          case "all":
            result = await getAllInvoicesByUserPaginated(address, nextPage);
            setAllInvoices((prev) => [...prev, ...result.data]);
            break;
          case "paid":
            result = await getPaidInvoicesByUserPaginated(address, nextPage);
            setPaidInvoices((prev) => [...prev, ...result.data]);
            break;
          case "pending":
            result = await getPendingInvoicesByUserPaginated(address, nextPage);
            setPendingInvoices((prev) => [...prev, ...result.data]);
            break;
          case "paidByMe":
            result = await getInvoicesPaidByUserPaginated(address, nextPage);
            setInvoicesIPaid((prev) => [...prev, ...result.data]);
            break;
        }

        setHasMore((prev) => ({ ...prev, [tab]: result.hasMore }));
        setCurrentPage((prev) => ({ ...prev, [tab]: nextPage }));
      } catch (error) {
      } finally {
        setLoadingMore(false);
      }
    },
    [address, loadingMore, hasMore, currentPage]
  );

  const refetch = useCallback(async () => {
    if (!address) return;

    try {
      setLoading(true);
      setCurrentPage({ all: 0, paid: 0, pending: 0, paidByMe: 0 });

      const [allPaginated, paidPaginated, pendingPaginated, paidByMePaginated] = await Promise.all([
        getAllInvoicesByUserPaginated(address, 0),
        getPaidInvoicesByUserPaginated(address, 0),
        getPendingInvoicesByUserPaginated(address, 0),
        getInvoicesPaidByUserPaginated(address, 0),
      ]);

      setAllInvoices(allPaginated.data);
      setPaidInvoices(paidPaginated.data);
      setPendingInvoices(pendingPaginated.data);
      setInvoicesIPaid(paidByMePaginated.data);

      setHasMore({
        all: allPaginated.hasMore,
        paid: paidPaginated.hasMore,
        pending: pendingPaginated.hasMore,
        paidByMe: paidByMePaginated.hasMore,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchInitialData();
    }
  }, [address]);

  return {
    allInvoices,
    paidInvoices,
    pendingInvoices,
    invoicesIPaid,
    totalCounts,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refetch,
  };
}
