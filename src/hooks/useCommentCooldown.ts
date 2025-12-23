import { useState, useEffect } from 'react';

// Cooldown durations in milliseconds
const MAIN_COMMENT_COOLDOWN = 30 * 60 * 1000; // 30 minutes
const REPLY_COOLDOWN = 5 * 60 * 1000; // 5 minutes
const DAILY_COMMENT_LIMIT = 10; // Max comments per review per day

interface CommentRecord {
  timestamp: number;
  isReply: boolean;
}

interface CooldownInfo {
  canComment: boolean;
  canReply: boolean;
  mainCommentCooldown: number; // Milliseconds remaining
  replyCooldown: number; // Milliseconds remaining
  remainingDailyComments: number;
  hasReachedDailyLimit: boolean;
}

/**
 * Custom hook to manage comment cooldowns and daily limits
 * Uses localStorage to track comment history per review
 */
export const useCommentCooldown = (reviewSlug: string) => {
  const [cooldownInfo, setCooldownInfo] = useState<CooldownInfo>({
    canComment: true,
    canReply: true,
    mainCommentCooldown: 0,
    replyCooldown: 0,
    remainingDailyComments: DAILY_COMMENT_LIMIT,
    hasReachedDailyLimit: false,
  });

  // Get storage key for this review
  const getStorageKey = (type: 'main' | 'reply' | 'history') => {
    const sessionId = getOrCreateSessionId();
    return `comment_${type}_${reviewSlug}_${sessionId}`;
  };

  // Get or create a unique session ID for this user
  const getOrCreateSessionId = (): string => {
    const storageKey = 'comment_session_id';
    let sessionId = sessionStorage.getItem(storageKey);
    
    if (!sessionId) {
      sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(storageKey, sessionId);
    }
    
    return sessionId;
  };

  // Get comment history for this review
  const getCommentHistory = (): CommentRecord[] => {
    const key = getStorageKey('history');
    const stored = localStorage.getItem(key);
    
    if (!stored) return [];
    
    try {
      const history: CommentRecord[] = JSON.parse(stored);
      // Filter out comments older than 24 hours
      const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return history.filter(record => record.timestamp > dayAgo);
    } catch {
      return [];
    }
  };

  // Save comment to history
  const recordComment = (isReply: boolean) => {
    const key = getStorageKey('history');
    const history = getCommentHistory();
    
    history.push({
      timestamp: Date.now(),
      isReply
    });
    
    localStorage.setItem(key, JSON.stringify(history));

    // Also store individual cooldown timestamps
    const cooldownKey = isReply ? getStorageKey('reply') : getStorageKey('main');
    localStorage.setItem(cooldownKey, Date.now().toString());
    
    // Force immediate update of cooldown state
    setCooldownInfo(calculateCooldown());
  };

  // Calculate cooldown info
  const calculateCooldown = (): CooldownInfo => {
    const now = Date.now();
    const history = getCommentHistory();
    
    // Check daily limit
    const dailyCount = history.length;
    const hasReachedDailyLimit = dailyCount >= DAILY_COMMENT_LIMIT;
    const remainingDailyComments = Math.max(0, DAILY_COMMENT_LIMIT - dailyCount);

    // Check main comment cooldown
    const mainCommentKey = getStorageKey('main');
    const lastMainComment = localStorage.getItem(mainCommentKey);
    let mainCommentCooldown = 0;
    let canComment = !hasReachedDailyLimit;

    if (lastMainComment) {
      const elapsed = now - parseInt(lastMainComment);
      if (elapsed < MAIN_COMMENT_COOLDOWN) {
        mainCommentCooldown = MAIN_COMMENT_COOLDOWN - elapsed;
        canComment = false;
      }
    }

    // Check reply cooldown
    const replyKey = getStorageKey('reply');
    const lastReply = localStorage.getItem(replyKey);
    let replyCooldown = 0;
    let canReply = !hasReachedDailyLimit;

    if (lastReply) {
      const elapsed = now - parseInt(lastReply);
      if (elapsed < REPLY_COOLDOWN) {
        replyCooldown = REPLY_COOLDOWN - elapsed;
        canReply = false;
      }
    }

    return {
      canComment,
      canReply,
      mainCommentCooldown,
      replyCooldown,
      remainingDailyComments,
      hasReachedDailyLimit,
    };
  };

  // Format time remaining (e.g., "5m 30s", "30s")
  const formatTimeRemaining = (milliseconds: number): string => {
    if (milliseconds <= 0) return '';
    
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  // Update cooldown info periodically
  useEffect(() => {
    const updateCooldown = () => {
      setCooldownInfo(calculateCooldown());
    };

    // Initial calculation
    updateCooldown();

    // Update every second while there's an active cooldown
    const interval = setInterval(() => {
      const info = calculateCooldown();
      setCooldownInfo(info);
      
      // Stop updating if no active cooldowns
      if (info.mainCommentCooldown === 0 && info.replyCooldown === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reviewSlug]);

  return {
    cooldownInfo,
    recordComment,
    formatTimeRemaining,
    canComment: cooldownInfo.canComment,
    canReply: cooldownInfo.canReply,
    mainCommentTimeRemaining: formatTimeRemaining(cooldownInfo.mainCommentCooldown),
    replyTimeRemaining: formatTimeRemaining(cooldownInfo.replyCooldown),
    remainingDailyComments: cooldownInfo.remainingDailyComments,
    hasReachedDailyLimit: cooldownInfo.hasReachedDailyLimit,
  };
};
