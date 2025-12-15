import { useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { INVOPAY_CONTRACT_ADDRESS, INVOPAY_SUBSCRIPTION_CONTRACT_ADDRESS } from "@/lib/constants";
import { getAllowanceArgs, needsApproval, getApproveArgs } from "@backend/lib/services/token.service";

export function useTokenAllowance(
  address: string | undefined,
  tokenAddress: string | undefined,
  feeAmountInWei: bigint | undefined,
  contractAddress?: string | undefined
) {
  const targetContractAddress = contractAddress || INVOPAY_CONTRACT_ADDRESS;
  
  const allowanceArgs =
    address && targetContractAddress && tokenAddress
      ? getAllowanceArgs({
          tokenAddress: tokenAddress as `0x${string}`,
          owner: address as `0x${string}`,
          spender: targetContractAddress as `0x${string}`,
        })
      : undefined;

  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: isLoadingAllowance,
    error: allowanceError,
    isSuccess: isAllowanceSuccess,
  } = useReadContract({
    ...allowanceArgs,
    query: {
      enabled: !!address && !!targetContractAddress && !!tokenAddress && !!feeAmountInWei,
      retry: 2,
      staleTime: 0,
      gcTime: 0,
    },
  });

  const {
    writeContract: writeApproval,
    data: approvalTxHash,
    isPending: isApproving,
  } = useWriteContract();

  const { isLoading: isApprovalConfirming, data: approvalReceipt } = useWaitForTransactionReceipt({
    hash: approvalTxHash,
  });

  useEffect(() => {
    if (approvalReceipt) {
      refetchAllowance();
    }
  }, [approvalReceipt, refetchAllowance]);

  const needsApprovalCheck = feeAmountInWei
    ? needsApproval(allowance as bigint | undefined, feeAmountInWei)
    : true;

  const handleApprove = () => {
    if (!tokenAddress || !feeAmountInWei || !targetContractAddress) return;

    const approveArgs = getApproveArgs({
      tokenAddress: tokenAddress as `0x${string}`,
      amount: feeAmountInWei,
      spender: targetContractAddress as `0x${string}`,
    });

    writeApproval(approveArgs);
  };

  return {
    allowance,
    needsApproval: needsApprovalCheck,
    isLoadingAllowance,
    allowanceError,
    isAllowanceSuccess,
    handleApprove,
    isApproving,
    isApprovalConfirming,
    refetchAllowance,
  };
}
