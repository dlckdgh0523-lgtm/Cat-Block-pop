// ─── Network Utilities for High Traffic Resilience ───
// Shared caching, throttling, retry logic for all SDK calls

// ─── In-Memory Cache with TTL ───
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const _cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = _cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    _cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache<T>(key: string, data: T, ttlMs: number = 60000): void {
  _cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

export function invalidateCache(key: string): void {
  _cache.delete(key);
}

export function invalidateCacheByPrefix(prefix: string): void {
  for (const key of _cache.keys()) {
    if (key.startsWith(prefix)) _cache.delete(key);
  }
}

// ─── Request Throttle (prevent duplicate rapid calls) ───
const _pendingRequests = new Map<string, Promise<unknown>>();

export function throttleRequest<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = _pendingRequests.get(key) as Promise<T> | undefined;
  if (existing) {
    console.log(`[Throttle] Deduplicating request: ${key}`);
    return existing;
  }

  const promise = fn().finally(() => {
    _pendingRequests.delete(key);
  });

  _pendingRequests.set(key, promise);
  return promise;
}

// ─── Retry with Exponential Backoff ───
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {},
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, onRetry } = options;

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt) + Math.random() * 500, maxDelay);
        onRetry?.(attempt + 1, err);
        console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries}, waiting ${Math.round(delay)}ms`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// ─── Rate Limiter (per-second) ───
interface RateLimitState {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number; // tokens per second
}

const _rateLimiters = new Map<string, RateLimitState>();

export function checkRateLimit(key: string, maxPerSecond: number = 5): boolean {
  const now = Date.now();
  let state = _rateLimiters.get(key);

  if (!state) {
    state = { tokens: maxPerSecond, lastRefill: now, maxTokens: maxPerSecond, refillRate: maxPerSecond };
    _rateLimiters.set(key, state);
  }

  // Refill tokens
  const elapsed = (now - state.lastRefill) / 1000;
  state.tokens = Math.min(state.maxTokens, state.tokens + elapsed * state.refillRate);
  state.lastRefill = now;

  if (state.tokens < 1) {
    console.warn(`[RateLimit] Rate limited: ${key}`);
    return false;
  }

  state.tokens -= 1;
  return true;
}

// ─── Connection Quality Monitor ───
let _connectionQuality: "good" | "degraded" | "offline" = "good";
let _lastPingTime = 0;

export function getConnectionQuality() {
  return _connectionQuality;
}

export function updateConnectionQuality(latencyMs: number): void {
  _lastPingTime = latencyMs;
  if (latencyMs < 500) _connectionQuality = "good";
  else if (latencyMs < 2000) _connectionQuality = "degraded";
  else _connectionQuality = "offline";
}

// Check online status
if (typeof window !== "undefined") {
  window.addEventListener("online", () => { _connectionQuality = "good"; });
  window.addEventListener("offline", () => { _connectionQuality = "offline"; });
}

// ─── Batch Request Queue (for high traffic) ───
interface QueuedRequest<T> {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

const _requestQueue: QueuedRequest<unknown>[] = [];
let _processingQueue = false;
const MAX_CONCURRENT = 3;
let _activeRequests = 0;

export function enqueueRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    _requestQueue.push({ fn, resolve: resolve as (v: unknown) => void, reject });
    processQueue();
  });
}

async function processQueue() {
  if (_processingQueue) return;
  _processingQueue = true;

  while (_requestQueue.length > 0 && _activeRequests < MAX_CONCURRENT) {
    const req = _requestQueue.shift()!;
    _activeRequests++;
    req.fn()
      .then(req.resolve)
      .catch(req.reject)
      .finally(() => {
        _activeRequests--;
        processQueue();
      });
  }

  _processingQueue = false;
}
