/**
 * Whop Current-API helpers (server-only). The @whop/sdk app resource does not
 * yet expose bounties, so these hit api.whop.com/api/v1 directly with the
 * account API key.
 */
const BASE = process.env.WHOP_API_BASE || "https://api.whop.com/api/v1";
const VERSION = process.env.WHOP_API_VERSION_DATE || "2026-11-04-1";

function whopHeaders(): HeadersInit {
	const key = process.env.WHOP_API_KEY;
	if (!key) throw new Error("WHOP_API_KEY is not configured");
	return {
		Authorization: `Bearer ${key}`,
		"Api-Version-Date": VERSION,
	};
}

/** Open content bounties a clipper can submit to, for one company. */
export async function fetchOpenBounties(companyId: string) {
	const url = new URL(`${BASE}/bounties`);
	url.searchParams.set("account_id", companyId);
	url.searchParams.set("limit", "20");
	const res = await fetch(url, { headers: whopHeaders(), cache: "no-store" });
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error(data.message || data.error || `whop ${res.status}`);
	}
	const rows: any[] = data.data || [];
	const open = rows.filter((b) => b.state === "open" || b.status === "open");
	return open.length ? open : rows;
}

/** Submit a clip deliverable to a bounty. */
export async function submitToBounty(bountyId: string, urls: string[], caption?: string) {
	const res = await fetch(`${BASE}/bounty_submissions`, {
		method: "POST",
		headers: {...whopHeaders(), "Content-Type": "application/json"},
		body: JSON.stringify({
			bounty_id: bountyId,
			deliverable: {urls, caption: caption || "Made with Clipping AI"},
		}),
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error(data.message || data.detail || data.error || `whop ${res.status}`);
	}
	return data;
}
