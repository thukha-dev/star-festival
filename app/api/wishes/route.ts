import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { localizedAnonymous, MAX_WISH_LENGTH } from "@/lib/constants";
import { moderateWish } from "@/lib/moderation/moderate";
import { isRateLimited } from "@/lib/rate-limit";
import { mapWishRow, type WishRow } from "@/lib/supabase/map-row";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { wishSchema } from "@/lib/validation/wish";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const isDev = process.env.NODE_ENV !== "production";

function getRequestKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `${ip}:${request.method}`;
}

export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SERVICE_ROLE_KEY configuration" },
      { status: 503 }
    );
  }

  if (isRateLimited(getRequestKey(request))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = wishSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  if (input.wishText.length > MAX_WISH_LENGTH) {
    return NextResponse.json({ error: "Wish must be 120 characters or fewer" }, { status: 400 });
  }

  const moderation = moderateWish(input);
  const nickname = input.nickname || localizedAnonymous[input.language];

  const client = createServiceSupabaseClient();
  const { data, error } = await client
    .from("wishes")
    .insert({
      wish_text: input.wishText,
      nickname,
      nickname_is_default: !input.nickname,
      color: input.color,
      language: input.language,
      status: moderation.approved ? "approved" : "rejected",
      moderation_reason: moderation.reason ?? null,
      approved_at: moderation.approved ? new Date().toISOString() : null
    })
    .select("id, wish_text, nickname, nickname_is_default, color, language, status, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        error: "Failed to save wish",
        details: isDev ? { message: error?.message, code: error?.code, hint: error?.hint } : undefined
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ wish: mapWishRow(data as WishRow) }, { status: 201 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawLimit = Number(url.searchParams.get("limit") || DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT) : DEFAULT_LIMIT;
  const before = url.searchParams.get("before");

  const urlKey = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!urlKey || !publicKey) {
    return NextResponse.json(
      { error: "Server is missing NEXT_PUBLIC_SUPABASE_URL or public Supabase key configuration" },
      { status: 503 }
    );
  }

  const client = createClient(urlKey, publicKey);
  let query = client
    .from("wishes")
    .select("id, wish_text, nickname, nickname_is_default, color, language, status, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (before) {
    query = query.lt("created_at", before);
  }

  const { data, error } = await query;

  if (error || !data) {
    return NextResponse.json(
      {
        error: "Failed to fetch wishes",
        details: isDev ? { message: error?.message, code: error?.code, hint: error?.hint } : undefined
      },
      { status: 500 }
    );
  }

  const wishes = (data as WishRow[]).map(mapWishRow);
  const nextCursor = wishes.length ? wishes[wishes.length - 1]?.createdAt ?? null : null;

  return NextResponse.json({ wishes, nextCursor });
}
