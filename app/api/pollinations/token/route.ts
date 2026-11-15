import type { NextRequest } from "next/server";

/**
 * Pollinations OAuth token exchange, server-side: enter.pollinations.ai does
 * not send CORS headers, so the browser cannot call it directly.
 *
 * The authorization code, PKCE verifier and client_id are all public values
 * (PKCE replaces a client secret); the returned sk_ key goes straight back to
 * the caller and is never stored or logged here.
 */
const TOKEN_URL = "https://enter.pollinations.ai/api/oauth/token";

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: String(payload.code ?? ""),
    client_id: String(payload.client_id ?? ""),
    redirect_uri: String(payload.redirect_uri ?? ""),
    code_verifier: String(payload.code_verifier ?? ""),
  });

  const upstream = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") || "application/json", "Cache-Control": "no-store" },
  });
}
