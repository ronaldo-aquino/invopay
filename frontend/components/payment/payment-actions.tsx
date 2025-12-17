import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { INVOPAY_CONTRACT_ADDRESS } from "@/lib/constants";
import type { Invoice } from "@backend/lib/supabase";
import { ArrowRightLeft, Lock, Loader2, Info } from "lucide-react";

interface PaymentActionsProps {
  invoice: Invoice;
  isConnected: boolean;
  onChainInvoice: any;
  needsApproval: boolean;
  isApproving: boolean;
  isApprovalConfirming: boolean;
  isPaying: boolean;
  isPaymentConfirming: boolean;
  invoiceIdBytes32: `0x${string}` | undefined;
  transferHash: `0x${string}` | undefined;
  isPayError: boolean;
  payError: any;
  isPaymentReceiptError: boolean;
  paymentReceiptError: any;
  onApprove: () => void;
  onPay: () => void;
  onOpenCCTPModal?: () => void;
}

export function PaymentActions({
  invoice,
  isConnected,
  onChainInvoice,
  needsApproval,
  isApproving,
  isApprovalConfirming,
  isPaying,
  isPaymentConfirming,
  invoiceIdBytes32,
  transferHash,
  isPayError,
  payError,
  isPaymentReceiptError,
  paymentReceiptError,
  onApprove,
  onPay,
  onOpenCCTPModal,
}: PaymentActionsProps) {
  if (!INVOPAY_CONTRACT_ADDRESS) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Contract not configured. Please set NEXT_PUBLIC_INVOPAY_CONTRACT_ADDRESS
        </p>
      </div>
    );
  }

  if (!isConnected) {
    return <ConnectButton />;
  }

  const isPayButtonDisabled =
    isPaying || isPaymentConfirming || needsApproval || !invoiceIdBytes32 || !onChainInvoice;
  
  const isProcessing = isApproving || isApprovalConfirming || isPaying || isPaymentConfirming;

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {!onChainInvoice && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Invoice is not yet registered on-chain. Please wait for the registration to complete.
            </p>
          </div>
        )}

        {needsApproval && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Passo 1: Aprovação Obrigatória
              </span>
            </div>
            <Button
              onClick={onApprove}
              disabled={isApproving || isApprovalConfirming}
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold"
              size="lg"
            >
              {isApproving || isApprovalConfirming ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Aprovando...
                </>
              ) : (
                `Approve ${invoice.currency}`
              )}
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
              needsApproval 
                ? "bg-muted text-muted-foreground" 
                : "bg-primary text-primary-foreground"
            }`}>
              2
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Passo 2: Pagamento
            </span>
          </div>
          {isPayButtonDisabled && needsApproval ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button
                    onClick={onPay}
                    disabled={isPayButtonDisabled}
                    variant="outline"
                    className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold opacity-60 cursor-not-allowed"
                    size="lg"
                  >
                    <Lock className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {isPaying || isPaymentConfirming
                      ? "Processando Pagamento..."
                      : !onChainInvoice
                        ? "Aguardando registro on-chain..."
                        : `Aguardando aprovação...`}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Você deve aprovar {invoice.currency} primeiro (Passo 1)</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={onPay}
              disabled={isPayButtonDisabled}
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold"
              size="lg"
            >
              {isPaying || isPaymentConfirming ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Processando Pagamento...
                </>
              ) : !onChainInvoice ? (
                "Aguardando registro on-chain..."
              ) : (
                `Pay ${invoice.amount} ${invoice.currency}`
              )}
            </Button>
          )}
        </div>
        
        {invoice.currency === "USDC" && onOpenCCTPModal && (
          <div className="space-y-2 pt-2 border-t border-border/60">
            <Button
              onClick={onOpenCCTPModal}
              disabled={needsApproval || !onChainInvoice}
              variant="outline"
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              size="lg"
            >
              <ArrowRightLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Pay with USDC from Another Chain
            </Button>
            <div className="flex items-start gap-2 p-2 bg-blue-50/50 dark:bg-blue-950/10 rounded-md">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Não tem saldo nesta rede? Pague de outra rede via bridge usando CCTP
              </p>
            </div>
          </div>
        )}
        
        {transferHash && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm font-semibold text-green-800 dark:text-green-200">
              Payment Successful!
            </p>
            <a
              href={`https://testnet.arcscan.app/tx/${transferHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              View Transaction
            </a>
          </div>
        )}
        {(isPayError || isPaymentReceiptError) && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">
              {payError?.message ||
                paymentReceiptError?.message ||
                "Payment failed. Please try again."}
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
