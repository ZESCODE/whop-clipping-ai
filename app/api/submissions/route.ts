import { NextRequest, NextResponse } from "next/server";
import { submitToBounty } from "@/lib/bounties";

/** POST /api/submissions { bounty_id, urls[], caption? } */
export async function POST(request: NextRequest) {
	const body = await request.json().catch(() => ({}));
	const bountyId = String(body.bounty_id || "");
	const urls: string[] = Array.isArray(body.urls)
		? body.urls.filter((u: unknown) => typeof u === "string" && u.startsWith("/api/media"))
		: [];
	if (!bountyId) {
		return NextResponse.json({ error: "bounty_id is required" }, { status: 400 });
	}
	if (urls.length === 0) {
		return NextResponse.json({ error: "at least one deliverable url is required" }, { status: 400 });
	}
	try {
		// Deliverables must be absolute, publicly reachable URLs for the reviewer.
		const origin = request.nextUrl.origin;
		const absolute = urls.map((u) => (u.startsWith("http") ? u : `${origin}${u}`));
		const submission = await submitToBounty(bountyId, absolute, body.caption);
		return NextResponse.json({ submission }, { status: 201 });
	} catch (e: any) {
		return NextResponse.json({ error: String(e?.message || e) }, { status: 502 });
	}
}
