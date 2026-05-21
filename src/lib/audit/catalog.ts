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
    teamMonthlyPerSeat: 30,
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
  Perplexity: {
    canonical: "Perplexity",
    category: "research",
    starterMonthlyPerSeat: 20,
    teamMonthlyPerSeat: 40,
    enterpriseThresholdSeats: 50,
    notes: "Useful for research-heavy teams; often redundant for low-research workflows."
  },
  "Notion AI": {
    canonical: "Notion AI",
    category: "productivity",
    starterMonthlyPerSeat: 10,
    teamMonthlyPerSeat: 10,
    enterpriseThresholdSeats: 100,
    notes: "Works best when most company knowledge already lives in Notion."
  },
  Jasper: {
    canonical: "Jasper",
    category: "writing",
    starterMonthlyPerSeat: 49,
    teamMonthlyPerSeat: 69,
    enterpriseThresholdSeats: 25,
    notes: "Harder to justify for teams without a dedicated content workflow."
  },
  Midjourney: {
    canonical: "Midjourney",
    category: "design",
    starterMonthlyPerSeat: 10,
    teamMonthlyPerSeat: 30,
    enterpriseThresholdSeats: 20,
    notes: "Best for frequent visual generation; occasional use can stay on lower tiers."
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
