import type { NextRequest } from "next/server";

/**
 * Image generation proxy (server-side, so no browser Origin reaches Pollinations).
 *
 *  - No key: the legacy free endpoint, same as the :7070 console proxy.
 *  - Bearer sk_… (Pollinations Pay / BYOP): gen.pollinations.ai, spending that
 *    user's own Pollen. The key is only forwarded — never stored or logged.
 */
const FREE_BASE = "https://image.pollinations.ai/prompt";
const PAID_BASE = "https://gen.pollinations.ai/image";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const prompt = (params.get("prompt") || "").trim();
  const model = params.get("model") || "flux";
  const width = params.get("width") || "1024";
  const height = params.get("height") || "1024";

  if (!prompt) {
    return Response.json({ error: "bad_request", detail: "prompt required" }, { status: 400 });
  }

  const key = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim()
    || params.get("key") || "";

  const qs = new URLSearchParams({
    model,
    width,
    height,
    nologo: "true",
    enhance: "false",
  });
  const url = `${key ? PAID_BASE : FREE_BASE}/${encodeURIComponent(prompt)}?${qs}`;

  try {
    const upstream = await fetch(url, {
      headers: key ? { Accept: "image/*", Authorization: `Bearer ${key}` } : { Accept: "image/*" },
      signal: AbortSignal.timeout(120_000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const detail = (await upstream.text().catch(() => "")).slice(0, 300);
      return Response.json(
        { error: "upstream_error", status: upstream.status, detail },
        { status: upstream.status },
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return Response.json(
      { error: "upstream_unreachable", detail: String(error).slice(0, 200) },
      { status: 502 },
    );
  }
}
