import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string | null;
  dbSaveError: { invoiceData: any; receipt: any } | null;
  isCreatingOnChain: boolean;
  onRetry: () => void;
}

export function ErrorDisplay({
  error,
  dbSaveError,
  isCreatingOnChain,
  onRetry,
}: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl p-4 shadow-sm overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-red-600 dark:text-red-400 text-sm font-bold">!</span>
        </div>
        <div className="flex-1 space-y-3 min-w-0 overflow-hidden">
          <p className="text-sm text-red-900 dark:text-red-200 font-semibold break-words overflow-wrap-anywhere">
            Error: {error}
          </p>
          {dbSaveError ? (
            <div className="space-y-3">
              <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                The invoice was successfully registered on-chain, but saving to database failed. You
                can retry saving it.
              </p>
              <Button
                type="button"
                onClick={onRetry}
                disabled={isCreatingOnChain}
                className="w-full"
                variant="outline"
                size="sm"
              >
                {isCreatingOnChain ? "Retrying..." : "Retry Save to Database"}
              </Button>
              <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all bg-red-50 dark:bg-red-950/30 px-2 py-1.5 rounded overflow-hidden">
                {dbSaveError.receipt.transactionHash}
              </p>
            </div>
          ) : (
            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
              Please check your wallet and try again. Make sure you have approved the contract to
              spend tokens for the fee.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
