export function formatRelativeDate(isoString: string | null): string {
  if (!isoString) return "未安排";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffMins = Math.ceil(diffMs / (1000 * 60));

  if (diffMs <= 0) return "现在";
  if (diffMins < 60) return `${diffMins}分钟后`;
  if (diffHours < 24) return `${diffHours}小时后`;
  if (diffDays === 1) return "明天";
  if (diffDays < 7) return `${diffDays}天后`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周后`;
  return `${Math.ceil(diffDays / 30)}个月后`;
}

export function formatDate(isoString: string | null): string {
  if (!isoString) return "从未";
  return new Date(isoString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
