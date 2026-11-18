import { NextRequest, NextResponse } from "next/server";
import {
	MANAGED_ENABLED,
	MANAGED_KEY,
	resolveManagedEntitlement,
} from "@/lib/upload-post-server";

/**
 * GET /api/social/analytics?user=<profile>&platforms=youtube,instagram
 *
 * Read-only numbers for one Upload-Post profile: followers, impressions and
 * engagement per platform. Same contract as the Clipping AI backend route, so
 * the dashboard can render it on either host.
 *
 * Upstream numbers lag (YouTube settles for a day or two) and some platforms
 * report zeros for reach, so the UI labels the figures with the day they were
 * read.
 */
const UPLOAD_POST_API = "https://api.upload-post.com/api";
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
	const now = Date.now();
	const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
	if (recent.length >= MAX_PER_WINDOW) {
		hits.set(ip, recent);
		return true;
	}
	recent.push(now);
	hits.set(ip, recent);
	if (hits.size > 500) {
		for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k);
	}
	return false;
}

export async function GET(request: NextRequest) {
	// A key supplied by the caller is used as-is (BYOK); the managed path needs
	// a verified, entitled Whop session and is pinned to the caller's profile.
	const userKey = (request.headers.get("x-upload-post-key") || "").trim();
	const entitlement = await resolveManagedEntitlement(request.headers);

	if (MANAGED_ENABLED) {
		if (!entitlement.ok) {
			return NextResponse.json(
				{ error: entitlement.reason === "forbidden" ? "not_entitled" : "no_whop_session" },
				{ status: entitlement.reason === "forbidden" ? 403 : 401 },
			);
		}
	}

	if (!userKey && !MANAGED_ENABLED && process.env.NODE_ENV === "production" && !request.headers.get("x-whop-user-token")) {
		// Outside the Whop iframe there is no session to read this for. Answer
		// empty rather than 401 so a direct visit does not log a console error;
		// the card simply hides.
		return NextResponse.json({ configured: false, profiles: [], metrics: {} });
	}

	const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
	if (rateLimited(ip)) {
		return NextResponse.json({ error: "rate_limited" }, { status: 429 });
	}

	const key = entitlement.ok ? MANAGED_KEY : userKey || process.env.UPLOAD_POST_API_KEY || "";
	if (!key) {
		return NextResponse.json({ configured: false, metrics: {} });
	}

	const user = entitlement.ok
		? entitlement.profile
		: request.nextUrl.searchParams.get("user")?.trim();
	if (!user) {
		return NextResponse.json({ error: "user_required" }, { status: 400 });
	}
	const platforms = (request.nextUrl.searchParams.get("platforms") || "youtube")
		.split(",")
		.map((p) => p.trim())
		.filter(Boolean)
		.join(",");

	try {
		const url = `${UPLOAD_POST_API}/analytics/${encodeURIComponent(user)}?platforms=${encodeURIComponent(platforms)}`;
		const res = await fetch(url, {
			headers: { Authorization: `ApiKey ${key}` },
			cache: "no-store",
		});
		if (!res.ok) {
			return NextResponse.json(
				{ configured: true, metrics: {}, error: `upstream_${res.status}` },
				{ status: 200 },
			);
		}
		const data = await res.json();
		const metrics: Record<string, unknown> = {};
		for (const [platform, value] of Object.entries(data || {})) {
			if (value && typeof value === "object") {
				const v = value as Record<string, unknown>;
				metrics[platform] = {
					followers: v.followers ?? null,
					impressions: v.impressions ?? null,
					likes: v.likes ?? null,
					comments: v.comments ?? null,
					shares: v.shares ?? null,
				};
			}
		}
		return NextResponse.json(
			{ configured: true, user, metrics, as_of: new Date().toISOString() },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch {
		return NextResponse.json({ configured: true, metrics: {}, error: "unreachable" });
	}
}
