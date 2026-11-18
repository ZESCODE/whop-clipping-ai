/**
 * Base URL of the Clipping AI backend that /api/* proxies to.
 *
 * CLIPPINGAI_API_URL is the current name, OPENSHORTS_API_URL the legacy one.
 * Both are stored as write-only secrets in Vercel, so they cannot be read back
 * or migrated through the API — which makes a wrong value here a silent
 * outage. Two failure modes are worth naming, because both have happened:
 *
 *  - a name that is never read (…_API_KEY spellings) sends every route to
 *    localhost and answers 502, so those spellings are accepted too;
 *  - a value that points back at this site makes the proxy call itself until
 *    the platform kills it with a 508, so a self-referential value is refused.
 *
 * Only values that look like an http(s) base URL are accepted at all, so a real
 * API key pasted under a *_API_KEY name can never be mistaken for a hostname.
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

/** Hostnames that would make a proxy request come straight back here. */
const selfHostnames = (request?: Request): Set<string> => {
	const names = new Set<string>();
	// VERCEL_URL and VERCEL_PROJECT_PRODUCTION_URL are bare hostnames, while
	// request.url and NEXT_PUBLIC_SITE_URL are absolute, so accept both.
	const add = (value: string | undefined) => {
		if (!value) return;
		const candidate = value.trim();
		if (!candidate) return;
		const hostname = /^https?:\/\//i.test(candidate)
			? new URL(candidate).hostname
			: candidate.split("/")[0].split(":")[0];
		if (hostname) names.add(hostname.toLowerCase());
	};
	if (request) {
		add(request.url);
		const host = request.headers.get("host");
		if (host) names.add(host.toLowerCase());
	}
	add(process.env.VERCEL_URL);
	add(process.env.VERCEL_PROJECT_PRODUCTION_URL);
	add(process.env.NEXT_PUBLIC_SITE_URL);
	return names;
};

export const backendUrl = (request?: Request): string => {
	const self = selfHostnames(request);
	for (const name of CANDIDATES) {
		const resolved = asBaseUrl(process.env[name]);
		if (!resolved) continue;
		try {
			if (self.has(new URL(resolved).hostname.toLowerCase())) continue;
		} catch {
			continue;
		}
		return resolved;
	}
	return FALLBACK;
};