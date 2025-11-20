"use client";

import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import buenoTokenAbi from "../../../../../artifacts/BuenoToken.json";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_BUENO_TOKEN_ADDRESS as `0x${string}`;

export function TokenBalance() {
  const { address, isConnected } = useAccount();

  const { data: balance, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: buenoTokenAbi.abi as any,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const { data: tokenName } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: buenoTokenAbi.abi as any,
    functionName: "name",
  });

  const { data: tokenSymbol } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: buenoTokenAbi.abi as any,
    functionName: "symbol",
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full">
        <div className="card bg-celo-dk-tan border-2 border-celo-outline flex-1 flex flex-col">
          <div className="card-body p-8 flex flex-col justify-between">
            <h3 className="font-inter text-2xl font-bold tracking-tight mb-6">
              TOKEN BALANCE
            </h3>
            <div className="alert alert-info p-6">
              <span className="font-inter text-body-m">
                Please connect your wallet to view your token balance
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="card bg-celo-dk-tan border-2 border-celo-outline flex-1 flex flex-col">
        <div className="card-body p-8 flex flex-col justify-between">
          <h3 className="font-inter text-2xl font-bold tracking-tight mb-6">
            TOKEN BALANCE
          </h3>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <span className="loading loading-spinner loading-lg text-celo-purple"></span>
            </div>
          ) : (
            <div className="flex flex-col space-y-8">
              {/* Large Balance Display */}
              <div className="bg-celo-yellow border-2 border-celo-black p-8">
                <div className="flex flex-col">
                  <p className="font-inter text-label uppercase mb-2">
                    {(tokenName as string) || "BuenoToken"}
                  </p>
                  <p className="font-alpina text-6xl text-celo-black leading-tight">
                    {balance
                      ? parseFloat(formatEther(balance as bigint)).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          }
                        )
                      : "0.00"}
                  </p>
                  <p className="font-inter text-body-m mt-2">
                    {(tokenSymbol as string) || "BTK"}
                  </p>
                </div>
              </div>

              {/* Address Display */}
              <div className="bg-celo-lt-tan border-2 border-celo-outline p-6">
                <p className="font-inter text-label uppercase mb-2">YOUR ADDRESS</p>
                <p className="font-mono text-body-s text-celo-body-copy break-all">
                  {address}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}