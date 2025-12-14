import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Wallet, BarChart3, Shield, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Powered by Arc Testnet
            </div>
            <h1 className="pb-[20px] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Invopay
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A powerful invoice creation and management platform that enables seamless payments in
              USDC and EURC stablecoins on the Arc Testnet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                  Connect Wallet
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Create Invoices</CardTitle>
                <CardDescription className="text-base">
                  Easily create invoices with custom amounts and currency selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate professional invoices in seconds. Choose between USDC or EURC and set
                  your desired payment amount with detailed descriptions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Web3 Payments</CardTitle>
                <CardDescription className="text-base">
                  Accept payments directly through blockchain transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Receive payments in stablecoins on Arc Testnet. Desktop and mobile wallet support
                  with QR code payments for seamless transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Manage Everything</CardTitle>
                <CardDescription className="text-base">
                  Track all your invoices from a centralized dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  View payment status, transaction history, and manage all your invoices in one
                  place with real-time updates.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 border-t">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Invopay?</h2>
              <p className="text-muted-foreground text-lg">
                Built for the future of decentralized payments
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-6 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and process invoices in seconds with instant blockchain confirmation.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure & Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    All transactions are recorded on-chain with full transparency and immutability.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Global Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Accept payments in USDC and EURC from anywhere in the world, 24/7.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Low Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Only 0.05% platform fee per invoice, making it cost-effective for businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
