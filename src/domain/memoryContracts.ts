import type { CognitiveCandidateCategory } from "./cognitiveValidation";

export type MemorySource = "thought" | "cognitive_candidate" | "manual";

export type MemoryCategory = CognitiveCandidateCategory | "general";

export type MemoryStatus = "candidate" | "active" | "archived";

export type MemoryOrigin = {
  source: MemorySource;
  sourceId?: string;
};

export type MemoryReviewState = "unreviewed" | "accepted" | "rejected";

export type MemoryMetadata = {
  schemaVersion: 1;
};

export type MemoryRecord = {
  id: string;
  category: MemoryCategory;
  observedText: string;
  inferredMeaning?: string;
  confidence: "medium" | "high" | null;
  createdAt: string;
  status: MemoryStatus;
  origin: MemoryOrigin;
  reviewState: MemoryReviewState;
  metadata: MemoryMetadata;
};

