import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card className="border-2">
      <CardContent className="pt-6 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading invoices...</p>
      </CardContent>
    </Card>
  );
}

