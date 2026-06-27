export type RelativeTimeStyle = 'long' | 'short';

export function getRelativeTimeString(
  timestamp: number,
  now: number = Date.now(),
  style: RelativeTimeStyle = 'long',
): string {
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs = Math.floor(diffMins / 60);

  if (style === 'short') {
    if (diffSecs < 10) return 'just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${diffHrs}h ago`;
  }

  if (diffSecs < 10) return 'just now';
  if (diffSecs < 60) return `${diffSecs} seconds ago`;
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHrs === 1) return '1 hour ago';
  return `${diffHrs} hours ago`;
}
