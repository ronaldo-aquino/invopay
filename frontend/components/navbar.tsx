"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";
import { INVOPAY_CONTRACT_ADDRESS } from "@/lib/constants";
import { INVOPAY_ABI } from "@/lib/contract-abi";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { isConnected, address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: contractOwner } = useReadContract({
    address: INVOPAY_CONTRACT_ADDRESS as `0x${string}`,
    abi: INVOPAY_ABI,
    functionName: "owner",
    query: {
      enabled: !!INVOPAY_CONTRACT_ADDRESS && isConnected,
    },
  });

  useEffect(() => {
    if (contractOwner && address) {
      const ownerAddress = contractOwner as `0x${string}`;
      setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());
    }
  }, [contractOwner, address]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold">
            Invopay
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            {isConnected && (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}
            {isOwner && (
              <Link href="/owner-dashboard">
                <Button variant="ghost">Owner Dashboard</Button>
              </Link>
            )}
            <ThemeToggle />
            <ConnectButton chainStatus="none" />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/60 pt-4 space-y-3">
            {isConnected && (
              <Link href="/dashboard" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
            )}
            {isOwner && (
              <Link href="/owner-dashboard" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  Owner Dashboard
                </Button>
              </Link>
            )}
            <div className="pt-2">
              <ConnectButton chainStatus="none" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
