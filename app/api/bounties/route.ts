import { NextRequest, NextResponse } from "next/server";
import { fetchOpenBounties } from "@/lib/bounties";

/** GET /api/bounties?company_id=biz_… — open content-rewards bounties. */
export async function GET(request: NextRequest) {
	const companyId = request.nextUrl.searchParams.get("company_id");
	if (!companyId) {
		return NextResponse.json({ error: "company_id is required" }, { status: 400 });
	}
	try {
		const bounties = await fetchOpenBounties(companyId);
		return NextResponse.json({ bounties });
	} catch (e: any) {
		return NextResponse.json({ error: String(e?.message || e) }, { status: 502 });
	}
}
