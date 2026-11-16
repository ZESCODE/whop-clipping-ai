import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/social/user — the connected Upload-Post profiles behind the app.
 *
 * Read-only mirror of the OpenShorts backend route of the same name, so the
 * dashboard's Publishing tab behaves the same on this host. The key stays
 * server-side; the response carries only profile names and which networks are
 * connected.
 *
 * Inside Whop every same-origin request carries x-whop-user-token, so the
 * route is limited to the iframe in production. Outside production (local
 * dev) the check is skipped.
 */
const UPLOAD_POST_API = "https://api.upload-post.com/api";
const PLATFORM_KEYS = ["tiktok", "instagram", "youtube", "linkedin", "facebook", "x"] as const;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	// A key supplied by the caller is used as-is (BYOK); only the server-key
	// path needs the Whop iframe session.
	const userKey = (request.headers.get("x-upload-post-key") || "").trim();
	if (!userKey && process.env.NODE_ENV === "production" && !request.headers.get("x-whop-user-token")) {
		// Outside the Whop iframe there is no session to read this for. Answer
		// empty rather than 401 so a direct visit does not log a console error;
		// the card simply hides.
		return NextResponse.json({ configured: false, profiles: [], metrics: {} });
	}

	const key = userKey || process.env.UPLOAD_POST_API_KEY || "";
	if (!key) {
		return NextResponse.json({ configured: false, profiles: [] });
	}

	try {
		const res = await fetch(`${UPLOAD_POST_API}/uploadposts/users`, {
			headers: { Authorization: `ApiKey ${key}` },
			cache: "no-store",
		});
		if (!res.ok) {
			return NextResponse.json(
				{ configured: true, profiles: [], error: `upstream_${res.status}` },
				{ status: 200 },
			);
		}
		const data = await res.json();
		const profiles = (data?.profiles || []).map((p: any) => {
			const socials = p?.social_accounts || {};
			const connected = PLATFORM_KEYS.filter((name) => {
				const value = socials[name];
				if (typeof value === "string") return value.length > 0;
				return !!value && typeof value === "object";
			});
			return { username: p?.username ?? "", connected };
		});
		return NextResponse.json(
			{ configured: true, profiles, as_of: new Date().toISOString() },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch {
		return NextResponse.json({ configured: true, profiles: [], error: "unreachable" });
	}
}
