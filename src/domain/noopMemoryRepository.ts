import type {
  MemoryRepository,
  MemoryRepositorySaveInput,
  MemoryRepositorySaveResult,
} from "./memoryRepositoryContract";

export type NoopMemoryRepositorySaveResult = MemoryRepositorySaveResult & {
  status: "noop";
  input: MemoryRepositorySaveInput;
  persisted: false;
};

export class NoopMemoryRepository implements MemoryRepository {
  async saveMemoryRecord(input: MemoryRepositorySaveInput): Promise<NoopMemoryRepositorySaveResult> {
    return {
      status: "noop",
      operation: input.operation,
      requestOperation: input.requestOperation,
      decisionReason: input.decisionReason,
      record: input.record,
      input,
      persisted: false,
    };
  }
}
