"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CopyCheckIcon, CopyIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {

  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = 
    `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const [webhookUrlCopied, setWebhookUrlCopied] = useState(false);

  useEffect(() => {
    if (!webhookUrlCopied) return;

    const timer = setTimeout(() => {
      setWebhookUrlCopied(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [webhookUrlCopied])

  const handleCopyWebhookUrl = async () => {
    try {
      if (webhookUrlCopied) return;
      await navigator.clipboard.writeText(webhookUrl);
      setWebhookUrlCopied(true);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      console.error("Failed to copy webhook URL: ", error);
      toast.error("Failed to copy webhook URL");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Stripe Dashboard to trigger this workflow on payment events.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhoook URL</Label>
            <div className="flex gap-x-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />

              <Button
                size="icon"
                type="button"
                variant="outline"
                onClick={handleCopyWebhookUrl}
              >
                {
                  webhookUrlCopied
                    ? <CopyCheckIcon className="size-4 text-green-500" />
                    : <CopyIcon size={16} />
                }
              </Button>
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-lg bg-muted">
            <h4 className="font-medium text-sm">Setup instructions:</h4>
            <ol className="space-y-1 list-decimal list-inside text-sm text-muted-foreground">
              <li>Open your Stripe Dashboard</li>
              <li>Go to Developers &rarr; Webhooks</li>
              <li>Click &apos;Add endpoint&apos;</li>
              <li>Paste the webhook URL above</li>
              <li>Select events to listen for (e.g., payment_intent.succeeded)</li>
              <li>Save and copy the signing secret</li>
            </ol>
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-muted">
          <h4 className="font-medium text-sm">Available Variables</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <code className="px-1 py-0.5 rounded bg-background">
                {"{{stripe.amount}}"}
              </code>
              - Payment amount
            </li>
            <li>
              <code className="px-1 py-0.5 rounded bg-background">
                {"{{stripe.currency}}"}
              </code>
              - Currency code
            </li>
            <li>
              <code className="px-1 py-0.5 rounded bg-background">
                {"{{stripe.customerId}}"}
              </code>
              - Customer ID
            </li>
            <li>
              <code className="px-1 py-0.5 rounded bg-background">
                {"{{json stripe}}"}
              </code>
              - Full event data as JSON
            </li>
            <li>
              <code className="px-1 py-0.5 rounded bg-background">
                {"{{stripe.eventType}}"}
              </code>
              - Event type (e.g., payment_intent.succeeded)
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}