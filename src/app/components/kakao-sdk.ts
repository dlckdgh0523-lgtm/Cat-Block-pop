// ─── Kakao SDK Mock ───
// This simulates Kakao Login & Friends API for development.
// Replace with actual Kakao JavaScript SDK for production:
//   - iOS/Android: KakaoSDK (native)
//   - Web: Kakao JavaScript SDK (https://developers.kakao.com/docs/latest/ko/getting-started/sdk-js)
//   - Unity: Kakao Games Unity SDK

import {
  getCached, setCache, invalidateCacheByPrefix,
  throttleRequest, retryWithBackoff, checkRateLimit,
} from "./network-utils";

// ─── Config ───
export const KAKAO_CONFIG = {
  appKey: "YOUR_KAKAO_APP_KEY_HERE",        // TODO: Replace with real Kakao REST API Key
  jsKey: "YOUR_KAKAO_JS_KEY_HERE",          // TODO: Replace with real JavaScript Key
  redirectUri: "https://yourapp.com/auth/kakao/callback",
  scope: "profile_nickname,profile_image,friends",
  testMode: true,
};

// ─── Types ───
export interface KakaoUser {
  id: string;
  nickname: string;
  profileImage?: string;
  email?: string;
}

export interface KakaoFriend {
  id: string;
  nickname: string;
  score: number;
  stars: number;
  profileImage?: string;
  catType: number;  // 0-5
  rank: number;
}

