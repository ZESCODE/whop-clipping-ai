import type { NextRequest } from "next/server";

/**
 * Catch-all proxy for the embedded dashboard (public/app, served at /app).
 *
 * The dashboard calls the Clipping AI API on its own origin (/api/process,
 * /api/history, /api/status, /api/social/* …). Those endpoints are not
 * re-implemented here: everything under /api that does not have a dedicated
 * route (clips, media, tools, bounties, …) is forwarded verbatim, so the app
 * works against the same backend the rest of this site uses.
 */
const CLIPPINGAI = process.env.CLIPPINGAI_API_URL || "http://127.0.0.1:8000";

const HOP_BY_HOP = new Set([
	"connection",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade",
	"host",
	"content-length",
]);

async function proxy(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
	const { path } = await ctx.params;
	const target = `${CLIPPINGAI}/api/${path.join("/")}${request.nextUrl.search}`;

	const headers = new Headers();
	request.headers.forEach((value, key) => {
		if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value);
	});

	const hasBody = !["GET", "HEAD"].includes(request.method);

	try {
		const upstream = await fetch(target, {
			method: request.method,
			headers,
			body: hasBody ? await request.arrayBuffer() : undefined,
			redirect: "manual",
			cache: "no-store",
		});

		const out = new Headers();
		upstream.headers.forEach((value, key) => {
			if (!HOP_BY_HOP.has(key.toLowerCase())) out.set(key, value);
		});
		return new Response(upstream.body, { status: upstream.status, headers: out });
	} catch {
		return Response.json({ detail: "Clipping AI backend unreachable" }, { status: 502 });
	}
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
