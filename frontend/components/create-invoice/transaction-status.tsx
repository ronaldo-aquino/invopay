interface TransactionStatusProps {
  isCreatingOnChain: boolean;
  isWaitingForTx: boolean;
  createTxHash: string | undefined;
}

export function TransactionStatus({
  isCreatingOnChain,
  isWaitingForTx,
  createTxHash,
}: TransactionStatusProps) {
  if (!isCreatingOnChain && !isWaitingForTx) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border-2 border-blue-300 dark:border-blue-800 rounded-xl p-5 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent"></div>
          <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
            {isCreatingOnChain && !createTxHash
              ? "Please approve the transaction in your wallet to register this invoice on-chain..."
              : isWaitingForTx
                ? "Waiting for transaction confirmation. The invoice will be saved after confirmation..."
                : "Processing..."}
          </p>
        </div>
        {createTxHash && (
          <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Transaction Hash (createInvoice):
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-blue-700 dark:text-blue-400 font-mono break-all bg-blue-100 dark:bg-blue-950/50 px-2 py-1.5 rounded">
                {createTxHash}
              </p>
              <a
                href={`https://testnet.arcscan.app/tx/${createTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
              >
                View on ArcScan →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

