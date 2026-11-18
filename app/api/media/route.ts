import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend-url";

/**
 * Streams Clipping AI clip videos same-origin (<video> can't set auth headers,
 * and cross-origin playback in the Whop iframe is unreliable).
 *   GET /api/media?path=/videos/<job_id>/<file>.mp4
 */

export async function GET(request: NextRequest) {
	const CLIPPINGAI = backendUrl(request);
  const path = request.nextUrl.searchParams.get("path") || "";
  if (!/^\/videos\/[\w.-]+\/[\w.-]+\.(mp4|mov|webm)$/.test(path)) {
    return NextResponse.json({ error: "invalid clip path" }, { status: 400 });
  }
  try {
    const upstream = await fetch(`${CLIPPINGAI}${path}`, {
      headers: request.headers.get("range") ? { Range: request.headers.get("range")! } : {},
    });
    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json({ error: `upstream ${upstream.status}` }, { status: upstream.status });
    }
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "video/mp4",
        "Accept-Ranges": "bytes",
        ...(upstream.headers.get("content-length") ? { "Content-Length": upstream.headers.get("content-length")! } : {}),
        ...(upstream.headers.get("content-range") ? { "Content-Range": upstream.headers.get("content-range")! } : {}),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: `Clipping AI unreachable: ${String(e?.message || e)}` }, { status: 502 });
  }
}
