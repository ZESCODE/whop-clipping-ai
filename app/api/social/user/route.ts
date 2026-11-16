import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/social/user — the connected Upload-Post profiles behind the app.
 *
 * Three modes:
 *   - managed (UPLOAD_POST_MANAGED_ENABLED=1): the server key, narrowed to the
 *     caller's own profile, created on first use. Returns `managed: true` so
 *     the UI knows no key is needed.
 *   - BYOK: `x-upload-post-key` from the visitor.
 *   - server key: only inside the Whop iframe (legacy path).
 */
import {
	MANAGED_ENABLED,
	MANAGED_KEY,
	ensureProfile,
	resolveManagedEntitlement,
} from "@/lib/upload-post-server";

const UPLOAD_POST_API = "https://api.upload-post.com/api";
const PLATFORM_KEYS = ["tiktok", "instagram", "youtube", "linkedin", "facebook", "x"] as const;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	const userKey = (request.headers.get("x-upload-post-key") || "").trim();
	const entitlement = await resolveManagedEntitlement(request.headers);
	const managedProfile = entitlement.ok ? entitlement.profile : null;

	if (entitlement.ok === false && entitlement.reason === "forbidden") {
		return NextResponse.json(
			{ configured: false, managed: false, reason: "not_entitled", profiles: [] },
			{ status: 403 },
		);
	}

	if (MANAGED_ENABLED && managedProfile) {
		if (!MANAGED_KEY) {
			return NextResponse.json({ error: "managed_key_missing" }, { status: 503 });
		}
		await ensureProfile(MANAGED_KEY, managedProfile);
		const res = await fetch(`${UPLOAD_POST_API}/uploadposts/users/${encodeURIComponent(managedProfile)}`, {
			headers: { Authorization: `ApiKey ${MANAGED_KEY}` },
			cache: "no-store",
		});
		if (!res.ok) {
			return NextResponse.json(
				{ configured: true, managed: true, profile: managedProfile, profiles: [], error: `upstream_${res.status}` },
				{ status: 200 },
			);
		}
		const data = await res.json().catch(() => ({}));
		const profile = (data as any)?.profile || {};
		const socials = profile.social_accounts || {};
		const connected = [
			...PLATFORM_KEYS.filter((name) => !!socials[name]),
			...Object.keys(socials).filter((name) => !PLATFORM_KEYS.includes(name as any) && !!socials[name]),
		];
		return NextResponse.json({
			configured: true,
			managed: true,
			profile: managedProfile,
			profiles: [{ username: managedProfile, connected }],
			as_of: new Date().toISOString(),
		});
	}

	// Managed mode with no verified session/entitlement must never fall through
	// to the shared server key, or it would expose every managed profile.
	if (MANAGED_ENABLED) {
		return NextResponse.json({ configured: false, managed: true, profiles: [] });
	}

	if (!userKey && process.env.NODE_ENV === "production" && !request.headers.get("x-whop-user-token")) {
		return NextResponse.json({ configured: false, managed: false, profiles: [], metrics: {} });
	}

	const key = userKey || process.env.UPLOAD_POST_API_KEY || "";
	if (!key) {
		return NextResponse.json({ configured: false, managed: false, profiles: [] });
	}

	try {
		const res = await fetch(`${UPLOAD_POST_API}/uploadposts/users`, {
			headers: { Authorization: `ApiKey ${key}` },
			cache: "no-store",
		});
		if (!res.ok) {
			return NextResponse.json(
				{ configured: true, managed: MANAGED_ENABLED, profiles: [], error: `upstream_${res.status}` },
				{ status: 200 },
			);
		}
		const data = await res.json();
		const profiles = (data?.profiles || []).map((p: any) => {
			const socials = p?.social_accounts || {};
			const connected = PLATFORM_KEYS.filter((name) => !!socials[name]);
			return { username: p?.username ?? "", connected };
		});
		return NextResponse.json(
			{ configured: true, managed: MANAGED_ENABLED, profiles, as_of: new Date().toISOString() },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch {
		return NextResponse.json({ configured: true, managed: MANAGED_ENABLED, profiles: [], error: "unreachable" });
	}
}
