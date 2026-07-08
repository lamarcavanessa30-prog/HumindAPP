import type {
  MemoryStorageDecision,
  MemoryStorageDecisionReason,
  MemoryStorageDecisionResult,
  SkippedMemoryStorageDecision,
} from "./memoryStorageDecision";
import type { MemoryRecordDraft } from "./memoryRecordFactory";

export type MemoryStorageRequestStatus = "prepared" | "skipped";

export type MemoryStorageRequestOperation = "prepare_store_memory";

export type MemoryStorageRequestPayload = {
  record: MemoryRecordDraft;
};

export type MemoryStorageRequest = {
  status: Extract<MemoryStorageRequestStatus, "prepared">;
  operation: MemoryStorageRequestOperation;
  payload: MemoryStorageRequestPayload;
  decisionReason: MemoryStorageDecisionReason;
};

export type SkippedMemoryStorageRequestReason =
  | "storage_decision_skipped"
  | "unsupported_decision_status";

export type SkippedMemoryStorageRequest = {
  status: Extract<MemoryStorageRequestStatus, "skipped">;
  decision: MemoryStorageDecision | SkippedMemoryStorageDecision;
  reason: SkippedMemoryStorageRequestReason;
  decisionReason: MemoryStorageDecisionReason;
};

export type MemoryStorageRequestResult = {
  requests: MemoryStorageRequest[];
  skipped: SkippedMemoryStorageRequest[];
};

function createStorageRequest(decision: MemoryStorageDecision): MemoryStorageRequest {
  return {
    status: "prepared",
    operation: "prepare_store_memory",
    payload: {
      record: decision.draft,
    },
    decisionReason: decision.reason,
  };
}

function createSkippedRequest(params: {
  decision: MemoryStorageDecision | SkippedMemoryStorageDecision;
  reason: SkippedMemoryStorageRequestReason;
}): SkippedMemoryStorageRequest {
  return {
    status: "skipped",
    decision: params.decision,
    reason: params.reason,
    decisionReason: params.decision.reason,
  };
}

export function prepareMemoryStorageRequests(
  decisions: MemoryStorageDecisionResult,
): MemoryStorageRequestResult {
  const requests: MemoryStorageRequest[] = [];
  const skipped: SkippedMemoryStorageRequest[] = decisions.skipped.map((decision) =>
    createSkippedRequest({ decision, reason: "storage_decision_skipped" }),
  );

  decisions.decisions.forEach((decision) => {
    if (decision.status !== "requires_user_review") {
      skipped.push(createSkippedRequest({ decision, reason: "unsupported_decision_status" }));
      return;
    }

    requests.push(createStorageRequest(decision));
  });

  return { requests, skipped };
}
