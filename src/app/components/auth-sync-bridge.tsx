// ─── Auth Sync Bridge ───
// AuthProvider 내부에서 작동하며, 로그인된 경우 점수를 서버에 자동 동기화
// bestScore가 변경될 때마다 서버에 업데이트

import { useEffect, useRef } from "react";
import { useAuthOptional } from "./auth-context";
import { calculateTotalStars, type PlayerProgress } from "./skins-data";

interface AuthSyncBridgeProps {
  bestScore: number;
  progress: PlayerProgress;
}

export function AuthSyncBridge({ bestScore, progress }: AuthSyncBridgeProps) {
  const auth = useAuthOptional();
  const lastSyncedScore = useRef(0);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!auth?.isAuthenticated) return;
    if (bestScore <= lastSyncedScore.current) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      const totalStars = calculateTotalStars(progress);
      const nickname = progress.nickname || "Player";

      console.log("[SyncBridge] Syncing score to server:", bestScore);
      const ok = await auth.syncScore(bestScore, totalStars, nickname);
      if (ok) {
        lastSyncedScore.current = bestScore;
        console.log("[SyncBridge] Score synced successfully");
      }
    }, 2000);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [bestScore, auth?.isAuthenticated, auth?.syncScore, progress]);

  // No UI - this is a background sync component
  return null;
}