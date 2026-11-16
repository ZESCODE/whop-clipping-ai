import { NextResponse } from "next/server";
import data from "@/lib/templates-data.json";

/**
 * GET /api/saasshorts/actor-gallery — the AI actor avatars shown in the UGC
 * gallery's Avatars tab. Served from the avatars hosted under
 * /public/templates/avatars, in the shape the dashboard expects
 * (`{ images: [{ url, key, description, created_at }] }`).
 */
export async function GET() {
	const images = data.avatars.map((a) => ({
		url: a.file,
		key: a.file.split("/").pop() || a.file,
		description: a.description,
		created_at: a.createdAt,
	}));
	return NextResponse.json({ images });
}
