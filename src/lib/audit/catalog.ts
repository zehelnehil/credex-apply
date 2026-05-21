export type ToolBenchmark = {
  canonical: string;
  category: "assistant" | "coding" | "research" | "writing" | "design" | "productivity";
  starterMonthlyPerSeat: number;
  teamMonthlyPerSeat: number;
  enterpriseThresholdSeats: number;
  notes: string;
};

export const toolBenchmarks: Record<string, ToolBenchmark> = {
  ChatGPT: {
    canonical: "ChatGPT",
    category: "assistant",
    starterMonthlyPerSeat: 20,
    teamMonthlyPerSeat: 30,
    enterpriseThresholdSeats: 50,
    notes: "Plus is usually sufficient for individual contributors; Team is easier to justify when shared workspace controls matter."
  },
  Claude: {
    canonical: "Claude",
    category: "assistant",
    starterMonthlyPerSeat: 20,
    teamMonthlyPerSeat: 25,
    enterpriseThresholdSeats: 50,
    notes: "Comparable seat economics to ChatGPT for general knowledge work."
  },
  "GitHub Copilot": {
    canonical: "GitHub Copilot",
    category: "coding",
    starterMonthlyPerSeat: 10,
    teamMonthlyPerSeat: 19,
    enterpriseThresholdSeats: 50,
    notes: "Strong ROI for engineers; overspend usually comes from non-engineering seats."
  },
  Cursor: {
    canonical: "Cursor",
    category: "coding",
    starterMonthlyPerSeat: 20,
    teamMonthlyPerSeat: 40,
    enterpriseThresholdSeats: 35,
    notes: "Best fit for active coding users; duplicative with Copilot for some teams."
  },
  "Anthropic API direct": {
    canonical: "Anthropic API direct",
    category: "assistant",
    starterMonthlyPerSeat: 10,
    teamMonthlyPerSeat: 10,
    enterpriseThresholdSeats: 500,
    notes: "API access is billed on usage, not seats. Highly cost-effective for technical teams building internal tools."
  },
  "OpenAI API direct": {
    canonical: "OpenAI API direct",
    category: "assistant",
    starterMonthlyPerSeat: 10,
    teamMonthlyPerSeat: 10,
    enterpriseThresholdSeats: 500,
    notes: "API access is billed on usage. Often 80% cheaper than ChatGPT Enterprise for developers."
  },
  Gemini: {
    canonical: "Gemini",
    category: "assistant",
    starterMonthlyPerSeat: 0,
    teamMonthlyPerSeat: 0,
    enterpriseThresholdSeats: 50,
    notes: "Gemini AI is now bundled directly into Google Workspace Business and Enterprise plans at no extra cost. Individual Google One plans are $20."
  },
  Windsurf: {
    canonical: "Windsurf",
    category: "coding",
    starterMonthlyPerSeat: 20,
    teamMonthlyPerSeat: 40,
    enterpriseThresholdSeats: 50,
    notes: "Emerging coding assistant. Now quota-based instead of credit-based. Assess overlap with Copilot or Cursor."
  },
  Other: {
    canonical: "Other",
    category: "assistant",
    starterMonthlyPerSeat: 20,
    teamMonthlyPerSeat: 35,
    enterpriseThresholdSeats: 50,
    notes: "Generic benchmark used when the tool is not in the supported catalog."
  }
};

export const useCaseWeights = {
  engineering: { coding: 1.25, assistant: 1, research: 0.8, writing: 0.55, design: 0.55, productivity: 0.8 },
  sales: { coding: 0.25, assistant: 1, research: 0.9, writing: 0.9, design: 0.45, productivity: 0.9 },
  marketing: { coding: 0.15, assistant: 1, research: 1, writing: 1.2, design: 1, productivity: 0.8 },
  support: { coding: 0.25, assistant: 1.1, research: 0.8, writing: 0.7, design: 0.25, productivity: 0.9 },
  operations: { coding: 0.2, assistant: 1, research: 0.8, writing: 0.6, design: 0.2, productivity: 1 },
  mixed: { coding: 0.8, assistant: 1, research: 0.85, writing: 0.8, design: 0.6, productivity: 0.85 }
} as const;
