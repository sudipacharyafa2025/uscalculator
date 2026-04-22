import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  /** Returns the full shareable URL. The hook should already copy it to the clipboard. */
  onShare: () => Promise<string>;
  label?: string;
  size?: "sm" | "default";
}

/**
 * Tiny share-link button used by Mortgage / Loan Comparison / Retirement.
 * Provides instant visual feedback and a toast confirmation.
 */
export default function ShareScenario({ onShare, label = "Share scenario", size = "sm" }: Props) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      size={size}
      variant="outline"
      onClick={async () => {
        const link = await onShare();
        setCopied(true);
        toast.success("Scenario link copied", {
          description: link.length > 60 ? link.slice(0, 60) + "…" : link,
        });
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Share2 className="h-4 w-4 mr-1.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}
