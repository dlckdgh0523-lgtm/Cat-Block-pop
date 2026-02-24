// ─── AdMob SDK Mock ───
// Simulates Google AdMob behavior for development.
// Production replacement:
//   - React Native: react-native-google-mobile-ads
//   - Unity: Google Mobile Ads Unity Plugin
//   - Web: Google Publisher Tag (GPT) for web ads

export type AdType = "banner" | "interstitial" | "rewarded";

export interface AdConfig {
  bannerId: string;
  interstitialId: string;
  rewardedId: string;
  testMode: boolean;
  childDirected?: boolean;      // COPPA compliance
  maxAdContentRating?: "G" | "PG" | "T" | "MA";
}

// TODO: Replace these with real AdMob unit IDs in production
export const AD_CONFIG: AdConfig = {
  bannerId: "ca-app-pub-XXXXXXXX/banner_XXXXXXXX",
  interstitialId: "ca-app-pub-XXXXXXXX/interstitial_XXXXXXXX",
  rewardedId: "ca-app-pub-XXXXXXXX/rewarded_XXXXXXXX",
  testMode: true,
  childDirected: false,
  maxAdContentRating: "G",
};

export interface RewardedAdResult {
  success: boolean;
  reward?: { type: string; amount: number };
  error?: string;
  watchedFullDuration?: boolean;
}

export interface InterstitialAdResult {
  shown: boolean;
  error?: string;
  duration?: number; // how long the ad was shown in ms
}

export type AdEventType =
  | "loaded"
  | "failed_to_load"
  | "opened"
  | "closed"
  | "clicked"
  | "impression"
  | "rewarded"
  | "reward_earned";

export type AdEventCallback = (event: { type: AdEventType; adType: AdType; data?: unknown }) => void;

// ─── Internal State ───
let _sdkInitialized = false;
let _consentStatus: "authorized" | "denied" | "not_determined" = "not_determined";

interface AdState {
  loaded: boolean;
  loading: boolean;
  lastLoadTime: number;
  failCount: number;
  showCount: number;
}

const _adStates: Record<AdType, AdState> = {
  banner: { loaded: false, loading: false, lastLoadTime: 0, failCount: 0, showCount: 0 },
  interstitial: { loaded: false, loading: false, lastLoadTime: 0, failCount: 0, showCount: 0 },
  rewarded: { loaded: false, loading: false, lastLoadTime: 0, failCount: 0, showCount: 0 },
};

const _eventListeners: AdEventCallback[] = [];
const _adHistory: Map<string, number[]> = new Map();

// ─── Event System ───
export function addAdEventListener(callback: AdEventCallback): () => void {
  _eventListeners.push(callback);
  return () => {
    const idx = _eventListeners.indexOf(callback);
    if (idx >= 0) _eventListeners.splice(idx, 1);
  };
}

function emitAdEvent(type: AdEventType, adType: AdType, data?: unknown) {
  const event = { type, adType, data };
  console.log(`[AdMob] Event: ${type} (${adType})`, data || "");
  for (const cb of _eventListeners) {
    try { cb(event); } catch (e) { console.error("[AdMob] Event listener error:", e); }
  }
}

// ─── Initialize SDK ───
export async function initAdMob(): Promise<void> {
  if (_sdkInitialized) return;

  console.log("[AdMob] Initializing SDK...", AD_CONFIG.testMode ? "(TEST MODE)" : "(PRODUCTION)");

  // In production:
  // - Initialize Google Mobile Ads SDK
  // - Set request configuration (child-directed, content rating)
  // - Request IDFA tracking (iOS ATT) or GDPR consent
  await new Promise(r => setTimeout(r, 300));

  _sdkInitialized = true;
  console.log("[AdMob] SDK initialized successfully");

  // Auto-preload ads
  preloadAds();
}

// ─── Preload all ad types ───
export async function preloadAds(): Promise<void> {
  await Promise.allSettled([
    loadBannerAd(),
    loadInterstitialAd(),
    loadRewardedAd(),
  ]);
}

// ─── Banner Ads ───
export function loadBannerAd(): Promise<boolean> {
  return loadAd("banner", 500);
}

export function isBannerLoaded(): boolean {
  return _adStates.banner.loaded;
}

export function showBanner(): void {
  if (_adStates.banner.loaded) {
    _adStates.banner.showCount++;
    emitAdEvent("opened", "banner");
    emitAdEvent("impression", "banner");
    console.log("[AdMob] Banner shown (total:", _adStates.banner.showCount, ")");
  }
}

export function hideBanner(): void {
  emitAdEvent("closed", "banner");
  console.log("[AdMob] Banner hidden");
}

// ─── Interstitial Ads ───
export function loadInterstitialAd(): Promise<boolean> {
  return loadAd("interstitial", 800);
}

export function isInterstitialLoaded(): boolean {
  return _adStates.interstitial.loaded;
}

export function showInterstitialAd(): Promise<InterstitialAdResult> {
  return new Promise(resolve => {
    if (!_adStates.interstitial.loaded) {
      resolve({ shown: false, error: "Ad not loaded" });
      return;
    }

    _adStates.interstitial.loaded = false;
    _adStates.interstitial.showCount++;
    emitAdEvent("opened", "interstitial");
    emitAdEvent("impression", "interstitial");

    console.log("[AdMob] Interstitial shown - simulating 3s view");
    const startTime = Date.now();

    setTimeout(() => {
      const duration = Date.now() - startTime;
      emitAdEvent("closed", "interstitial");
      console.log("[AdMob] Interstitial closed after", duration, "ms");

      // Auto-reload next ad with exponential backoff on failure
      loadInterstitialAd();
      recordAdShown("interstitial");

      resolve({ shown: true, duration });
    }, 3000);
  });
}

