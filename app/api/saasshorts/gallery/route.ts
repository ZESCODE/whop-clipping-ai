import { NextResponse } from "next/server";
import data from "@/lib/templates-data.json";

/**
 * GET /api/saasshorts/gallery — the UGC video gallery in the /app dashboard.
 *
 * The dashboard bundle calls this path expecting the OpenShorts shape
 * (`{ videos, total }`, each with `video_id`, `video_url`, `actor_url`, …).
 * Instead of proxying to a backend, we serve the templates hosted under
 * /public/templates, so the gallery is populated on this deployment even with
 * no OpenShorts API reachable.
 */
export async function GET(request: Request) {
	const limit = Number(new URL(request.url).searchParams.get("limit")) || 100;
	const videos = data.videos.slice(0, limit).map((v) => ({
		video_id: v.id,
		video_url: v.video,
		actor_url: v.actor,
		title: v.title,
		hook_text: v.hook,
		caption: v.caption,
		hashtags: v.hashtags,
		full_narration: v.narration,
		actor_description: v.actorDescription,
		style: v.style,
		language: v.language,
		duration: v.duration,
		video_mode: v.mode,
		product_name: v.productName,
		product_url: v.productUrl,
		created_at: v.createdAt,
		segments: v.segments,
		cost_estimate: { total: v.mode === "premium" ? 2 : 0.65 },
	}));
	return NextResponse.json({ videos, total: data.videos.length });
}
