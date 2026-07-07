import type { MemoryCandidate } from "./memoryCandidates";
import type { MemoryReviewGateResult } from "./memoryReviewGate";
import type { Thought } from "./thoughts";

export type ThoughtLookupMatch = {
  candidate: MemoryCandidate;
  thought: Thought;
};

export type ThoughtLookupResult = {
  matchedCandidates: ThoughtLookupMatch[];
  unmatchedCandidates: MemoryCandidate[];
};

function normalizeForExactMatch(text: string) {
  return text.trim().toLowerCase();
}

export function lookupExistingThoughts(params: {
  reviewGate: MemoryReviewGateResult;
  thoughts: Thought[];
}): ThoughtLookupResult {
  const matchedCandidates: ThoughtLookupMatch[] = [];
  const unmatchedCandidates: MemoryCandidate[] = [];
  const thoughtsByText = new Map<string, Thought>();

  params.thoughts.forEach((thought) => {
    const normalizedText = normalizeForExactMatch(thought.text);
    if (!normalizedText || thoughtsByText.has(normalizedText)) return;
    thoughtsByText.set(normalizedText, thought);
  });

  params.reviewGate.readyForReview.forEach((candidate) => {
    const normalizedText = normalizeForExactMatch(candidate.observedText);
    const thought = thoughtsByText.get(normalizedText);

    if (thought) {
      matchedCandidates.push({ candidate, thought });
      return;
    }

    unmatchedCandidates.push(candidate);
  });

  return { matchedCandidates, unmatchedCandidates };
}

