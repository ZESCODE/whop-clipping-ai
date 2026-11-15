import { NextRequest, NextResponse } from "next/server";

/**
 * Free-tool proxy → OpenShorts API (:8000 by default).
 *
 * POST /api/tools/youtube-metadata
 *   { platform, kind: "titles" | "description" | "tags", video_url, prompt? }
 *   → AI-written titles, description or tags (Gemini runs server-side).
 *
 * Powers the AI thumbnail maker and the YouTube tag generator.
 */
const OPENSHORTS = process.env.OPENSHORTS_API_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
	const body = await request.json().catch(() => ({}));
	try {
		const res = await fetch(`${OPENSHORTS}/api/tools/youtube-metadata`, {
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