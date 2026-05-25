export function formatRelativeDate(isoString: string | null, locale: "zh" | "en" = "zh"): string {
  if (!isoString) return locale === "zh" ? "未安排" : "Not scheduled";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffMins = Math.ceil(diffMs / (1000 * 60));

  if (diffMs <= 0) return locale === "zh" ? "现在" : "Now";
  if (diffMins < 60) return locale === "zh" ? `${diffMins}分钟后` : `in ${diffMins} min`;
  if (diffHours < 24) return locale === "zh" ? `${diffHours}小时后` : `in ${diffHours} hr`;
  if (diffDays === 1) return locale === "zh" ? "明天" : "Tomorrow";
  if (diffDays < 7) return locale === "zh" ? `${diffDays}天后` : `in ${diffDays} days`;
  if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7);
    return locale === "zh" ? `${weeks}周后` : `in ${weeks} wk`;
  }
  const months = Math.ceil(diffDays / 30);
  return locale === "zh" ? `${months}个月后` : `in ${months} mo`;
}

export function formatDate(isoString: string | null, locale: "zh" | "en" = "zh"): string {
  if (!isoString) return locale === "zh" ? "从未" : "Never";
  return new Date(isoString).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
