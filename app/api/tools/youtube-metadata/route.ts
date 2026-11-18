import { NextRequest, NextResponse } from "next/server";

// The upstream free-tools service sleeps when idle (free tier), so the
// first request can spend ~50 s on a cold start. Vercel's default is 10 s.
export const maxDuration = 60;

/**
 * Free-tool proxy → Clipping AI API (:8000 by default).
 *
 * POST /api/tools/youtube-metadata
 *   { platform, kind: "titles" | "description" | "tags", video_url, prompt? }
 *   → AI-written titles, description or tags (Gemini runs server-side).
 *
 * Powers the AI thumbnail maker and the YouTube tag generator.
 */
const CLIPPINGAI = process.env.CLIPPINGAI_API_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
	const body = await request.json().catch(() => ({}));
	try {
		const res = await fetch(`${CLIPPINGAI}/api/tools/youtube-metadata`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		const data = await res.json().catch(() => ({ detail: "invalid response" }));
		return NextResponse.json(data, { status: res.status });
	} catch (e: any) {
		return NextResponse.json(
			{ detail: `metadata tool unreachable: ${String(e?.message || e)}` },
			{ status: 502 },
		);
	}
}