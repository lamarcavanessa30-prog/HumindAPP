import type { ConversationModePreference } from "./conversationPreferences";
import { extractCognitiveCandidates, type CognitiveExtractionResult } from "./cognitiveExtraction";
import { validateCognitiveExtraction, type CognitiveValidationResult } from "./cognitiveValidation";
import { prepareMemoryCandidates, type MemoryCandidateResult } from "./memoryCandidates";
import { evaluateMemoryEligibility, type MemoryEligibilityResult } from "./memoryEligibility";
import { prepareMemoryIntakeDrafts, type MemoryIntakeDraftResult } from "./memoryIntakeDraft";
import { createMemoryRecords, type MemoryRecordFactoryResult } from "./memoryRecordFactory";
import { prepareMemoryReviewGate, type MemoryReviewGateResult } from "./memoryReviewGate";
import { decideMemoryStorage, type MemoryStorageDecisionResult } from "./memoryStorageDecision";
import {
  prepareMemoryStorageRequests,
  type MemoryStorageRequestResult,
} from "./memoryStorageRequest";
import { composePromptContext, type PromptContext, type PromptConversationMessage } from "./promptComposer";
import { lookupExistingThoughts, type ThoughtLookupResult } from "./thoughtLookup";
import type { Thought } from "./thoughts";

export type ConversationPipelineMessage = PromptConversationMessage;

export type ConversationPipelineInput = {
  currentUserMessage: string;
  recentMessages: ConversationPipelineMessage[];
  conversationMode: ConversationModePreference;
  thoughts: Thought[];
};

export type ConversationPipelineResult = {
  promptContext: PromptContext;
  extraction: CognitiveExtractionResult;
  validation: CognitiveValidationResult;
  memoryCandidates: MemoryCandidateResult;
  reviewGate: MemoryReviewGateResult;
  thoughtLookup: ThoughtLookupResult;
  memoryIntakeDraft: MemoryIntakeDraftResult;
  memoryEligibility: MemoryEligibilityResult;
  memoryRecordFactory: MemoryRecordFactoryResult;
  memoryStorageDecision: MemoryStorageDecisionResult;
  memoryStorageRequest: MemoryStorageRequestResult;
};

export function runConversationPipeline(input: ConversationPipelineInput): ConversationPipelineResult {
  const promptContext = composePromptContext({
    currentUserMessage: input.currentUserMessage,
    recentConversation: input.recentMessages,
    conversationMode: input.conversationMode,
  });
  const extraction = extractCognitiveCandidates(promptContext);
  const validation = validateCognitiveExtraction(extraction);
  const memoryCandidates = prepareMemoryCandidates(validation);
  const reviewGate = prepareMemoryReviewGate(memoryCandidates);
  const thoughtLookup = lookupExistingThoughts({ reviewGate, thoughts: input.thoughts });
  const memoryIntakeDraft = prepareMemoryIntakeDrafts(thoughtLookup);
  const memoryEligibility = evaluateMemoryEligibility(memoryIntakeDraft);
  const memoryRecordFactory = createMemoryRecords(memoryEligibility);
  const memoryStorageDecision = decideMemoryStorage(memoryRecordFactory);
  const memoryStorageRequest = prepareMemoryStorageRequests(memoryStorageDecision);

  return {
    promptContext,
    extraction,
    validation,
    memoryCandidates,
    reviewGate,
    thoughtLookup,
    memoryIntakeDraft,
    memoryEligibility,
    memoryRecordFactory,
    memoryStorageDecision,
    memoryStorageRequest,
  };
}
