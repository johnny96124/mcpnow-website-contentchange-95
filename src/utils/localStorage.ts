
// 存储用户是否已经看过新手引导的键
const ONBOARDING_SEEN_KEY = "mcp-now-onboarding-seen";

/**
 * 检查用户是否已经看过新手引导
 */
export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_SEEN_KEY) === "true";
}

/**
 * 标记用户已经看过新手引导
 */
export function markOnboardingSeen(): void {
  localStorage.setItem(ONBOARDING_SEEN_KEY, "true");
}

/**
 * 重置用户的新手引导状态（用于测试）
 */
export function resetOnboardingState(): void {
  localStorage.removeItem(ONBOARDING_SEEN_KEY);
}
