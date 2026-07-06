import type { PromptContext } from "./promptComposer";

export type CognitiveExtractionConfidence = "medium" | "high";

export type CognitiveObservedEvidence = {
  kind: "observed_text";
  text: string;
};

export type CognitiveInference = {
  label: string;
  confidence: CognitiveExtractionConfidence;
};

export type CognitiveCandidate = {
  evidence: CognitiveObservedEvidence;
  inference?: CognitiveInference;
};

export type CognitiveExtractionResult = {
  events: CognitiveCandidate[];
  goals: CognitiveCandidate[];
  preferences: CognitiveCandidate[];
  relationships: CognitiveCandidate[];
  recurringThemes: CognitiveCandidate[];
  uncertaintyMarkers: CognitiveCandidate[];
  safetyMarkers: CognitiveCandidate[];
};

const EMPTY_EXTRACTION: CognitiveExtractionResult = {
  events: [],
  goals: [],
  preferences: [],
  relationships: [],
  recurringThemes: [],
  uncertaintyMarkers: [],
  safetyMarkers: [],
};

const UNCERTAINTY_MARKERS = [
  "forse",
  "non so",
  "mi chiedo",
  "non capisco",
  "non sono sicura",
  "non sono sicuro",
];

function createEmptyExtraction(): CognitiveExtractionResult {
  return {
    events: [],
    goals: [],
    preferences: [],
    relationships: [],
    recurringThemes: [],
    uncertaintyMarkers: [],
    safetyMarkers: [],
  };
}

function findUncertaintyMarkers(text: string): CognitiveCandidate[] {
  const normalized = text.toLowerCase();

  return UNCERTAINTY_MARKERS.flatMap((marker) => {
    if (!normalized.includes(marker)) return [];

    return [
      {
        evidence: {
          kind: "observed_text",
          text: marker,
        },
        inference: {
          label: "uncertainty_marker",
          confidence: "medium",
        },
      },
    ];
  });
}

export function extractCognitiveCandidates(context: PromptContext): CognitiveExtractionResult {
  const currentMessage = context.currentUserMessage.trim();
  if (!currentMessage) return EMPTY_EXTRACTION;

  const result = createEmptyExtraction();
  result.uncertaintyMarkers = findUncertaintyMarkers(currentMessage);

  return result;
}

