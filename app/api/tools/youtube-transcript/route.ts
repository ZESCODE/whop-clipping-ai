import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend-url";

// The upstream free-tools service sleeps when idle (free tier), so the
// first request can spend ~50 s on a cold start. Vercel's default is 10 s.
export const maxDuration = 60;

/**
 * Free-tool proxy → Clipping AI API (:8000 by default).
 *
 * GET /api/tools/youtube-transcript?url=<video-url>&lang=<optional>
 *   → the captions a YouTube video already carries, as text + VTT.
 *
 * Same shape the upstream dashboard's Vite proxy used; the URL stays
 * server-side so the browser only ever talks to this origin.
 */

export async function GET(request: NextRequest) {
	const CLIPPINGAI = backendUrl(request);
	const { searchParams } = new URL(request.url);
	const upstream = new URL(`${CLIPPINGAI}/api/tools/youtube-transcript`);
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