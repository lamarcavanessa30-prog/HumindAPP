export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "skipped";

export type OptionalProfileCompletionStatus = "empty" | "partial" | "complete";

export type OnboardingState = {
  onboardingStatus: OnboardingStatus;
  profileCompletionStatus: OptionalProfileCompletionStatus;
  skippedOnboarding: boolean;
  lastReminderAt: string | null;
  canShowFutureReminder: boolean;
};

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  onboardingStatus: "not_started",
  profileCompletionStatus: "empty",
  skippedOnboarding: false,
  lastReminderAt: null,
  canShowFutureReminder: false,
};

export function createOnboardingState(overrides: Partial<OnboardingState> = {}): OnboardingState {
  return {
    ...DEFAULT_ONBOARDING_STATE,
    ...overrides,
  };
}

export function shouldShowOptionalOnboardingCard(state: OnboardingState) {
  return state.onboardingStatus !== "completed" && !state.skippedOnboarding;
}
