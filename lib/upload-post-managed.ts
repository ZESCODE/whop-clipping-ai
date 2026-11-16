import "server-only";

import { whopsdk } from "./whop-sdk";

/**
 * Managed Upload-Post mode (an "included in your plan" alternative to BYOK).
 *
 * Off by default. When `UPLOAD_POST_MANAGED_ENABLED` is truthy, the server
 * holds one Upload-Post account key and gives every entitled Whop user their
 * own profile inside it, so the publishing pages work without the user pasting
 * a key.
 *
 * Before this is turned on in production two things must be true:
 *   1. a reseller / white-label agreement with Upload-Post — their ToS forbids
 *      reselling API access (or sharing keys with third parties) without one;
 *   2. the caller's `x-whop-user-token` is verified against Whop, which is what
 *      `resolveManagedEntitlement` does below.
 *
 * Feature flag: `UPLOAD_POST_MANAGED_ENABLED` (already wired). Entitlement
 * check: `UPLOAD_POST_ENTITLEMENT_EXPERIENCE_ID` — when set, the user must hold
 * access to that experience; when unset, any verified Whop user is entitled
 * (useful for a single paid community).
 */
export const MANAGED_ENABLED =
	process.env.UPLOAD_POST_MANAGED_ENABLED === "1" ||
	process.env.UPLOAD_POST_MANAGED_ENABLED?.toLowerCase() === "true";

export const MANAGED_KEY = process.env.UPLOAD_POST_MANAGED_API_KEY?.trim() || "";

// Single-tenant override: pin one profile instead of deriving per user.
const FIXED_PROFILE = process.env.UPLOAD_POST_MANAGED_PROFILE?.trim() || "";

// Optional entitlement gate: the experience a paid member must have access to.
const ENTITLEMENT_EXPERIENCE_ID =
	process.env.UPLOAD_POST_ENTITLEMENT_EXPERIENCE_ID?.trim() || "";

export function profileForUser(userId: string): string {
	const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
	return `wa_${safe || "anon"}`;
}

/** Decodes (does not verify) the Whop iframe token's subject. */
export function userFromWhopToken(token: string | null | undefined): string | null {
	if (!token) return null;
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	try {
		const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as Record<
			string,
			unknown
		>;
		const subject = payload.sub ?? payload.user_id ?? payload.userId;
		return typeof subject === "string" && subject ? subject : null;
	} catch {
		return null;
	}
}

export type ManagedResult =
	| { ok: true; profile: string; userId: string | null }
	| { ok: false; reason: "disabled" | "no_session" | "forbidden" };

/**
 * Resolve the Upload-Post profile the caller is entitled to.
 *
 * Order:
 *   1. feature flag off        → disabled
 *   2. pinned profile (dev)    → that profile, no token required
 *   3. verify the Whop token   → real JWKS check via the Whop SDK
 *   4. optional access check   → `has_access` on the configured experience
 *   5. derive `wa_<userId>`    → provision later with `ensureProfile`
 */
export async function resolveManagedEntitlement(requestHeaders: Headers): Promise<ManagedResult> {
	if (!MANAGED_ENABLED) return { ok: false, reason: "disabled" };
	if (FIXED_PROFILE) return { ok: true, profile: FIXED_PROFILE, userId: null };

	let userId: string;
	try {
		({ userId } = await whopsdk.verifyUserToken(requestHeaders));
	} catch {
		return { ok: false, reason: "no_session" };
	}
	if (!userId) return { ok: false, reason: "no_session" };

	if (ENTITLEMENT_EXPERIENCE_ID) {
		try {
			const access = await whopsdk.users.checkAccess(ENTITLEMENT_EXPERIENCE_ID, { id: userId });
			if (!access?.has_access) return { ok: false, reason: "forbidden" };
		} catch {
			return { ok: false, reason: "forbidden" };
		}
	}

	return { ok: true, profile: profileForUser(userId), userId };
}

/** Back-compat wrapper: only the profile, or null when not entitled. */
export async function managedProfileForRequest(requestHeaders: Headers): Promise<string | null> {
	const result = await resolveManagedEntitlement(requestHeaders);
	return result.ok ? result.profile : null;
}
