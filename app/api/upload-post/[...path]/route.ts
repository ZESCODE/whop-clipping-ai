import { NextRequest, NextResponse } from "next/server";
import {
	MANAGED_ENABLED as MANAGED,
	MANAGED_KEY,
	resolveManagedEntitlement,
} from "@/lib/upload-post-server";

/**
 * Read-only proxy for Upload-Post.
 *
 * BYOK (default): the visitor's own key arrives in `x-upload-post-key` and is
 * attached as `Authorization: ApiKey …`. Nothing is stored.
 *
 * Managed (`UPLOAD_POST_MANAGED_ENABLED=1`): the server key is used and the
 * path is narrowed to the caller's own verified profile — so
 * `/uploadposts/users` returns only their profile, `/analytics/…` and
 * `/uploadposts/schedule` are pinned to it.
 *
 * GET only: posting stays in the dashboard.
 */
const UPLOAD_POST_API = "https://api.upload-post.com/api";

type Context = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: Context) {
	const { path: rawPath } = await context.params;
	const path = [...rawPath];

	const userKey = (request.headers.get("x-upload-post-key") || "").trim();
	const entitlement = await resolveManagedEntitlement(request.headers);

	if (MANAGED && !entitlement.ok) {
		return NextResponse.json(
			{ error: entitlement.reason === "forbidden" ? "not_entitled" : "no_whop_session" },
			{ status: entitlement.reason === "forbidden" ? 403 : 401 },
		);
	}

	const managedProfile = entitlement.ok ? entitlement.profile : null;
	const key = MANAGED ? MANAGED_KEY : userKey;
	if (!key) {
		return NextResponse.json({ error: "missing_key" }, { status: 400 });
	}
	if (request.method !== "GET") {
		return NextResponse.json({ error: "read_only" }, { status: 405 });
	}

	// Narrow the path to the caller's own profile in managed mode.
	if (managedProfile) {
		if (path[0] === "uploadposts" && path[1] === "users" && path.length === 2) {
			path.push(managedProfile);
		} else if (path[0] === "analytics") {
			path[1] = managedProfile;
		}
	}

	const search = request.nextUrl.searchParams;
	if (managedProfile && path[0] === "uploadposts" && path[1] === "schedule") {
		search.set("username", managedProfile);
	}
	const query = search.toString();
	const url = `${UPLOAD_POST_API}/${path.map(encodeURIComponent).join("/")}${query ? `?${query}` : ""}`;

	try {
		const upstream = await fetch(url, {
			headers: { Authorization: `ApiKey ${key}`, Accept: "application/json" },
			cache: "no-store",
			signal: AbortSignal.timeout(45_000),
		});
		let body = await upstream.text();
		let contentType = upstream.headers.get("content-type") || "application/json";

		// /uploadposts/users/{profile} answers {profile:…}; the client expects the
		// list shape it gets from /uploadposts/users, so wrap it here.
		if (
			managedProfile &&
			path[0] === "uploadposts" &&
			path[1] === "users" &&
			path.length === 3
		) {
			try {
				const parsed = JSON.parse(body);
				body = JSON.stringify(
					parsed?.profile ? { success: true, profiles: [parsed.profile] } : parsed,
				);
				contentType = "application/json";
			} catch {
				/* not JSON — pass through */
			}
		}

		return new NextResponse(body, {
			status: upstream.status,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "upstream_unreachable", detail: String(error).slice(0, 200) },
			{ status: 502 },
		);
	}
}

export async function GET(request: NextRequest, context: Context) {
	return handle(request, context);
}

export async function POST(request: NextRequest, context: Context) {
	return handle(request, context);
}
