import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { InvoiceFormData } from "@/hooks/useInvoiceForm";

interface InvoiceFormProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
}

export function InvoiceForm({ register, errors }: InvoiceFormProps) {
  return (
    <>
      <div className="space-y-2.5">
        <Label htmlFor="amount" className="text-sm font-semibold">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          className="h-12 text-base"
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-sm text-destructive font-medium">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="currency" className="text-sm font-semibold">
          Currency
        </Label>
        <Select id="currency" className="h-12 text-base" {...register("currency")}>
          <option value="">Select currency</option>
          <option value="USDC">USDC</option>
          <option value="EURC">EURC</option>
        </Select>
        {errors.currency && (
          <p className="text-sm text-destructive font-medium">{errors.currency.message}</p>
        )}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="receiver_wallet_address" className="text-sm font-semibold">
          Receiver Wallet Address
        </Label>
        <Input
          id="receiver_wallet_address"
          type="text"
          placeholder="0x..."
          className="h-12 text-base font-mono"
          {...register("receiver_wallet_address")}
        />
        {errors.receiver_wallet_address && (
          <p className="text-sm text-destructive font-medium">
            {errors.receiver_wallet_address.message}
          </p>
        )}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="description" className="text-sm font-semibold">
          Description
        </Label>
        <textarea
          id="description"
          rows={4}
          placeholder="Enter invoice description..."
          className="flex min-h-[100px] w-full rounded-md border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive font-medium">{errors.description.message}</p>
        )}
      </div>
    </>
  );
}
