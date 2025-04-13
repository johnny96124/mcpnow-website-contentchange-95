
export const ONBOARDING_KEY = 'mcp-now-onboarding-shown';

export const hasSeenOnboarding = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const markOnboardingAsSeen = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};
