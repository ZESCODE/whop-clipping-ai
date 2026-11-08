import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Whop webhooks (Standard Webhooks spec — HMAC-SHA256 over
 * "{id}.{timestamp}.{body}" with the ws_ secret, base64, v1,<sig>).
 * Verifies manually (no SDK helper in this template) and logs the events the
 * clipping app cares about; ack within 5s, work stays out of the handler.
 */
const ENDPOINT = "/api/webhooks/whop";

function verify(rawBody: string, headers: Headers, secret: string): boolean {
	const id = headers.get("webhook-id");
	const timestamp = headers.get("webhook-timestamp");
	const signature = headers.get("webhook-signature") || "";
	if (!id || !timestamp || !signature) return false;
	// replay guard: 5 minutes
	const age = Math.abs(Date.now() / 1000 - Number(timestamp));
	if (!Number.isFinite(age) || age > 300) return false;

	const [version, sig] = signature.split(",");
	if (version !== "v1" || !sig) return false;

	const expected = createHmac("sha256", secret)
		.update(`${id}.${timestamp}.${rawBody}`)
		.digest("base64");
	try {
		return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
	} catch {
		return false;
	}
}

export async function POST(request: NextRequest) {
	const raw = await request.text();
	const secret = process.env.WHOP_WEBHOOK_SECRET;
	if (!secret) {
		return NextResponse.json({ error: "webhook secret not configured" }, { status: 500 });
	}
	if (!verify(raw, request.headers, secret)) {
		console.log(`[whop] signature rejected id=${request.headers.get("webhook-id")}`);
		return NextResponse.json({ error: "invalid signature" }, { status: 400 });
	}

	let event: {type?: string; data?: Record<string, unknown>; account_id?: string};
	try {
		event = JSON.parse(raw);
	} catch {
		return NextResponse.json({ error: "bad json" }, { status: 400 });
	}

	const type = event.type || "unknown";
	switch (type) {
		case "app_installation.created":
		case "app_installation.deleted":
			console.log(`[whop] ${type} account=${event.account_id} data=${JSON.stringify(event.data).slice(0, 200)}`);
			break;
		case "bounty_submissions.submitted":
		case "payment.succeeded":
			console.log(`[whop] ${type} id=${(event.data as any)?.id ?? "?"}`);
			break;
		default:
			console.log(`[whop] ${type} (unhandled)`);
	}

	// Ack fast; Whop retries on non-2xx.
	return new NextResponse("OK", {status: 200});
}

export const dynamic = "force-dynamic";
export const preferredRegion = "auto";
