import { NextRequest, NextResponse } from "next/server";
import { MANAGED_KEY, resolveManagedEntitlement } from "@/lib/upload-post-server";

/**
 * GET /api/social/connect — start the Upload-Post connect flow.
 *
 * Creates (once) the profile that holds this app's social accounts, asks
 * Upload-Post for a branded, 48-hour connect link, and redirects the visitor
 * to it. The link opens Upload-Post's own page, where each network runs its
 * normal OAuth screen, so no password passes through us.
 *
 * Requires UPLOAD_POST_API_KEY on the server. Without it the route sends the
 * visitor to the plain signup page instead of failing.
 */
const UPLOAD_POST_API = "https://api.upload-post.com/api";
const PREFERRED_PROFILE = process.env.UPLOAD_POST_PROFILE?.trim() || "default";
const PLATFORMS = ["tiktok", "instagram", "youtube", "linkedin", "facebook", "x"];
// Where a visitor goes when we cannot connect them here: no key on the server,
// a plan that will not give us another profile, or an upstream failure. Point
// NEXT_PUBLIC_UPLOAD_POST_AFFILIATE_URL at the tracked link once the affiliate
// account is approved; until then this is the plain signup page.
const AFFILIATE_URL =
	process.env.NEXT_PUBLIC_UPLOAD_POST_AFFILIATE_URL?.trim() ||
	"https://app.upload-post.com?source=clipping-ai";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

export const dynamic = "force-dynamic";

function rateLimited(ip: string): boolean {
	const now = Date.now();
	const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
	if (recent.length >= MAX_PER_WINDOW) {
		hits.set(ip, recent);
		return true;
	}
	recent.push(now);
	hits.set(ip, recent);
	return false;
}

type ProfileList = { profiles?: { username?: string }[] };

async function listProfiles(key: string): Promise<string[]> {
	const res = await fetch(`${UPLOAD_POST_API}/uploadposts/users`, {
		headers: { Authorization: `ApiKey ${key}` },
		cache: "no-store",
	});
	if (!res.ok) return [];
	const data = (await res.json().catch(() => ({}))) as ProfileList;
	return (data.profiles || []).map((p) => p.username).filter((n): n is string => !!n);
}

/**
 * Pick the profile to connect into: the configured one when it exists, else
 * the first profile on the account. Plans cap the number of profiles, so a
 * missing one is not an error — fall back instead of failing the redirect.
 */
async function resolveProfile(key: string): Promise<string> {
	const existing = await listProfiles(key);
	if (existing.includes(PREFERRED_PROFILE)) return PREFERRED_PROFILE;
	if (existing.length > 0) return existing[0];

	const res = await fetch(`${UPLOAD_POST_API}/uploadposts/users`, {
		method: "POST",
		headers: { Authorization: `ApiKey ${key}`, "Content-Type": "application/json" },
		body: JSON.stringify({ username: PREFERRED_PROFILE }),
		cache: "no-store",
	});
	if (!res.ok) {
		const retry = await listProfiles(key);
		if (retry.length > 0) return retry[0];
		throw new Error(`profile_${res.status}`);
	}
	const data = (await res.json().catch(() => ({}))) as ProfileList;
	return data.profiles?.[0]?.username || PREFERRED_PROFILE;
}

export async function GET(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
	if (rateLimited(ip)) {
		return NextResponse.redirect(new URL("/user?connect=rate", request.url), 302);
	}

	// Managed mode: connect into the caller's own (verified, entitled) profile
	// inside the shared account.
	const entitlement = await resolveManagedEntitlement(request.headers);
	const managedProfile = entitlement.ok ? entitlement.profile : null;
	const key = managedProfile ? MANAGED_KEY : process.env.UPLOAD_POST_API_KEY || "";
	if (!key || (managedProfile && !MANAGED_KEY)) {
		return NextResponse.redirect(AFFILIATE_URL, 302);
	}

	const asked = (request.nextUrl.searchParams.get("platform") || "").trim().toLowerCase();
	const platform = PLATFORMS.includes(asked) ? asked : "";

	const origin = request.nextUrl.origin;
	const logo = `${origin}/logo-clippingai.svg`;
	const redirect = `${origin}/app`;

	try {
		const profile = managedProfile || (await resolveProfile(key));

		// Straight to one network: ask the Connect API for that platform's
		// consent URL and redirect there, skipping the chooser page.
		if (platform) {
			const start = await fetch(
				`${UPLOAD_POST_API}/uploadposts/oauth/${platform}/start`,
				{
					method: "POST",
					headers: { Authorization: `ApiKey ${key}`, "Content-Type": "application/json" },
					body: JSON.stringify({ profile, redirect_url: `${origin}/app` }),
					cache: "no-store",
				},
			);
			const data = (await start.json().catch(() => ({}))) as { authorize_url?: string };
			if (start.ok && data?.authorize_url?.startsWith("https://")) {
				return NextResponse.redirect(data.authorize_url, 302);
			}
			return NextResponse.redirect(new URL("/user?connect=failed", request.url), 302);
		}
		const res = await fetch(`${UPLOAD_POST_API}/uploadposts/users/generate-jwt`, {
			method: "POST",
			headers: { Authorization: `ApiKey ${key}`, "Content-Type": "application/json" },
			body: JSON.stringify({
				username: profile,
				logo_image: logo,
				connect_title: "Connect your accounts to Clipping AI",
				connect_description: "Link the channels we will publish your clips to.",
				redirect_url: redirect,
				redirect_button_text: "Back to Clipping AI",
				platforms: PLATFORMS,
				connect_theme: "dark",
				show_calendar: true,
			}),
			cache: "no-store",
		});
		if (!res.ok) {
			return NextResponse.redirect(AFFILIATE_URL, 302);
		}
		const data = await res.json();
		const accessUrl = (data?.access_url || data?.accessUrl || "") as string;
		if (!accessUrl.startsWith("https://")) {
			return NextResponse.redirect(AFFILIATE_URL, 302);
		}
		return NextResponse.redirect(accessUrl, 302);
	} catch {
		return NextResponse.redirect(AFFILIATE_URL, 302);
	}
}
