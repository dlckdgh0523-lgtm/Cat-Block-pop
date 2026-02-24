import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ─── Helpers ───
function getServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

function getAnonClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// Extract and verify user from Authorization header
async function getAuthUser(c: any): Promise<{ id: string; email?: string } | null> {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    console.log("[Auth] No Authorization header");
    return null;
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    console.log("[Auth] No token in Authorization header");
    return null;
  }

  try {
    const supabase = getServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user?.id) {
      console.log("[Auth] Token verification failed:", error?.message || "no user");
      return null;
    }

    return { id: user.id, email: user.email };
  } catch (err) {
    console.log("[Auth] Token verification error:", err);
    return null;
  }
}

// Health check endpoint
app.get("/make-server-05e0e5ed/health", (c) => {
  return c.json({ status: "ok" });
});

// ─── Auth: Sign Up ───
// Service Role Key로 사용자 생성 (email_confirm: true로 이메일 확인 스킵)
app.post("/make-server-05e0e5ed/auth/signup", async (c) => {
  try {
    const { email, password, nickname } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "이메일과 비밀번호를 입력해주세요." }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: "비밀번호는 6자 이상이어야 합니다." }, 400);
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: nickname || "Player" },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log("[Auth] Sign up error:", error.message);
      if (error.message.includes("already been registered")) {
        return c.json({ error: "이미 가입된 이메일입니다." }, 409);
      }
      return c.json({ error: `회원가입 실패: ${error.message}` }, 400);
    }

    // Initialize user profile in KV store
    const userId = data.user.id;
    await kv.set(`user_profile:${userId}`, {
      nickname: nickname || "Player",
      score: 0,
      stars: 0,
      createdAt: new Date().toISOString(),
    });

    console.log("[Auth] User created:", email, userId);
    return c.json({ success: true, user: { id: userId, email } });
  } catch (err) {
    console.log("[Auth] Sign up server error:", err);
    return c.json({ error: `서버 오류: ${err}` }, 500);
  }
});

// ─── Profile: Get My Profile (인증 필요) ───
app.get("/make-server-05e0e5ed/profile/me", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "인증이 필요합니다. (Unauthorized)" }, 401);
  }

  try {
    const profile = await kv.get(`user_profile:${user.id}`);
    if (!profile) {
      return c.json({ score: 0, stars: 0, nickname: "Player" });
    }
    return c.json(profile);
  } catch (err) {
    console.log("[Profile] Get profile error:", err);
    return c.json({ error: `프로필 조회 실패: ${err}` }, 500);
  }
});

// ─── Profile: Sync Score (인증 필요) ───
app.post("/make-server-05e0e5ed/profile/score", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "인증이 필요합니다. (Unauthorized)" }, 401);
  }

  try {
    const { score, stars, nickname } = await c.req.json();

    // Get existing profile
    const existing = await kv.get(`user_profile:${user.id}`) || {};

    // Only update if new score is higher (or first time)
    const updatedProfile = {
      ...existing,
      nickname: nickname || existing.nickname || "Player",
      score: Math.max(score || 0, existing.score || 0),
      stars: Math.max(stars || 0, existing.stars || 0),
      lastUpdated: new Date().toISOString(),
    };

    await kv.set(`user_profile:${user.id}`, updatedProfile);

    // Also update leaderboard entry for ranking
    await kv.set(`leaderboard:${user.id}`, {
      userId: user.id,
      nickname: updatedProfile.nickname,
      score: updatedProfile.score,
      stars: updatedProfile.stars,
      lastUpdated: updatedProfile.lastUpdated,
    });

    console.log("[Profile] Score synced for:", user.id, "score:", updatedProfile.score);
    return c.json({ success: true, profile: updatedProfile });
  } catch (err) {
    console.log("[Profile] Score sync error:", err);
    return c.json({ error: `점수 동기화 실패: ${err}` }, 500);
  }
});

// ─── Profile: Update Nickname (인증 필요) ───
app.put("/make-server-05e0e5ed/profile/nickname", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "인증이 필요합니다. (Unauthorized)" }, 401);
  }

  try {
    const { nickname } = await c.req.json();
    if (!nickname || nickname.trim().length === 0) {
      return c.json({ error: "닉네임을 입력해주세요." }, 400);
    }

    const existing = await kv.get(`user_profile:${user.id}`) || {};
    const updated = { ...existing, nickname: nickname.trim() };
    await kv.set(`user_profile:${user.id}`, updated);

    // Update leaderboard entry too
    const leaderboardEntry = await kv.get(`leaderboard:${user.id}`);
    if (leaderboardEntry) {
      await kv.set(`leaderboard:${user.id}`, { ...leaderboardEntry, nickname: nickname.trim() });
    }

    return c.json({ success: true, nickname: nickname.trim() });
  } catch (err) {
    console.log("[Profile] Nickname update error:", err);
    return c.json({ error: `닉네임 변경 실패: ${err}` }, 500);
  }
});

// ─── Leaderboard: Get Top Players (공개) ───
app.get("/make-server-05e0e5ed/leaderboard", async (c) => {
  try {
    const entries = await kv.getByPrefix("leaderboard:");
    // Sort by score descending
    const sorted = entries
      .filter((e: any) => e && typeof e.score === "number")
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 50)
      .map((e: any, i: number) => ({
        ...e,
        rank: i + 1,
      }));

    return c.json({ leaderboard: sorted });
  } catch (err) {
    console.log("[Leaderboard] Error:", err);
    return c.json({ error: `리더보드 조회 실패: ${err}` }, 500);
  }
});

// ─── Token Info (디버그용, 인증 필요) ───
app.get("/make-server-05e0e5ed/auth/token-info", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "인증이 필요합니다." }, 401);
  }

  return c.json({
    userId: user.id,
    email: user.email,
    message: "토큰이 유효합니다. Supabase Auth가 자동으로 JWT를 관리합니다.",
  });
});

Deno.serve(app.fetch);
