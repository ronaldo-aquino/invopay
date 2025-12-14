import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { formatUnits, parseAbiItem } from "viem";
import {
  INVOPAY_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  EURC_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { INVOPAY_ABI } from "@/lib/contract-abi";
import { getWithdrawFeesArgs } from "@backend/lib/services/invoice.service";

export function useOwnerDashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const publicClient = usePublicClient();
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [usdcFees, setUsdcFees] = useState<string>("0");
  const [eurcFees, setEurcFees] = useState<string>("0");
  const [usdcWithdrawn, setUsdcWithdrawn] = useState<string>("0");
  const [eurcWithdrawn, setEurcWithdrawn] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [loadingUsdcWithdrawn, setLoadingUsdcWithdrawn] = useState(false);
  const [loadingEurcWithdrawn, setLoadingEurcWithdrawn] = useState(false);

  const { data: contractOwner } = useReadContract({
    address: INVOPAY_CONTRACT_ADDRESS as `0x${string}`,
    abi: INVOPAY_ABI,
    functionName: "owner",
    query: {
      enabled: !!INVOPAY_CONTRACT_ADDRESS && isConnected,
    },
  });

  const {
    data: usdcFeesRaw,
    refetch: refetchUsdcFees,
    isLoading: isLoadingUsdcFees,
  } = useReadContract({
    address: INVOPAY_CONTRACT_ADDRESS as `0x${string}`,
    abi: INVOPAY_ABI,
    functionName: "getAccumulatedFees",
    args: [USDC_CONTRACT_ADDRESS as `0x${string}`],
    query: {
      enabled: !!INVOPAY_CONTRACT_ADDRESS && isConnected && isOwner === true,
      refetchInterval: 30000,
    },
  });

  const {
    data: eurcFeesRaw,
    refetch: refetchEurcFees,
    isLoading: isLoadingEurcFees,
  } = useReadContract({
    address: INVOPAY_CONTRACT_ADDRESS as `0x${string}`,
    abi: INVOPAY_ABI,
    functionName: "getAccumulatedFees",
    args: [EURC_CONTRACT_ADDRESS as `0x${string}`],
    query: {
      enabled: !!INVOPAY_CONTRACT_ADDRESS && isConnected && isOwner === true,
      refetchInterval: 30000,
    },
  });

  const {
    writeContract: writeWithdrawUsdc,
    data: withdrawUsdcHash,
    isPending: isWithdrawingUsdc,
  } = useWriteContract();

  const {
    writeContract: writeWithdrawEurc,
    data: withdrawEurcHash,
    isPending: isWithdrawingEurc,
  } = useWriteContract();

  const { isLoading: isUsdcConfirming } = useWaitForTransactionReceipt({
    hash: withdrawUsdcHash,
  });

  const { isLoading: isEurcConfirming } = useWaitForTransactionReceipt({
    hash: withdrawEurcHash,
  });

  const refetchWithdrawnFeesForToken = useCallback(
    async (
      tokenAddress: string,
      setLoading: (loading: boolean) => void,
      setValue: (value: string) => void
    ) => {
      if (!publicClient || !INVOPAY_CONTRACT_ADDRESS) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const eventAbi = parseAbiItem(
          "event FeesWithdrawn(address indexed tokenAddress, uint256 amount, address indexed recipient)"
        );

        const currentBlock = await publicClient.getBlockNumber();
        const tokenAddressLower = tokenAddress.toLowerCase();
        let totalWithdrawn = 0n;

        let deployBlock = 0n;
        try {
          const deployTxHash = "0x22eb895bda5d538c59ea1264347cbf84097e0061d3d5d60b72b760b15aacc648";
          const tx = await publicClient.getTransactionReceipt({
            hash: deployTxHash as `0x${string}`,
          });
          if (tx && tx.blockNumber) {
            deployBlock = tx.blockNumber;
          }
        } catch (e) {
          deployBlock = 0n;
        }

        const chunkSize = 10000n;
        let fromBlock = deployBlock;
        let toBlock = currentBlock;

        while (toBlock >= fromBlock) {
          const chunkFrom = toBlock > chunkSize ? toBlock - chunkSize + 1n : fromBlock;
          const chunkTo = toBlock;

          try {
            const logs = await publicClient.getLogs({
              address: INVOPAY_CONTRACT_ADDRESS as `0x${string}`,
              event: eventAbi,
              fromBlock: chunkFrom,
              toBlock: chunkTo,
            });

            for (const log of logs) {
              if (log.args?.tokenAddress && log.args?.amount) {
                const logToken = String(log.args.tokenAddress).toLowerCase();
                if (logToken === tokenAddressLower) {
                  totalWithdrawn += BigInt(log.args.amount);
                }
              }
            }

            toBlock = chunkFrom > fromBlock ? chunkFrom - 1n : fromBlock - 1n;
            if (toBlock < fromBlock) break;

            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error: any) {
            const errorMessage = String(error?.message || "");
            if (
              errorMessage.includes("413") ||
              errorMessage.includes("10,000") ||
              errorMessage.includes("Content Too Large") ||
              errorMessage.includes("429")
            ) {
              toBlock = chunkFrom > fromBlock ? chunkFrom - 1n : fromBlock - 1n;
              await new Promise((resolve) => setTimeout(resolve, 1000));
              continue;
            }
            toBlock = chunkFrom > fromBlock ? chunkFrom - 1n : fromBlock - 1n;
            if (toBlock < fromBlock) break;
          }
        }

        const formatted = formatUnits(totalWithdrawn, 6);
        setValue(formatted);
      } catch (error: any) {
        setValue("0");
      } finally {
        setLoading(false);
      }
    },
    [publicClient]
  );

  const refetchWithdrawnFees = useCallback(async () => {
    await Promise.all([
      refetchWithdrawnFeesForToken(
        USDC_CONTRACT_ADDRESS,
        setLoadingUsdcWithdrawn,
        setUsdcWithdrawn
      ),
      refetchWithdrawnFeesForToken(
        EURC_CONTRACT_ADDRESS,
        setLoadingEurcWithdrawn,
        setEurcWithdrawn
      ),
    ]);
  }, [refetchWithdrawnFeesForToken]);

  const refetchUsdcWithdrawn = useCallback(async () => {
    await refetchWithdrawnFeesForToken(
      USDC_CONTRACT_ADDRESS,
      setLoadingUsdcWithdrawn,
      setUsdcWithdrawn
    );
  }, [refetchWithdrawnFeesForToken]);

  const refetchEurcWithdrawn = useCallback(async () => {
    await refetchWithdrawnFeesForToken(
      EURC_CONTRACT_ADDRESS,
      setLoadingEurcWithdrawn,
      setEurcWithdrawn
    );
  }, [refetchWithdrawnFeesForToken]);

  useEffect(() => {
    if (!isConnected || !address) {
      router.push("/login");
      return;
    }

    if (contractOwner && address) {
      const ownerAddress = contractOwner as `0x${string}`;
      const isOwnerCheck = ownerAddress.toLowerCase() === address.toLowerCase();
      setIsOwner(isOwnerCheck);

      if (!isOwnerCheck) {
        router.push("/dashboard");
      }
    }
  }, [contractOwner, address, isConnected, router]);

  useEffect(() => {
    if (usdcFeesRaw !== undefined && usdcFeesRaw !== null) {
      if (typeof usdcFeesRaw === "bigint") {
        const formatted = formatUnits(usdcFeesRaw, 6);
        setUsdcFees(formatted);
      } else {
        setUsdcFees("0");
      }
    } else if (!isLoadingUsdcFees && isOwner === true) {
      setUsdcFees("0");
    }
  }, [usdcFeesRaw, isLoadingUsdcFees, isOwner]);

  useEffect(() => {
    if (eurcFeesRaw !== undefined && eurcFeesRaw !== null) {
      if (typeof eurcFeesRaw === "bigint") {
        const formatted = formatUnits(eurcFeesRaw, 6);
        setEurcFees(formatted);
      } else {
        setEurcFees("0");
      }
    } else if (!isLoadingEurcFees && isOwner === true) {
      setEurcFees("0");
    }
  }, [eurcFeesRaw, isLoadingEurcFees, isOwner]);

  useEffect(() => {
    if (isOwner !== null) {
      setLoading(false);
    }
  }, [isOwner]);

  useEffect(() => {
    if (!isOwner || !publicClient || !INVOPAY_CONTRACT_ADDRESS) {
      return;
    }
    refetchWithdrawnFees();
  }, [isOwner, publicClient, refetchWithdrawnFees]);

  useEffect(() => {
    if (withdrawUsdcHash && !isUsdcConfirming) {
      refetchUsdcFees();
      setTimeout(() => {
        refetchWithdrawnFees();
      }, 2000);
    }
  }, [withdrawUsdcHash, isUsdcConfirming, refetchUsdcFees, refetchWithdrawnFees]);

  useEffect(() => {
    if (withdrawEurcHash && !isEurcConfirming) {
      refetchEurcFees();
      setTimeout(() => {
        refetchWithdrawnFees();
      }, 2000);
    }
  }, [withdrawEurcHash, isEurcConfirming, refetchEurcFees, refetchWithdrawnFees]);

  useEffect(() => {
    if (isOwner === true) {
      refetchUsdcFees();
      refetchEurcFees();

      const interval = setInterval(() => {
        refetchUsdcFees();
        refetchEurcFees();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isOwner, refetchUsdcFees, refetchEurcFees]);

  const handleWithdrawUsdc = () => {
    if (!address || !INVOPAY_CONTRACT_ADDRESS) return;

    const withdrawArgs = getWithdrawFeesArgs(
      USDC_CONTRACT_ADDRESS as `0x${string}`,
      address as `0x${string}`
    ) as unknown as {
      address: `0x${string}`;
      abi: typeof INVOPAY_ABI;
      functionName: "withdrawFees";
      args: readonly [`0x${string}`, `0x${string}`];
    };

    writeWithdrawUsdc(withdrawArgs);
  };

  const handleWithdrawEurc = () => {
    if (!address || !INVOPAY_CONTRACT_ADDRESS) return;

    const withdrawArgs = getWithdrawFeesArgs(
      EURC_CONTRACT_ADDRESS as `0x${string}`,
      address as `0x${string}`
    ) as unknown as {
      address: `0x${string}`;
      abi: typeof INVOPAY_ABI;
      functionName: "withdrawFees";
      args: readonly [`0x${string}`, `0x${string}`];
    };

    writeWithdrawEurc(withdrawArgs);
  };

  return {
    isOwner,
    usdcFees,
    eurcFees,
    usdcWithdrawn,
    eurcWithdrawn,
    loading,
    loadingUsdcWithdrawn,
    loadingEurcWithdrawn,
    contractOwner,
    isWithdrawingUsdc,
    isUsdcConfirming,
    isWithdrawingEurc,
    isEurcConfirming,
    handleWithdrawUsdc,
    handleWithdrawEurc,
    refetchUsdcWithdrawn,
    refetchEurcWithdrawn,
  };
}
