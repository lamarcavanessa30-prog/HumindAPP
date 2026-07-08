import type { ConversationModePreference } from "./conversationPreferences";
import { runConversationPipeline } from "./conversationPipeline";
import { composePromptContext } from "./promptComposer";
import { extractCognitiveCandidates } from "./cognitiveExtraction";
import { validateCognitiveExtraction } from "./cognitiveValidation";
import { prepareMemoryCandidates } from "./memoryCandidates";
import { evaluateMemoryEligibility } from "./memoryEligibility";
import { prepareMemoryIntakeDrafts } from "./memoryIntakeDraft";
import { createMemoryRecords } from "./memoryRecordFactory";
import { prepareMemoryReviewGate } from "./memoryReviewGate";
import { lookupExistingThoughts } from "./thoughtLookup";
import type { Thought } from "./thoughts";

const FIXTURE_CONVERSATION_MODE: ConversationModePreference = "automatica";

const FIXTURE_THOUGHTS: Thought[] = [
  {
    id: "thought_existing_uncertainty",
    text: "non so",
    createdAt: "2026-07-07T10:00:00.000Z",
    source: "chat",
    tags: ["Conversazione"],
  },
];

export const promptComposerFixture = composePromptContext({
  currentUserMessage: "Non so bene cosa sto cercando di capire.",
  recentConversation: [
    {
      role: "assistant",
      text: "Scrivi pure quello che vuoi osservare.",
    },
    {
      role: "user",
      text: "Mi chiedo da dove inizi questo filo.",
    },
  ],
  conversationMode: FIXTURE_CONVERSATION_MODE,
});

export const cognitiveExtractionFixture = extractCognitiveCandidates(promptComposerFixture);

export const cognitiveValidationFixture = validateCognitiveExtraction(cognitiveExtractionFixture);

export const memoryCandidateFixture = prepareMemoryCandidates(cognitiveValidationFixture);

export const memoryReviewGateFixture = prepareMemoryReviewGate(memoryCandidateFixture);

export const thoughtLookupFixture = lookupExistingThoughts({
  reviewGate: memoryReviewGateFixture,
  thoughts: FIXTURE_THOUGHTS,
});

export const memoryIntakeDraftFixture = prepareMemoryIntakeDrafts(thoughtLookupFixture);

export const memoryEligibilityFixture = evaluateMemoryEligibility(memoryIntakeDraftFixture);

export const memoryRecordFactoryFixture = createMemoryRecords(memoryEligibilityFixture);

export const conversationPipelineFixture = runConversationPipeline({
  currentUserMessage: promptComposerFixture.currentUserMessage,
  recentMessages: promptComposerFixture.recentConversation,
  conversationMode: promptComposerFixture.conversationMode,
  thoughts: FIXTURE_THOUGHTS,
});

export const cognitivePipelineBoundaryFixture = {
  conversationPipeline: conversationPipelineFixture,
  promptContext: promptComposerFixture,
  cognitiveExtraction: cognitiveExtractionFixture,
  cognitiveValidation: cognitiveValidationFixture,
  memoryCandidates: memoryCandidateFixture,
  memoryReviewGate: memoryReviewGateFixture,
  thoughtLookup: thoughtLookupFixture,
  memoryIntakeDraft: memoryIntakeDraftFixture,
  memoryEligibility: memoryEligibilityFixture,
  memoryRecordFactory: memoryRecordFactoryFixture,
};

export const cognitivePipelineExpectedFixture = {
  currentUserMessage: "Non so bene cosa sto cercando di capire.",
  uncertaintyMarkerCount: 1,
  memoryCandidateCount: 1,
  readyForReviewCount: 1,
  matchedCandidateCount: 1,
  unmatchedCandidateCount: 0,
  memoryIntakeDraftCount: 0,
  memoryEligibleCount: 0,
  memoryRecordCount: 0,
};
