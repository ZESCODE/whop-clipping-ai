/**
 * Base URL of the Clipping AI backend that /api/* proxies to.
 *
 * CLIPPINGAI_API_URL is the current name, OPENSHORTS_API_URL the legacy one.
 * Both are stored as write-only secrets in Vercel, so they cannot be read back
 * or migrated through the API — and a variable that is easy to mistype is a
 * silent outage, because every route falls through to localhost and answers
 * 502. The _API_KEY spellings are therefore accepted too, but only when the
 * value actually looks like a base URL: a real API key pasted under one of
 * those names must not be mistaken for a hostname.
 */
const CANDIDATES = [
	"CLIPPINGAI_API_URL",
	"OPENSHORTS_API_URL",
	"CLIPPINGAI_API_KEY",
	"OPENSHORTS_API_KEY",
] as const;

const FALLBACK = "http://127.0.0.1:8000";

const asBaseUrl = (value: string | undefined): string | null => {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	if (!/^https?:\/\//i.test(trimmed)) return null;
	return trimmed.replace(/\/+$/, "");
};

export const backendUrl = (): string => {
	for (const name of CANDIDATES) {
		const resolved = asBaseUrl(process.env[name]);
		if (resolved) return resolved;
	}
	return FALLBACK;
};