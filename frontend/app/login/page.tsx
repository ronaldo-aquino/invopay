"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Shield, Zap } from "lucide-react";

export default function LoginPage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      router.replace("/invoices");
    } else {
      setIsChecking(false);
    }
  }, [isConnected, address, router]);

  if (isConnected && address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Redirecting to invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Connect Your Wallet</CardTitle>
              <CardDescription className="text-base">
                Connect your Web3 wallet to start creating and managing invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div className="flex justify-center">
                <ConnectButton />
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    Make sure your wallet is connected to{" "}
                    <strong className="text-foreground">Arc Testnet</strong> to use this
                    application.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p>Supported wallets: MetaMask, WalletConnect, and other Web3 wallets.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
