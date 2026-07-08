import type {
  MemoryStorageRequest,
  MemoryStorageRequestOperation,
} from "./memoryStorageRequest";

export type MemoryRepositoryOperation = "save_memory_record";

export type MemoryRepositorySaveStatus =
  | "saved"
  | "noop"
  | "skipped"
  | "failed";

export type MemoryRepositorySaveErrorReason =
  | "unsupported_operation"
  | "invalid_request"
  | "storage_unavailable"
  | "unknown_error";

export type MemoryRepositorySaveInput = {
  operation: MemoryRepositoryOperation;
  request: MemoryStorageRequest;
  requestOperation: MemoryStorageRequestOperation;
  decisionReason: MemoryStorageRequest["decisionReason"];
  record: MemoryStorageRequest["payload"]["record"];
};

export type MemoryRepositorySaveResult = {
  status: MemoryRepositorySaveStatus;
  operation: MemoryRepositoryOperation;
  requestOperation: MemoryStorageRequestOperation;
  decisionReason: MemoryStorageRequest["decisionReason"];
  record: MemoryStorageRequest["payload"]["record"];
  errorReason?: MemoryRepositorySaveErrorReason;
};

export interface MemoryRepository {
  saveMemoryRecord(input: MemoryRepositorySaveInput): Promise<MemoryRepositorySaveResult>;
}
