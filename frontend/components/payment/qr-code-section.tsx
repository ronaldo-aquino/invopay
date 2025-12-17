import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";

interface QRCodeSectionProps {
  qrCodeValue: string;
  copied: boolean;
  onCopy: () => void;
}

export function QRCodeSection({ qrCodeValue, copied, onCopy }: QRCodeSectionProps) {
  return (
    <div className="hidden md:flex flex-col items-center justify-center space-y-5">
      <div className="p-6 bg-background border-2 rounded-2xl shadow-lg">
        <QRCodeSVG value={qrCodeValue} size={220} />
      </div>
      <p className="text-sm text-muted-foreground text-center font-medium">
        Scan this page with your mobile device to access the payment page
      </p>
      <Button variant="outline" size="lg" onClick={onCopy} className="w-full">
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy Payment Link
          </>
        )}
      </Button>
    </div>
  );
}