// ─── Rewarded Ads ───
export function loadRewardedAd(): Promise<boolean> {
  return loadAd("rewarded", 1000);
}

export function isRewardedLoaded(): boolean {
  return _adStates.rewarded.loaded;
}

export function showRewardedAd(rewardType = "extra_life", rewardAmount = 1): Promise<RewardedAdResult> {
  return new Promise(resolve => {
    if (!_adStates.rewarded.loaded) {
      resolve({ success: false, error: "Rewarded ad not loaded" });
      return;
    }

    _adStates.rewarded.loaded = false;
    _adStates.rewarded.showCount++;
    emitAdEvent("opened", "rewarded");
    emitAdEvent("impression", "rewarded");

    console.log("[AdMob] Rewarded ad shown - simulating 5s video");

    // Simulate user watching the full video (95% completion rate in mock)
    const watchDuration = 5000;
    const willComplete = Math.random() < 0.95;

    setTimeout(() => {
      if (willComplete) {
        emitAdEvent("reward_earned", "rewarded", { type: rewardType, amount: rewardAmount });
        emitAdEvent("closed", "rewarded");

        console.log("[AdMob] Rewarded ad complete - reward:", rewardType, "x", rewardAmount);
        recordAdShown("rewarded");

        // Auto-reload next ad
        loadRewardedAd();

        resolve({
          success: true,
          reward: { type: rewardType, amount: rewardAmount },
          watchedFullDuration: true,
        });
      } else {
        emitAdEvent("closed", "rewarded");
        console.log("[AdMob] Rewarded ad closed early (no reward)");

        loadRewardedAd();

        resolve({
          success: false,
          error: "User closed ad before completion",
          watchedFullDuration: false,
        });
      }
    }, watchDuration);
  });
}

// ─── Generic Ad Loader ───
function loadAd(adType: AdType, mockDelay: number): Promise<boolean> {
  const state = _adStates[adType];
  if (state.loaded || state.loading) return Promise.resolve(state.loaded);

  state.loading = true;

  return new Promise(resolve => {
    // Add jitter based on fail count (exponential backoff simulation)
    const backoffDelay = Math.min(mockDelay * Math.pow(1.5, state.failCount), 10000);

    setTimeout(() => {
      // 95% load success rate, decreasing with fail count
      const successRate = Math.max(0.7, 0.95 - state.failCount * 0.05);
      const isSuccess = Math.random() < successRate;

      state.loading = false;

      if (isSuccess) {
        state.loaded = true;
        state.lastLoadTime = Date.now();
        state.failCount = 0;
        emitAdEvent("loaded", adType);
        resolve(true);
      } else {
        state.failCount++;
        emitAdEvent("failed_to_load", adType, { failCount: state.failCount });
        console.warn(`[AdMob] ${adType} ad failed to load (attempt ${state.failCount})`);

        // Auto-retry after delay
        if (state.failCount < 5) {
          setTimeout(() => loadAd(adType, mockDelay), 2000 * state.failCount);
        }
        resolve(false);
      }
    }, backoffDelay);
  });
}

// ─── Frequency Capping ───
export function canShowAd(adType: AdType, maxPerHour = 3): boolean {
  const now = Date.now();
  const key = adType;
  const history = _adHistory.get(key) || [];
  const recent = history.filter(t => now - t < 3600000);
  _adHistory.set(key, recent);
  return recent.length < maxPerHour;
}

export function recordAdShown(adType: AdType): void {
  const key = adType;
  const history = _adHistory.get(key) || [];
  history.push(Date.now());
  _adHistory.set(key, history);
}

// ─── Minimum interval check ───
export function canShowAdWithInterval(adType: AdType, minIntervalMs = 60000): boolean {
  const key = adType;
  const history = _adHistory.get(key) || [];
  if (history.length === 0) return true;
  const lastShown = Math.max(...history);
  return Date.now() - lastShown >= minIntervalMs;
}

// ─── Consent Management (GDPR/ATT) ───
export function requestTrackingConsent(): Promise<"authorized" | "denied" | "not_determined"> {
  return new Promise(resolve => {
    console.log("[AdMob] Requesting tracking consent...");
    // In production:
    //   - iOS: Use AppTrackingTransparency framework
    //   - Android/Web: Use Google UMP SDK for GDPR consent
    setTimeout(() => {
      _consentStatus = "authorized";
      console.log("[AdMob] Tracking consent:", _consentStatus);
      resolve(_consentStatus);
    }, 500);
  });
}

export function getConsentStatus(): "authorized" | "denied" | "not_determined" {
  return _consentStatus;
}

// ─── Ad Revenue Reporting ───
export interface AdRevenueEvent {
  adType: AdType;
  revenue: number;    // estimated revenue in USD
  currency: string;
  network: string;
  timestamp: number;
}

const _revenueEvents: AdRevenueEvent[] = [];

export function getAdRevenueHistory(): AdRevenueEvent[] {
  return [..._revenueEvents];
}

export function getTotalAdRevenue(): number {
  return _revenueEvents.reduce((sum, e) => sum + e.revenue, 0);
}

// ─── Stats ───
export function getAdStats() {
  return {
    banner: { ...(_adStates.banner) },
    interstitial: { ...(_adStates.interstitial) },
    rewarded: { ...(_adStates.rewarded) },
    consentStatus: _consentStatus,
    initialized: _sdkInitialized,
  };
}

// ─── Cleanup ───
export function destroyAdMob(): void {
  _sdkInitialized = false;
  _eventListeners.length = 0;
  Object.values(_adStates).forEach(s => {
    s.loaded = false;
    s.loading = false;
    s.failCount = 0;
  });
  console.log("[AdMob] SDK destroyed");
}
