"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

import { track } from "@vercel/analytics";

export function LeadCapture({ auditId }: { auditId?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("loading");
    track("lead_capture_started");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        auditId,
        email: formData.get("email"),
        company: formData.get("company"),
        role: formData.get("role"),
        intent: formData.get("intent")
      })
    });

    if (response.ok) {
      setStatus("sent");
      track("lead_capture_completed", { hasIntent: !!formData.get("intent") });
    } else {
      setStatus("error");
      track("lead_capture_failed");
    }
  }

  return (
    <form action={submit} className="rounded-xl border border-line bg-mist p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Credex follow-up</p>
      <h3 className="mt-2 text-xl font-semibold text-ink tracking-tight">Turn this into a renewal plan</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">
        Share the audit context and Credex can help prioritize vendor cuts, seat cleanup, and renewal timing.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input name="email" type="email" required placeholder="Work Email" />
        <Input name="company" placeholder="Company" />
        <Input name="role" placeholder="Role" />
        <Textarea name="intent" placeholder="What renewal or tool decision is coming up?" className="sm:col-span-2" />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "loading" || status === "sent"}>
          {status === "sent" ? "Request sent" : "Request review"}
        </Button>
        {status === "error" ? <p className="text-sm text-red-500 font-medium">Something failed. Please try again.</p> : null}
        {status === "sent" ? <p className="text-sm font-medium text-ink">Thanks. Your audit context was captured.</p> : null}
      </div>
    </form>
  );
}
