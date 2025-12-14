import { useState, useEffect } from "react";
import type { Invoice } from "@backend/lib/supabase";
import { getInvoiceById } from "@backend/lib/services/invoice-db.service";

export function useInvoice(invoiceId: string | undefined) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = async () => {
    if (!invoiceId) return;

    try {
      const data = await getInvoiceById(invoiceId);
      setInvoice(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  useEffect(() => {
    if (invoice && invoice.status === "pending") {
      const interval = setInterval(fetchInvoice, 2000);
      return () => clearInterval(interval);
    }
  }, [invoice]);

  return {
    invoice,
    loading,
    refetch: fetchInvoice,
  };
}
