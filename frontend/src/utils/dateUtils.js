/**
 * Dynamic date and time formatting utilities
 * Ensures news headlines display up-to-the-minute, day-by-day and time-to-time timestamps.
 */

export const formatDynamicTime = (dateInput, fallbackMinutesAgo = 0) => {
  let dateObj;
  
  if (dateInput) {
    if (typeof dateInput === 'string' && (dateInput.toLowerCase() === 'today' || dateInput.toLowerCase() === 'just now')) {
      dateObj = new Date(Date.now() - (fallbackMinutesAgo * 60 * 1000));
    } else {
      dateObj = new Date(dateInput);
      if (isNaN(dateObj.getTime())) {
        dateObj = new Date(Date.now() - (fallbackMinutesAgo * 60 * 1000));
      }
    }
  } else {
    dateObj = new Date(Date.now() - (fallbackMinutesAgo * 60 * 1000));
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  // Future safeguard (in case server clock is slightly ahead)
  if (diffMs < 0) {
    return 'Just now';
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) {
    return 'Just now';
  }
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }
  if (diffHr < 12) {
    return `${diffHr}h ago`;
  }
  
  const isSameDay = now.getFullYear() === dateObj.getFullYear() &&
                    now.getMonth() === dateObj.getMonth() &&
                    now.getDate() === dateObj.getDate();

  const timeStr = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isSameDay) {
    return `Today, ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.getFullYear() === dateObj.getFullYear() &&
                      yesterday.getMonth() === dateObj.getMonth() &&
                      yesterday.getDate() === dateObj.getDate();

  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getArticleTimestamp = (dateInput, fallbackMinutesAgo = 0) => {
  if (dateInput) {
    const parsed = new Date(dateInput).getTime();
    if (!isNaN(parsed)) return parsed;
  }
  return Date.now() - (fallbackMinutesAgo * 60 * 1000);
};
