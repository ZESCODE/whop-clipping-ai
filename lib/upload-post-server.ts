import "server-only";

import {
	MANAGED_ENABLED,
	MANAGED_KEY,
	managedProfileForRequest,
	resolveManagedEntitlement,
} from "./upload-post-managed";

export const UPLOAD_POST_API = "https://api.upload-post.com/api";

export type UpstreamResult = {
	status: number;
	body: string;
	contentType: string;
};

/** One upstream call with either the caller's key or the managed key. */
export async function uploadPostFetch(
	path: string,
	init: { method?: string; body?: string; userKey?: string; profile?: string | null } = {},
): Promise<UpstreamResult> {
	const key = init.userKey?.trim() || (MANAGED_ENABLED ? MANAGED_KEY : "");
	if (!key) {
		return { status: 400, body: JSON.stringify({ error: "missing_key" }), contentType: "application/json" };
	}
	const headers: Record<string, string> = {
		Authorization: `ApiKey ${key}`,
		Accept: "application/json",
	};
	if (init.body) headers["Content-Type"] = "application/json";

	const res = await fetch(`${UPLOAD_POST_API}/${path}`, {
		method: init.method || "GET",
		headers,
		body: init.body,
		cache: "no-store",
		signal: AbortSignal.timeout(45_000),
	});
	const text = await res.text().catch(() => "");
	return { status: res.status, body: text, contentType: res.headers.get("content-type") || "application/json" };
}

/** Create the caller's profile once; a 400/409 means it already exists. */
export async function ensureProfile(key: string, profile: string): Promise<boolean> {
	const res = await fetch(`${UPLOAD_POST_API}/uploadposts/users`, {
		method: "POST",
		headers: { Authorization: `ApiKey ${key}`, "Content-Type": "application/json" },
		body: JSON.stringify({ username: profile }),
		cache: "no-store",
	});
	if (res.ok) return true;
	if (res.status === 400 || res.status === 409) return true;
	return false;
}

export { MANAGED_ENABLED, MANAGED_KEY, managedProfileForRequest, resolveManagedEntitlement };
