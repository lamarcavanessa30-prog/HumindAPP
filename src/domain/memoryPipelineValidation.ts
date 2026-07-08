import type { MemoryPersistencePlanResult } from "./memoryPersistencePlan";
import type { MemoryRepositoryInputResult } from "./memoryRepositoryInput";
import type { MemoryStorageDecisionResult } from "./memoryStorageDecision";
import type { MemoryStorageRequestResult } from "./memoryStorageRequest";

export type MemoryPipelineValidationStatus = "valid" | "invalid";

export type MemoryPipelineValidationIssueCode =
  | "missing_storage_request"
  | "missing_repository_input"
  | "missing_persistence_plan"
  | "record_reference_mismatch"
  | "reason_mismatch"
  | "unexpected_persisted_result"
  | "unsupported_pipeline_shape";

export type MemoryPipelineValidationIssue = {
  code: MemoryPipelineValidationIssueCode;
  stage:
    | "memory_storage_decision"
    | "memory_storage_request"
    | "memory_repository_input"
    | "memory_persistence_plan";
};

export type MemoryPipelineValidationResult = {
  status: MemoryPipelineValidationStatus;
  issues: MemoryPipelineValidationIssue[];
};

export type MemoryPipelineValidationInput = {
  memoryStorageDecision: MemoryStorageDecisionResult;
  memoryStorageRequest: MemoryStorageRequestResult;
  memoryRepositoryInput: MemoryRepositoryInputResult;
  memoryPersistencePlan: MemoryPersistencePlanResult;
};

function createIssue(
  code: MemoryPipelineValidationIssueCode,
  stage: MemoryPipelineValidationIssue["stage"],
): MemoryPipelineValidationIssue {
  return { code, stage };
}

export function validateMemoryPipeline(
  input: MemoryPipelineValidationInput,
): MemoryPipelineValidationResult {
  const issues: MemoryPipelineValidationIssue[] = [];

  input.memoryStorageDecision.decisions.forEach((decision) => {
    const request = input.memoryStorageRequest.requests.find(
      (candidate) => candidate.payload.record === decision.draft,
    );

    if (!request) {
      issues.push(createIssue("missing_storage_request", "memory_storage_decision"));
      return;
    }

    if (request.decisionReason !== decision.reason) {
      issues.push(createIssue("reason_mismatch", "memory_storage_request"));
    }
  });

  input.memoryStorageDecision.skipped.forEach((decision) => {
    const skippedRequest = input.memoryStorageRequest.skipped.find(
      (candidate) => candidate.decision === decision,
    );

    if (!skippedRequest) {
      issues.push(createIssue("missing_storage_request", "memory_storage_decision"));
      return;
    }

    if (skippedRequest.decisionReason !== decision.reason) {
      issues.push(createIssue("reason_mismatch", "memory_storage_request"));
    }
  });

  input.memoryStorageRequest.requests.forEach((request) => {
    const repositoryInput = input.memoryRepositoryInput.inputs.find(
      (candidate) => candidate.input.request === request,
    );

    if (!repositoryInput) {
      issues.push(createIssue("missing_repository_input", "memory_storage_request"));
      return;
    }

    if (repositoryInput.input.record !== request.payload.record) {
      issues.push(createIssue("record_reference_mismatch", "memory_repository_input"));
    }

    if (repositoryInput.input.requestOperation !== request.operation) {
      issues.push(createIssue("unsupported_pipeline_shape", "memory_repository_input"));
    }

    if (repositoryInput.input.decisionReason !== request.decisionReason) {
      issues.push(createIssue("reason_mismatch", "memory_repository_input"));
    }
  });

  input.memoryStorageRequest.skipped.forEach((request) => {
    const skippedInput = input.memoryRepositoryInput.skipped.find(
      (candidate) => candidate.request === request,
    );

    if (!skippedInput) {
      issues.push(createIssue("missing_repository_input", "memory_storage_request"));
    }
  });

  input.memoryRepositoryInput.inputs.forEach((repositoryInput) => {
    const planItem = input.memoryPersistencePlan.items.find(
      (candidate) => candidate.repositoryInput === repositoryInput,
    );

    if (!planItem) {
      issues.push(createIssue("missing_persistence_plan", "memory_repository_input"));
      return;
    }

    if (planItem.record !== repositoryInput.input.record) {
      issues.push(createIssue("record_reference_mismatch", "memory_persistence_plan"));
    }

    if (planItem.operation !== repositoryInput.input.operation) {
      issues.push(createIssue("unsupported_pipeline_shape", "memory_persistence_plan"));
    }

    if (planItem.decisionReason !== repositoryInput.input.decisionReason) {
      issues.push(createIssue("reason_mismatch", "memory_persistence_plan"));
    }
  });

  input.memoryRepositoryInput.skipped.forEach((repositoryInput) => {
    const skippedPlanItem = input.memoryPersistencePlan.skipped.find(
      (candidate) => candidate.repositoryInput === repositoryInput,
    );

    if (!skippedPlanItem) {
      issues.push(createIssue("missing_persistence_plan", "memory_repository_input"));
    }
  });

  return {
    status: issues.length === 0 ? "valid" : "invalid",
    issues,
  };
}
