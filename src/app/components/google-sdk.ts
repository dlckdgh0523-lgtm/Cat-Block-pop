// ─── Google Play Games SDK Mock ───
// Simulates Google Play Games Services for development.
// Replace with actual Google Play Games SDK for production.

import {
  getCached, setCache, invalidateCacheByPrefix,
  throttleRequest, retryWithBackoff, checkRateLimit,
} from "./network-utils";

// ─── Config ───
export const GOOGLE_CONFIG = {
  clientId: "YOUR_GOOGLE_CLIENT_ID_HERE",
  webClientId: "YOUR_GOOGLE_WEB_CLIENT_ID_HERE",
  testMode: true,
};

// ─── Types ───
export interface GoogleUser {
  id: string;
  displayName: string;
  profileImage?: string;
  email?: string;
}

export interface GoogleFriend {
  id: string;
  nickname: string;
  score: number;
  stars: number;
  profileImage?: string;
  catType: number;
  rank: number;
  platform: "google";
}

// ─── SDK State ───
let _initialized = false;
let _loggedIn = false;
let _currentUser: GoogleUser | null = null;

// Mock Google friends who also play this game
const MOCK_GOOGLE_FRIENDS: GoogleFriend[] = [
  { id: "google_001", nickname: "PuzzleMaster", score: 14200, stars: 38, catType: 2, rank: 0, platform: "google" },
  { id: "google_002", nickname: "BlockQueen", score: 11300, stars: 22, catType: 1, rank: 0, platform: "google" },
  { id: "google_003", nickname: "CatLover99", score: 8540, stars: 12, catType: 4, rank: 0, platform: "google" },
  { id: "google_004", nickname: "게임좋아", score: 6100, stars: 7, catType: 0, rank: 0, platform: "google" },
  { id: "google_005", nickname: "NyanPlayer", score: 4200, stars: 3, catType: 5, rank: 0, platform: "google" },
];

// ─── Initialize & Auto-login ───
export function initGoogleSDK(): Promise<boolean> {
  return new Promise(resolve => {
    console.log("[Google Mock] SDK initializing...");
    setTimeout(() => {
      _initialized = true;
      // Restore session from localStorage
      try {
        const saved = localStorage.getItem("catblockpop_google_session");
        if (saved) {
          const session = JSON.parse(saved);
          _loggedIn = true;
          _currentUser = session.user;
          console.log("[Google Mock] Session restored for:", _currentUser?.displayName);
        }
      } catch {}
      console.log("[Google Mock] SDK initialized", _loggedIn ? "(logged in)" : "(not logged in)");
      resolve(true);
    }, 200);
  });
}

// ─── Silent Sign-In (auto-login without UI) ───
export function googleSilentSignIn(): Promise<boolean> {
  return new Promise(resolve => {
    if (!_initialized) {
      resolve(false);
      return;
    }
    if (_loggedIn) {
      resolve(true);
      return;
    }

    console.log("[Google Mock] Attempting silent sign-in...");
    setTimeout(() => {
      // In mock, always succeed for demo purposes
      const user: GoogleUser = {
        id: `google_user_${Date.now()}`,
        displayName: "나",
      };
      _loggedIn = true;
      _currentUser = user;

      try {
        localStorage.setItem("catblockpop_google_session", JSON.stringify({ user }));
      } catch {}

      console.log("[Google Mock] Silent sign-in successful:", user.displayName);
      resolve(true);
    }, 400);
  });
}

// ─── Check login ───
export function isGoogleLoggedIn(): boolean {
  return _loggedIn;
}

export function getGoogleUser(): GoogleUser | null {
  return _currentUser;
}

// ─── Get friends who play this game ───
export function getGoogleFriends(): Promise<GoogleFriend[]> {
  // Rate limit check
  if (!checkRateLimit("google_friends", 2)) {
    const cached = getCached<GoogleFriend[]>("google_friends");
    if (cached) return Promise.resolve(cached);
  }

  // Deduplicate concurrent calls
  return throttleRequest("google_friends", () =>
    retryWithBackoff(() => _fetchGoogleFriendsInternal(), {
      maxRetries: 2,
      baseDelay: 800,
      onRetry: (attempt) => console.log(`[Google] Retrying friends fetch, attempt ${attempt}`),
    })
  );
}

function _fetchGoogleFriendsInternal(): Promise<GoogleFriend[]> {
  return new Promise((resolve, reject) => {
    if (!_loggedIn) {
      reject(new Error("Not logged in"));
      return;
    }

    // Check cache first (TTL: 2 minutes)
    const cached = getCached<GoogleFriend[]>("google_friends");
    if (cached) {
      console.log("[Google Mock] Returning cached friends");
      resolve(cached);
      return;
    }

    console.log("[Google Mock] Fetching Play Games friends...");
    setTimeout(() => {
      const friends = [...MOCK_GOOGLE_FRIENDS];
      setCache("google_friends", friends, 120000);
      console.log("[Google Mock] Found", friends.length, "friends playing this game");
      resolve(friends);
    }, 600);
  });
}

// ─── Logout ───
export function googleLogout(): Promise<boolean> {
  return new Promise(resolve => {
    _loggedIn = false;
    _currentUser = null;
    invalidateCacheByPrefix("google_");
    try { localStorage.removeItem("catblockpop_google_session"); } catch {}
    console.log("[Google Mock] Logged out");
    resolve(true);
  });
}