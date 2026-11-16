import { NextRequest, NextResponse } from "next/server";

/**
 * Read-only proxy for Upload-Post, keyed by the visitor's own API key.
 *
 * The key lives in the browser (sessionStorage/localStorage, the same place the
 * dashboard keeps it) and is sent to this route, which attaches it as
 * `Authorization: ApiKey …` on the upstream call. Nothing is stored here and
 * the key never reaches a log.
 *
 * GET only: the publishing pages read profiles, queues and analytics. Posting
 * stays in the dashboard, which owns the publish flow.
 */
const UPLOAD_POST_API = "https://api.upload-post.com/api";
type Context = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: Context) {
	const { path } = await context.params;
	const key = (request.headers.get("x-upload-post-key") || "").trim();
	if (!key) {
		return NextResponse.json({ error: "missing_key" }, { status: 400 });
	}
	if (request.method !== "GET") {
		return NextResponse.json({ error: "read_only" }, { status: 405 });
	}

	const query = request.nextUrl.searchParams.toString();
	const url = `${UPLOAD_POST_API}/${path.map(encodeURIComponent).join("/")}${query ? `?${query}` : ""}`;

	try {
		const upstream = await fetch(url, {
			headers: { Authorization: `ApiKey ${key}`, Accept: "application/json" },
			cache: "no-store",
			signal: AbortSignal.timeout(45_000),
		});
		const body = await upstream.text();
		const headers: Record<string, string> = {
			"Content-Type": upstream.headers.get("content-type") || "application/json",
			"Cache-Control": "no-store",
		};
		return new NextResponse(body, { status: upstream.status, headers });
	} catch (error) {
		return NextResponse.json(
			{ error: "upstream_unreachable", detail: String(error).slice(0, 200) },
			{ status: 502 },
		);
	}
}

export async function GET(request: NextRequest, context: Context) {
	return handle(request, context);
}

export async function POST(request: NextRequest, context: Context) {
	return handle(request, context);
}
