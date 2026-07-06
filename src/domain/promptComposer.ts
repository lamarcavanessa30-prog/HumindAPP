import type { ConversationModePreference } from "./conversationPreferences";

export type PromptConversationRole = "user" | "assistant";

export type PromptConversationMessage = {
  role: PromptConversationRole;
  text: string;
};

export type PromptContext = {
  currentUserMessage: string;
  recentConversation: PromptConversationMessage[];
  conversationMode: ConversationModePreference;
  memoryContext: null;
  reflections: null;
  patterns: null;
  userProfile: null;
};

export function composePromptContext(params: {
  currentUserMessage: string;
  recentConversation: PromptConversationMessage[];
  conversationMode: ConversationModePreference;
}): PromptContext {
  return {
    currentUserMessage: params.currentUserMessage,
    recentConversation: params.recentConversation,
    conversationMode: params.conversationMode,
    memoryContext: null,
    reflections: null,
    patterns: null,
    userProfile: null,
  };
}

