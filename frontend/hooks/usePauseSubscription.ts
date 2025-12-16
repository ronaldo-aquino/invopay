import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS } from "@/lib/constants";
import { INVOPAY_SUBSCRIPTION_ABI } from "@/lib/subscription-contract-abi";
import { updateSubscription } from "@backend/lib/services/subscription-db.service";
import type { Subscription } from "@backend/lib/supabase";

export function usePauseSubscription(
  subscription: Subscription | null,
  subscriptionIdBytes32: `0x${string}` | undefined,
  onPauseSuccess?: () => void
) {
  const { address } = useAccount();
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  const isCreator = 
    address && 
    subscription && 
    address.toLowerCase() === subscription.creator_wallet_address.toLowerCase();

  const canPause = isCreator && subscription && subscription.status === "active";
  const canResume = isCreator && subscription && subscription.status === "paused";

  const {
    writeContract: writePause,
    data: pauseTxHash,
    error: pauseError,
    isError: isPauseError,
    isPending: isPausingOnChain,
  } = useWriteContract();

  const {
    writeContract: writeResume,
    data: resumeTxHash,
    error: resumeError,
    isError: isResumeError,
    isPending: isResumingOnChain,
  } = useWriteContract();

  const {
    isLoading: isWaitingForPause,
    data: pauseReceipt,
    error: pauseReceiptError,
    isError: isPauseReceiptError,
  } = useWaitForTransactionReceipt({
    hash: pauseTxHash,
  });

  const {
    isLoading: isWaitingForResume,
    data: resumeReceipt,
    error: resumeReceiptError,
    isError: isResumeReceiptError,
  } = useWaitForTransactionReceipt({
    hash: resumeTxHash,
  });

  const handlePause = async () => {
    if (!subscription || !subscriptionIdBytes32 || !INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS) {
      alert("Contract not configured or subscription not found");
      return;
    }

    if (!canPause) {
      alert("You don't have permission to pause this subscription");
      return;
    }

    setIsPausing(true);

    const pauseArgs = {
      address: INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
      abi: INVOPAY_SUBSCRIPTION_ABI,
      functionName: "pauseSubscription" as const,
      args: [subscriptionIdBytes32] as const,
    };

    writePause(pauseArgs);
  };

  const handleResume = async () => {
    if (!subscription || !subscriptionIdBytes32 || !INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS) {
      alert("Contract not configured or subscription not found");
      return;
    }

    if (!canResume) {
      alert("You don't have permission to resume this subscription");
      return;
    }

    setIsResuming(true);

    const resumeArgs = {
      address: INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
      abi: INVOPAY_SUBSCRIPTION_ABI,
      functionName: "resumeSubscription" as const,
      args: [subscriptionIdBytes32] as const,
    };

    writeResume(resumeArgs);
  };

  // Update database when pause is confirmed
  useEffect(() => {
    if (pauseReceipt && subscription && (pauseReceipt.status === "success" || pauseReceipt.status === 1)) {
      const updateStatus = async () => {
        try {
          await updateSubscription(subscription.id, {
            status: "paused" as any,
            paused_at: new Date().toISOString(),
          });

          if (onPauseSuccess) {
            onPauseSuccess();
          }
        } catch (error) {
          console.error("Failed to update subscription status:", error);
        } finally {
          setIsPausing(false);
        }
      };

      updateStatus();
    }
  }, [pauseReceipt, subscription]);

  // Update database when resume is confirmed
  useEffect(() => {
    if (resumeReceipt && subscription && (resumeReceipt.status === "success" || resumeReceipt.status === 1)) {
      const updateStatus = async () => {
        try {
          await updateSubscription(subscription.id, {
            status: "active" as any,
            paused_at: null,
          });

          if (onPauseSuccess) {
            onPauseSuccess();
          }
        } catch (error) {
          console.error("Failed to update subscription status:", error);
        } finally {
          setIsResuming(false);
        }
      };

      updateStatus();
    }
  }, [resumeReceipt, subscription]);

  return {
    handlePause,
    handleResume,
    isPausing: isPausing || isPausingOnChain || isWaitingForPause,
    isResuming: isResuming || isResumingOnChain || isWaitingForResume,
    canPause,
    canResume,
    pauseError,
    isPauseError,
    pauseReceiptError,
    isPauseReceiptError,
    resumeError,
    isResumeError,
    resumeReceiptError,
    isResumeReceiptError,
    pauseTxHash,
    resumeTxHash,
  };
}
