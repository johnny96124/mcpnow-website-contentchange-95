export const ONBOARDING_KEY = 'mcp-now-onboarding-shown';
export const HOSTS_ONBOARDING_KEY = 'mcp-now-hosts-onboarding-shown';
export const SERVERS_ONBOARDING_KEY = 'mcp-now-servers-onboarding-shown';
export const PROFILES_ONBOARDING_KEY = 'mcp-now-profiles-onboarding-shown';

export const hasSeenOnboarding = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const markOnboardingAsSeen = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};

export const hasSeenHostsOnboarding = (): boolean => {
  return localStorage.getItem(HOSTS_ONBOARDING_KEY) === 'true';
};

export const markHostsOnboardingAsSeen = (): void => {
  localStorage.setItem(HOSTS_ONBOARDING_KEY, 'true');
};

export const hasSeenServersOnboarding = (): boolean => {
  return localStorage.getItem('serversOnboardingComplete') === 'true';
};

export const markServersOnboardingAsSeen = (): void => {
  localStorage.setItem('serversOnboardingComplete', 'true');
};

export const hasSeenProfilesOnboarding = (): boolean => {
  return localStorage.getItem(PROFILES_ONBOARDING_KEY) === 'true';
};

export const markProfilesOnboardingAsSeen = (): void => {
  localStorage.setItem(PROFILES_ONBOARDING_KEY, 'true');
};
