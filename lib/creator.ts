/**
 * Creator-side helpers (server-only): bounties, their submission queues,
 * and payout totals — all via the Whop Current API.
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

async function whopGet(path: string, params: Record<string, string | number> = {}) {
	const url = new URL(`${BASE}${path}`);
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
	const res = await fetch(url, { headers: whopHeaders(), cache: "no-store" });
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(data.message || data.error || `whop ${res.status}`);
	return data;
}

export type CreatorSubmission = {
	id: string;
	status: string;
	created_at?: string;
	deliverable?: {urls?: string[]; caption?: string; file_ids?: string[]};
	user?: {id?: string; username?: string; name?: string};
};

/** Bounties for the account with their submissions grouped in. */
export async function fetchCreatorOverview(accountId: string) {
	const [bountyData, submissions, payouts] = await Promise.all([
		whopGet("/bounties", {account_id: accountId, limit: 50}),
		whopGet("/bounty_submissions", {account_id: accountId, limit: 100}),
		whopGet("/payouts", {account_id: accountId, limit: 50}).catch(() => ({data: []})),
	]);

	const bounties: any[] = bountyData.data || [];
	const byBounty = new Map<string, CreatorSubmission[]>();
	for (const s of submissions.data || []) {
		const list = byBounty.get(s.bounty_id) || [];
		list.push({
			id: s.id,
			status: s.status || s.state || "submitted",
			created_at: s.created_at,
			deliverable: s.deliverable,
			user: s.user,
		});
		byBounty.set(s.bounty_id, list);
	}

	return {
		bounties: bounties.map((b) => ({
			id: b.id,
			title: b.title || b.name || b.id,
			reward: b.reward ?? b.amount ?? null,
			state: b.state || b.status,
			submissions: byBounty.get(b.id) || [],
		})),
		payouts: {
			total: (payouts.data || []).reduce(
				(sum: number, p: any) => sum + (Number(p.amount) || 0),
				0,
			),
			count: (payouts.data || []).length,
		},
	};
}
