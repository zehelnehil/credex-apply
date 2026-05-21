"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { AuditResult } from "@/components/audit-result";
import { LeadCapture } from "@/components/lead-capture";
import { aiTools, useCases, type AuditInput, type AuditToolInput, type AuditResult as AuditResultType } from "@/lib/audit/types";

const emptyTool: AuditToolInput = {
  tool: "ChatGPT",
  plan: "Plus",
  monthlySpend: 20,
  seats: 1
};

const defaultInput: AuditInput = {
  teamSize: 8,
  primaryUseCase: "engineering",
  tools: [
    { tool: "ChatGPT", plan: "Team", monthlySpend: 180, seats: 6 },
    { tool: "GitHub Copilot", plan: "Business", monthlySpend: 114, seats: 6 }
  ],
  email: "",
  company: ""
};

type AuditResponse = {
  slug: string;
  input: AuditInput;
  result: AuditResultType;
  summary: string;
};

export function AuditForm() {
  const [input, setInput] = useState<AuditInput>(defaultInput);
  const [response, setResponse] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("credex-audit-input");
    if (saved) {
      setInput(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("credex-audit-input", JSON.stringify(input));
  }, [input]);

  const totalSpend = useMemo(() => input.tools.reduce((sum, tool) => sum + Number(tool.monthlySpend || 0), 0), [input.tools]);

  async function submit() {
    const start = performance.now();
    track("audit_started", { toolsCount: input.tools.length, useCase: input.primaryUseCase });
    setLoading(true);
    setError(null);
    setResponse(null);
    const res = await fetch("/api/audits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      track("audit_failed");
      setError("The audit could not be generated. Check the inputs and try again.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    const duration = performance.now() - start;
    track("audit_completed", { 
      durationMs: Math.round(duration), 
      toolsCount: input.tools.length,
      monthlySavings: data.result.estimatedMonthlySavings 
    });
    setResponse(data);
    setLoading(false);
  }

  function updateTool(index: number, patch: Partial<AuditToolInput>) {
    setInput((current) => ({
      ...current,
      tools: current.tools.map((tool, toolIndex) => toolIndex === index ? { ...tool, ...patch } : tool)
    }));
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-6">
        <div className="rounded-xl border border-line bg-white shadow-sm overflow-hidden">
          <div className="border-b border-line px-6 py-4 flex items-center justify-between bg-mist/50">
            <h3 className="font-semibold text-ink">Organization details</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Current Monthly Spend</span>
              <span className="font-mono text-ink bg-white px-2 py-0.5 rounded border border-line shadow-sm">${totalSpend}</span>
            </div>
          </div>
          <div className="p-6 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Team size</span>
              <Input
                type="number"
                min={1}
                value={input.teamSize}
                onChange={(event) => setInput({ ...input, teamSize: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Primary use case</span>
              <Select
                value={input.primaryUseCase}
                onChange={(event) => setInput({ ...input, primaryUseCase: event.target.value as AuditInput["primaryUseCase"] })}
              >
                {useCases.map((useCase) => (
                  <option key={useCase} value={useCase}>
                    {useCase.charAt(0).toUpperCase() + useCase.slice(1)}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Company</span>
              <Input
                value={input.company}
                onChange={(event) => setInput({ ...input, company: event.target.value })}
                placeholder="Optional"
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white shadow-sm overflow-hidden">
          <div className="border-b border-line px-6 py-4 flex items-center justify-between bg-mist/50">
            <h3 className="font-semibold text-ink">Tool stack inventory</h3>
            <span className="text-xs font-medium text-zinc-500">{input.tools.length} tool{input.tools.length === 1 ? "" : "s"} added</span>
          </div>
          <div className="p-0">
            {input.tools.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center border-b border-line">
                <p className="text-sm font-medium text-zinc-500">No tools added yet.</p>
                <p className="text-xs text-zinc-400 mt-1">Add your subscriptions to calculate savings.</p>
              </div>
            ) : (
              <div className="divide-y divide-line">
                {input.tools.map((tool, index) => (
                <div key={index} className="grid gap-4 p-4 hover:bg-mist/50 transition-colors sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto] xl:items-center">
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-zinc-600">Tool</span>
                    <Select value={tool.tool} onChange={(event) => updateTool(index, { tool: event.target.value as AuditToolInput["tool"] })}>
                      {aiTools.map((name) => <option key={name} value={name}>{name}</option>)}
                    </Select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-zinc-600">Plan</span>
                    <Select value={tool.plan} onChange={(event) => updateTool(index, { plan: event.target.value })}>
                      <option value="Free">Free</option>
                      <option value="Starter">Starter / Individual</option>
                      <option value="Pro">Pro / Plus</option>
                      <option value="Team">Team / Business</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Other">Other</option>
                    </Select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-zinc-600">Monthly spend</span>
                    <Input type="number" min={0} value={tool.monthlySpend} onChange={(event) => updateTool(index, { monthlySpend: Number(event.target.value) })} />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-zinc-600">Seats</span>
                    <Input type="number" min={1} value={tool.seats} onChange={(event) => updateTool(index, { seats: Number(event.target.value) })} />
                  </label>
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded border border-transparent text-zinc-400 hover:bg-white hover:border-line hover:text-red-500 hover:shadow-sm transition-all"
                      aria-label="Remove tool"
                      onClick={() => setInput((current) => {
                        const remaining = current.tools.filter((_, toolIndex) => toolIndex !== index);
                        return { ...current, tools: remaining };
                      })}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
          <div className="border-t border-line bg-mist/50 p-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setInput((current) => ({
                ...current,
                tools: [...current.tools, { ...emptyTool }]
              }))}
            >
              <Plus size={16} />
              Add another tool
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <Button type="button" onClick={submit} disabled={loading || input.tools.length === 0} className="w-full sm:w-auto min-w-[160px]">
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Generate Audit Report
          </Button>
          {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
        </div>
      </section>

      {response ? (
        <>
          <AuditResult result={response.result} input={response.input} slug={response.slug} summary={response.summary} />
          <LeadCapture auditId={response.slug} />
        </>
      ) : null}
    </div>
  );
}
