import type {
  MemoryRepositoryInputItem,
  MemoryRepositoryInputResult,
  SkippedMemoryRepositoryInput,
} from "./memoryRepositoryInput";
import type { MemoryRepositorySaveInput } from "./memoryRepositoryContract";

export type MemoryPersistencePlanStatus = "planned" | "skipped";

export type MemoryPersistenceSkippedReason =
  | "repository_input_skipped"
  | "unsupported_repository_operation";

export type MemoryPersistencePlanItem = {
  status: Extract<MemoryPersistencePlanStatus, "planned">;
  operation: MemoryRepositorySaveInput["operation"];
  repositoryInput: MemoryRepositoryInputItem;
  record: MemoryRepositorySaveInput["record"];
  decisionReason: MemoryRepositorySaveInput["decisionReason"];
};

export type SkippedMemoryPersistencePlanItem = {
  status: Extract<MemoryPersistencePlanStatus, "skipped">;
  repositoryInput: MemoryRepositoryInputItem | SkippedMemoryRepositoryInput;
  reason: MemoryPersistenceSkippedReason;
};

export type MemoryPersistencePlan = {
  items: MemoryPersistencePlanItem[];
  skipped: SkippedMemoryPersistencePlanItem[];
};

export type MemoryPersistencePlanResult = MemoryPersistencePlan;

function createPlanItem(repositoryInput: MemoryRepositoryInputItem): MemoryPersistencePlanItem {
  return {
    status: "planned",
    operation: repositoryInput.input.operation,
    repositoryInput,
    record: repositoryInput.input.record,
    decisionReason: repositoryInput.input.decisionReason,
  };
}

function createSkippedPlanItem(params: {
  repositoryInput: MemoryRepositoryInputItem | SkippedMemoryRepositoryInput;
  reason: MemoryPersistenceSkippedReason;
}): SkippedMemoryPersistencePlanItem {
  return {
    status: "skipped",
    repositoryInput: params.repositoryInput,
    reason: params.reason,
  };
}

export function prepareMemoryPersistencePlan(
  repositoryInputs: MemoryRepositoryInputResult,
): MemoryPersistencePlanResult {
  const items: MemoryPersistencePlanItem[] = [];
  const skipped: SkippedMemoryPersistencePlanItem[] = repositoryInputs.skipped.map(
    (repositoryInput) =>
      createSkippedPlanItem({ repositoryInput, reason: "repository_input_skipped" }),
  );

  repositoryInputs.inputs.forEach((repositoryInput) => {
    if (repositoryInput.input.operation !== "save_memory_record") {
      skipped.push(
        createSkippedPlanItem({
          repositoryInput,
          reason: "unsupported_repository_operation",
        }),
      );
      return;
    }

    items.push(createPlanItem(repositoryInput));
  });

  return { items, skipped };
}
