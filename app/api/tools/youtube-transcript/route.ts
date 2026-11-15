import { NextRequest, NextResponse } from "next/server";

/**
 * Free-tool proxy → OpenShorts API (:8000 by default).
 *
 * GET /api/tools/youtube-transcript?url=<video-url>&lang=<optional>
 *   → the captions a YouTube video already carries, as text + VTT.
 *
 * Same shape the upstream dashboard's Vite proxy used; the URL stays
 * server-side so the browser only ever talks to this origin.
 */
const OPENSHORTS = process.env.OPENSHORTS_API_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const upstream = new URL(`${OPENSHORTS}/api/tools/youtube-transcript`);
	searchParams.forEach((value, key) => upstream.searchParams.set(key, value));

	try {
		const res = await fetch(upstream, { method: "GET" });
		const data = await res.json().catch(() => ({ detail: "invalid response" }));
		return NextResponse.json(data, { status: res.status });
	} catch (e: any) {
		return NextResponse.json(
			{ detail: `transcript tool unreachable: ${String(e?.message || e)}` },
			{ status: 502 },
		);
	}
}