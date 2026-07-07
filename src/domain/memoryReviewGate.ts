import type { MemoryCandidate, MemoryCandidateResult } from "./memoryCandidates";
import type { MemoryCategory } from "./memoryContracts";

export type MemoryReviewSkipReason =
  | "empty_observed_text"
  | "missing_confidence"
  | "unsupported_category"
  | "malformed_candidate";

export type SkippedMemoryReviewCandidate = {
  candidate: unknown;
  reason: MemoryReviewSkipReason;
};

export type MemoryReviewGateResult = {
  readyForReview: MemoryCandidate[];
  skipped: SkippedMemoryReviewCandidate[];
};

const SUPPORTED_MEMORY_CATEGORIES: MemoryCategory[] = [
  "events",
  "goals",
  "preferences",
  "relationships",
  "recurringThemes",
  "uncertaintyMarkers",
  "safetyMarkers",
];

function isSupportedCategory(category: MemoryCategory) {
  return SUPPORTED_MEMORY_CATEGORIES.includes(category);
}

function isMemoryCandidate(candidate: unknown): candidate is MemoryCandidate {
  if (!candidate || typeof candidate !== "object") return false;

  const value = candidate as Partial<MemoryCandidate>;
  return (
    typeof value.id === "string" &&
    value.source === "cognitive_validation" &&
    typeof value.category === "string" &&
    typeof value.observedText === "string" &&
    value.status === "candidate"
  );
}

function validateReviewCandidate(candidate: unknown): MemoryCandidate | MemoryReviewSkipReason {
  if (!isMemoryCandidate(candidate)) return "malformed_candidate";
  if (!candidate.observedText.trim()) return "empty_observed_text";
  if (!candidate.confidence) return "missing_confidence";
  if (!isSupportedCategory(candidate.category)) return "unsupported_category";

  return candidate;
}

export function prepareMemoryReviewGate(candidates: MemoryCandidateResult): MemoryReviewGateResult {
  const readyForReview: MemoryCandidate[] = [];
  const skipped: SkippedMemoryReviewCandidate[] = [];

  candidates.candidates.forEach((candidate) => {
    const validation = validateReviewCandidate(candidate);

    if (typeof validation === "string") {
      skipped.push({ candidate, reason: validation });
      return;
    }

    readyForReview.push(validation);
  });

  return { readyForReview, skipped };
}