export interface KakaoLoginResult {
  success: boolean;
  user?: KakaoUser;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export interface KakaoShareResult {
  success: boolean;
  error?: string;
}

// ─── SDK State ───
let _initialized = false;
let _loggedIn = false;
let _currentUser: KakaoUser | null = null;
let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _friendsCache: KakaoFriend[] | null = null;

// Mock friend data (simulates real Kakao friends who also play this game)
const MOCK_KAKAO_FRIENDS: KakaoFriend[] = [
  { id: "kakao_001", nickname: "냥이마스터", score: 15420, stars: 42, catType: 0, rank: 0 },
  { id: "kakao_002", nickname: "고양이덕후", score: 12850, stars: 28, catType: 3, rank: 0 },
  { id: "kakao_003", nickname: "블록킹", score: 9630, stars: 15, catType: 1, rank: 0 },
  { id: "kakao_004", nickname: "퍼즐러버", score: 7210, stars: 8, catType: 4, rank: 0 },
  { id: "kakao_005", nickname: "캣프렌즈", score: 5890, stars: 5, catType: 2, rank: 0 },
  { id: "kakao_006", nickname: "냥냥이", score: 3450, stars: 2, catType: 5, rank: 0 },
];

// ─── Initialize SDK ───
export function initKakaoSDK(): Promise<boolean> {
  return new Promise(resolve => {
    console.log("[Kakao Mock] SDK initializing...");
    setTimeout(() => {
      _initialized = true;
      // Restore session from localStorage
      try {
        const saved = localStorage.getItem("catblockpop_kakao_session");
        if (saved) {
          const session = JSON.parse(saved);
          _loggedIn = true;
          _currentUser = session.user;
          _accessToken = session.accessToken;
          _refreshToken = session.refreshToken;
          console.log("[Kakao Mock] Session restored for:", _currentUser?.nickname);
        }
      } catch {}
      console.log("[Kakao Mock] SDK initialized", _loggedIn ? "(logged in)" : "(not logged in)");
      resolve(true);
    }, 300);
  });
}

// ─── Login ───
export function kakaoLogin(): Promise<KakaoLoginResult> {
  return new Promise(resolve => {
    if (!_initialized) {
      resolve({ success: false, error: "SDK not initialized" });
      return;
    }

    console.log("[Kakao Mock] Login flow started...");
    console.log("[Kakao Mock] Showing Kakao login dialog...");

    // Simulate login dialog (1.5s)
    setTimeout(() => {
      // 95% success rate in mock
      const isSuccess = Math.random() < 0.95;
      if (isSuccess) {
        const user: KakaoUser = {
          id: `kakao_${Date.now()}`,
          nickname: "나",
          profileImage: undefined,
        };
        const accessToken = `mock_at_${Date.now()}`;
        const refreshToken = `mock_rt_${Date.now()}`;

        _loggedIn = true;
        _currentUser = user;
        _accessToken = accessToken;
        _refreshToken = refreshToken;
        _friendsCache = null; // Clear friends cache on new login

        // Persist session
        try {
          localStorage.setItem("catblockpop_kakao_session", JSON.stringify({
            user, accessToken, refreshToken,
          }));
        } catch {}

        console.log("[Kakao Mock] Login successful:", user.nickname);
        resolve({ success: true, user, accessToken, refreshToken });
      } else {
        console.log("[Kakao Mock] Login failed");
        resolve({ success: false, error: "사용자가 로그인을 취소했습니다" });
      }
    }, 1500);
  });
}

// ─── Logout ───
export function kakaoLogout(): Promise<boolean> {
  return new Promise(resolve => {
    _loggedIn = false;
    _currentUser = null;
    _accessToken = null;
    _refreshToken = null;
    _friendsCache = null;
    invalidateCacheByPrefix("kakao_");
    try { localStorage.removeItem("catblockpop_kakao_session"); } catch {}
    console.log("[Kakao Mock] Logged out");
    resolve(true);
  });
}

// ─── Check Login Status ───
export function isKakaoLoggedIn(): boolean {
  return _loggedIn;
}

export function getKakaoUser(): KakaoUser | null {
  return _currentUser;
}

// ─── Get Friends List (who play this game) ───
export function getKakaoFriends(): Promise<KakaoFriend[]> {
  // Rate limit check
  if (!checkRateLimit("kakao_friends", 2)) {
    // Return cached if rate limited
    const cached = getCached<KakaoFriend[]>("kakao_friends");
    if (cached) return Promise.resolve(cached);
  }

  // Deduplicate concurrent calls
  return throttleRequest("kakao_friends", () =>
    retryWithBackoff(() => _fetchKakaoFriendsInternal(), {
      maxRetries: 2,
      baseDelay: 800,
      onRetry: (attempt) => console.log(`[Kakao] Retrying friends fetch, attempt ${attempt}`),
    })
  );
}

function _fetchKakaoFriendsInternal(): Promise<KakaoFriend[]> {
  return new Promise((resolve, reject) => {
    if (!_loggedIn) {
      reject(new Error("Not logged in"));
      return;
    }

    // Check network cache first (TTL: 2 minutes)
    const cached = getCached<KakaoFriend[]>("kakao_friends");
    if (cached) {
      console.log("[Kakao Mock] Returning cached friends");
      resolve(cached);
      return;
    }

    // Return SDK-level cache if available
    if (_friendsCache) {
      setCache("kakao_friends", _friendsCache, 120000);
      resolve(_friendsCache);
      return;
    }

    console.log("[Kakao Mock] Fetching friends list...");
    setTimeout(() => {
      _friendsCache = [...MOCK_KAKAO_FRIENDS];
      setCache("kakao_friends", _friendsCache, 120000);
      console.log("[Kakao Mock] Found", _friendsCache.length, "friends playing this game");
      resolve(_friendsCache);
    }, 800);
  });
}

// ─── Refresh Friends (force update, bypass cache) ───
export function refreshKakaoFriends(): Promise<KakaoFriend[]> {
  _friendsCache = null;
  invalidateCacheByPrefix("kakao_friends");
  return getKakaoFriends();
}

// ─── Send Score to Friend (Kakao Talk Message) ───
export function sendScoreToFriend(friendId: string, score: number): Promise<KakaoShareResult> {
  return new Promise(resolve => {
    if (!_loggedIn) {
      resolve({ success: false, error: "Not logged in" });
      return;
    }

    console.log(`[Kakao Mock] Sending score message to friend ${friendId}: ${score}점`);
    setTimeout(() => {
      console.log("[Kakao Mock] Score message sent!");
      resolve({ success: true });
    }, 500);
  });
}

// ─── Share Game via Kakao Talk ───
export function shareGameViaKakao(score?: number): Promise<KakaoShareResult> {
  return new Promise(resolve => {
    console.log("[Kakao Mock] Opening Kakao share dialog...");
    // In production: Kakao.Share.sendDefault() with template
    const templateArgs = {
      title: "Cat Block Pop",
      description: score ? `${score.toLocaleString()}점을 기록했어요! 도전해보세요!` : "귀여운 고양이 블록 퍼즐 게임!",
      imageUrl: "https://example.com/catblockpop-share.png",
      link: {
        mobileWebUrl: "https://catblockpop.com",
        webUrl: "https://catblockpop.com",
      },
    };
    console.log("[Kakao Mock] Share template:", templateArgs);
    setTimeout(() => {
      resolve({ success: true });
    }, 800);
  });
}

// ─── Invite Friend via Kakao Talk ───
export function inviteFriendViaKakao(): Promise<KakaoShareResult> {
  return new Promise(resolve => {
    console.log("[Kakao Mock] Sending game invite via Kakao Talk...");
    setTimeout(() => {
      resolve({ success: true });
    }, 600);
  });
}

// ─── Token Refresh ───
export function refreshKakaoToken(): Promise<boolean> {
  return new Promise(resolve => {
    if (!_refreshToken) {
      resolve(false);
      return;
    }
    console.log("[Kakao Mock] Refreshing access token...");
    setTimeout(() => {
      _accessToken = `mock_at_${Date.now()}`;
      try {
        const saved = localStorage.getItem("catblockpop_kakao_session");
        if (saved) {
          const session = JSON.parse(saved);
          session.accessToken = _accessToken;
          localStorage.setItem("catblockpop_kakao_session", JSON.stringify(session));
        }
      } catch {}
      console.log("[Kakao Mock] Token refreshed");
      resolve(true);
    }, 300);
  });
}

// ─── Silent Auto-Login (no UI, auto-connect) ───
export function kakaoSilentLogin(): Promise<KakaoLoginResult> {
  return new Promise(resolve => {
    if (!_initialized) {
      resolve({ success: false, error: "SDK not initialized" });
      return;
    }
    if (_loggedIn && _currentUser) {
      resolve({ success: true, user: _currentUser, accessToken: _accessToken || undefined, refreshToken: _refreshToken || undefined });
      return;
    }

    console.log("[Kakao Mock] Silent auto-login...");
    setTimeout(() => {
      const user: KakaoUser = {
        id: `kakao_${Date.now()}`,
        nickname: "나",
        profileImage: undefined,
      };
      const accessToken = `mock_at_${Date.now()}`;
      const refreshToken = `mock_rt_${Date.now()}`;

      _loggedIn = true;
      _currentUser = user;
      _accessToken = accessToken;
      _refreshToken = refreshToken;
      _friendsCache = null;

      try {
        localStorage.setItem("catblockpop_kakao_session", JSON.stringify({
          user, accessToken, refreshToken,
        }));
      } catch {}

      console.log("[Kakao Mock] Silent login successful:", user.nickname);
      resolve({ success: true, user, accessToken, refreshToken });
    }, 500);
  });
}

// ─── Merge friends with local mock ───
export function mergeKakaoFriendsWithLocal(
  kakaoFriends: KakaoFriend[],
  localFriends: { id: string; nickname: string; score: number; stars: number }[],
  myScore?: number,
  myStars?: number,
  myNickname?: string,
): KakaoFriend[] {
  // Use Kakao friends if logged in, otherwise use local mock
  const baseFriends: KakaoFriend[] = kakaoFriends.length > 0
    ? kakaoFriends.map(f => ({ ...f }))
    : localFriends.map((f, i) => ({
        ...f,
        catType: i % 6,
        rank: 0,
        profileImage: undefined,
      }));

  // Add "me" entry if score provided
  if (myScore !== undefined && myNickname) {
    baseFriends.push({
      id: "me",
      nickname: myNickname,
      score: myScore,
      stars: myStars || 0,
      catType: 0,
      rank: 0,
    });
  }

  // Sort by score descending
  baseFriends.sort((a, b) => b.score - a.score);

  // Assign ranks
  baseFriends.forEach((f, i) => {
    f.rank = i + 1;
  });

  return baseFriends;
}

// ─── Update my score on server (for friend ranking) ───
export function updateMyScoreOnServer(score: number, stars: number): Promise<boolean> {
  return new Promise(resolve => {
    if (!_loggedIn) {
      resolve(false);
      return;
    }
    console.log(`[Kakao Mock] Updating score on server: ${score}, stars: ${stars}`);
    // In production: POST to your backend with Kakao access token
    setTimeout(() => {
      console.log("[Kakao Mock] Score updated on server");
      resolve(true);
    }, 300);
  });
}

// ─── Unlink (delete account connection) ───
export function unlinkKakao(): Promise<boolean> {
  return new Promise(resolve => {
    console.log("[Kakao Mock] Unlinking Kakao account...");
    _loggedIn = false;
    _currentUser = null;
    _accessToken = null;
    _refreshToken = null;
    _friendsCache = null;
    try {
      localStorage.removeItem("catblockpop_kakao_session");
    } catch {}
    setTimeout(() => {
      console.log("[Kakao Mock] Kakao account unlinked");
      resolve(true);
    }, 500);
  });
}