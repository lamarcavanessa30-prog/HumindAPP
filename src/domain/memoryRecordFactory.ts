import type {
  MemoryCategory,
  MemoryOrigin,
  MemoryRecord,
  MemoryReviewState,
  MemorySource,
  MemoryStatus,
} from "./memoryContracts";
import type { MemoryEligibilityResult } from "./memoryEligibility";
import type { MemoryIntakeDraft } from "./memoryIntakeDraft";

export type MemoryRecordDraft = Omit<MemoryRecord, "category" | "createdAt" | "metadata"> & {
  source: MemorySource;
  category: MemoryCategory;
  createdAt: null;
  updatedAt: null;
  metadata: null;
};

export type SkippedMemoryRecordDraftReason = "ineligible_draft";
export type MalformedMemoryRecordDraftReason = "malformed_eligible_draft";

export type SkippedMemoryRecordDraft = {
  draft: unknown;
  reason: SkippedMemoryRecordDraftReason | MalformedMemoryRecordDraftReason;
};

export type MemoryRecordFactoryResult = {
  records: MemoryRecordDraft[];
  skipped: SkippedMemoryRecordDraft[];
};

const MEMORY_RECORD_STATUS: MemoryStatus = "candidate";
const MEMORY_RECORD_REVIEW_STATE: MemoryReviewState = "unreviewed";
const MEMORY_RECORD_SOURCE: MemorySource = "cognitive_candidate";

function isMemoryIntakeDraft(draft: unknown): draft is MemoryIntakeDraft {
  if (!draft || typeof draft !== "object") return false;

  const value = draft as Partial<MemoryIntakeDraft>;
  return (
    !!value.candidate &&
    typeof value.candidate === "object" &&
    typeof value.candidate.id === "string" &&
    value.candidate.source === "cognitive_validation" &&
    typeof value.candidate.category === "string" &&
    typeof value.candidate.observedText === "string" &&
    (value.candidate.confidence === "medium" ||
      value.candidate.confidence === "high" ||
      value.candidate.confidence === null) &&
    value.candidate.status === "candidate" &&
    value.status === "draft"
  );
}

function createMemoryRecordId(draft: MemoryIntakeDraft) {
  return `memory_record_${draft.candidate.id}`;
}

function createMemoryRecordOrigin(draft: MemoryIntakeDraft): MemoryOrigin {
  return {
    source: "cognitive_candidate",
    sourceId: draft.candidate.id,
  };
}

function createMemoryRecord(draft: MemoryIntakeDraft): MemoryRecordDraft {
  return {
    id: createMemoryRecordId(draft),
    source: MEMORY_RECORD_SOURCE,
    category: draft.candidate.category,
    observedText: draft.candidate.observedText,
    ...(draft.candidate.inferredMeaning
      ? { inferredMeaning: draft.candidate.inferredMeaning }
      : {}),
    confidence: draft.candidate.confidence,
    status: MEMORY_RECORD_STATUS,
    origin: createMemoryRecordOrigin(draft),
    reviewState: MEMORY_RECORD_REVIEW_STATE,
    createdAt: null,
    updatedAt: null,
    metadata: null,
  };
}

export function createMemoryRecords(
  eligibility: MemoryEligibilityResult,
): MemoryRecordFactoryResult {
  const records: MemoryRecordDraft[] = [];
  const skipped: SkippedMemoryRecordDraft[] = eligibility.ineligible.map(({ draft }) => ({
    draft,
    reason: "ineligible_draft",
  }));

  eligibility.eligible.forEach((draft) => {
    if (!isMemoryIntakeDraft(draft)) {
      skipped.push({ draft, reason: "malformed_eligible_draft" });
      return;
    }

    records.push(createMemoryRecord(draft));
  });

  return {
    records,
    skipped,
  };
}
