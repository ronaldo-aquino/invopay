import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isAddress } from "viem";

const invoiceSchema = z.object({
  amount: z.number().positive("Amount must be positive").min(0.01, "Amount must be at least 0.01"),
  currency: z.enum(["USDC", "EURC"], {
    required_error: "Please select a currency",
  }),
  receiver_wallet_address: z
    .string()
    .min(1, "Receiver address is required")
    .refine((val) => isAddress(val), "Invalid Ethereum address"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export function useInvoiceForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  const amount = watch("amount");
  const currency = watch("currency");
  const [watchAmount, setWatchAmount] = useState<number | null>(null);
  const [watchCurrency, setWatchCurrency] = useState<"USDC" | "EURC" | "">("");

  useEffect(() => {
    const numAmount = typeof amount === "number" && !isNaN(amount) ? amount : null;
    setWatchAmount(numAmount);
    setWatchCurrency(currency as "USDC" | "EURC" | "");
  }, [amount, currency]);

  const feeAmount = useMemo(() => {
    if (!watchAmount || isNaN(watchAmount) || watchAmount <= 0) return 0;
    const calculated = watchAmount * 0.0005;
    return isNaN(calculated) ? 0 : calculated;
  }, [watchAmount]);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watchAmount,
    watchCurrency,
    feeAmount,
  };
}
