import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS } from "@/lib/constants";
import { INVOPAY_SUBSCRIPTION_ABI } from "@/lib/subscription-contract-abi";
import { updateSubscription } from "@backend/lib/services/subscription-db.service";
import type { Subscription } from "@backend/lib/supabase";

export function useCancelSubscription(
  subscription: Subscription | null,
  subscriptionIdBytes32: `0x${string}` | undefined,
  onCancelSuccess?: () => void
) {
  const { address } = useAccount();
  const [isCancelling, setIsCancelling] = useState(false);

  const isCreator = 
    address && 
    subscription && 
    address.toLowerCase() === subscription.creator_wallet_address.toLowerCase();

  const isPayer = 
    address && 
    subscription && 
    subscription.payer_wallet_address &&
    subscription.payer_wallet_address !== "0x0000000000000000000000000000000000000000" &&
    address.toLowerCase() === subscription.payer_wallet_address.toLowerCase();

  const canCancelByCreator = 
    isCreator && 
    subscription && 
    (subscription.status === "pending" || 
     subscription.status === "active" || 
     subscription.status === "paused");

  const canCancelByPayer = 
    isPayer && 
    subscription && 
    (subscription.status === "active" || subscription.status === "paused");

  const functionName = isCreator ? "cancelByCreator" : "cancelByPayer";

  const {
    writeContract: writeCancel,
    data: cancelTxHash,
    error: cancelError,
    isError: isCancelError,
    isPending: isCancellingOnChain,
  } = useWriteContract();

  const {
    isLoading: isWaitingForCancel,
    data: cancelReceipt,
    error: cancelReceiptError,
    isError: isCancelReceiptError,
  } = useWaitForTransactionReceipt({
    hash: cancelTxHash,
  });

  const handleCancel = async () => {
    if (!subscription || !subscriptionIdBytes32 || !INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS) {
      return;
    }

    if (!canCancelByCreator && !canCancelByPayer) {
      return;
    }

    setIsCancelling(true);

    const cancelArgs = {
      address: INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
      abi: INVOPAY_SUBSCRIPTION_ABI,
      functionName: functionName as "cancelByCreator" | "cancelByPayer",
      args: [subscriptionIdBytes32] as const,
    };

    writeCancel(cancelArgs);
  };

  // Update database when cancellation is confirmed
  useEffect(() => {
    if (cancelReceipt && subscription && (cancelReceipt.status === "success" || cancelReceipt.status === 1)) {
      const updateStatus = async () => {
        try {
          const newStatus = isCreator 
            ? "cancelled_by_creator" 
            : "cancelled_by_payer";
          
          await updateSubscription(subscription.id, {
            status: newStatus as any,
          });

          if (onCancelSuccess) {
            onCancelSuccess();
          }
        } catch (error) {
        } finally {
          setIsCancelling(false);
        }
      };

      updateStatus();
    }
  }, [cancelReceipt, subscription, isCreator]);

  return {
    handleCancel,
    isCancelling: isCancelling || isCancellingOnChain || isWaitingForCancel,
    canCancelByCreator,
    canCancelByPayer,
    cancelError,
    isCancelError,
    cancelReceiptError,
    isCancelReceiptError,
    cancelTxHash,
  };
}
