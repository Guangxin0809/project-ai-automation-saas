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
import { generateGoogleFormScript } from "./utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {

  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = 
    `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  const [webhookUrlCopied, setWebhookUrlCopied] = useState(false);
  const [googleFormScriptCopied, setGoogleFormScriptCopied] = useState(false);

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

  const handleCopyGoogleAppScript = async () => {
    try {
      if (googleFormScriptCopied) return;
      
      const script = await generateGoogleFormScript(webhookUrl);
      await navigator.clipboard.writeText(script);
      setGoogleFormScriptCopied(true);
      toast.success("Script copied to clipboard");
    } catch (error) {
      console.error("Failed to copy script: ", error);
      toast.error("Failed to copy script");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form&apos;s Apps Script to trigger this workflow when a form is submitted.
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
              <li>Open your Google Form</li>
              <li>Click the three dots menu &rarr; Apps Script &raar; editor</li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL with your webhook URL above</li>
              <li>Save and click &ldquo;Triggers&rdquo; &rarr; Add trigger</li>
              <li>Choose: From form &rarr; On form submit &rarr; Save</li>
            </ol>
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-muted">
          <h4 className="font-medium text-sm">Google Apps Script:</h4>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyGoogleAppScript}
          >
            {
              googleFormScriptCopied
                ? <CopyCheckIcon className="size-4 mr-2 text-green-500" />
                : <CopyIcon className="size-4 mr-2" />
            }
            Copy Google Apps Script
          </Button>
          <p className="text-xs text-muted-foreground">
            This script includes your webhook URL and handles form submissions.
          </p>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-muted">
          <h4 className="font-medium text-sm">Available Variables</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <code className="px-1 py-0.5 rounded bg-background">
                {"{{googlrForm.respondentEmail}}"}
              </code>
              - Respondent&apos;s email
            </li>
            <li>
              <code className="px-1 py-0.5 rounded bg-background">
                {"{{googlrForm.responses['Question Name']}}"}
              </code>
              - Specific answer
            </li>
            <li>
              <code className="px-1 py-0.5 rounded bg-background">
                {"{{json googleForm.responses}}"}
              </code>
              - All responses as JSON
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}