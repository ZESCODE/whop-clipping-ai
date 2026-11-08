import { NextRequest, NextResponse } from "next/server";
import { fetchCreatorOverview } from "@/lib/creator";

/** GET /api/creator?company_id=biz_… — bounties + submission queues + payout totals. */
export async function GET(request: NextRequest) {
	const companyId = request.nextUrl.searchParams.get("company_id");
	if (!companyId) {
		return NextResponse.json({ error: "company_id is required" }, { status: 400 });
	}
	try {
		const overview = await fetchCreatorOverview(companyId);
		return NextResponse.json(overview);
	} catch (e: any) {
		return NextResponse.json({ error: String(e?.message || e) }, { status: 502 });
	}
}
