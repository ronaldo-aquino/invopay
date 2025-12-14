import { useReadContract } from "wagmi";
import { getBalanceArgs } from "@backend/lib/services/token.service";

export function useTokenBalance(address: string | undefined, tokenAddress: string | undefined) {
  const balanceArgs =
    address && tokenAddress
      ? getBalanceArgs(tokenAddress as `0x${string}`, address as `0x${string}`)
      : undefined;

  const {
    data: balance,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useReadContract({
    ...balanceArgs,
    query: {
      enabled: !!address && !!tokenAddress,
      staleTime: 0,
      gcTime: 0,
    },
  });

  return {
    balance,
    isLoadingBalance,
    balanceError,
  };
}
