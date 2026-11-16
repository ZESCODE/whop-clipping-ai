/**
 * Upload-Post is the publishing layer behind the social pages (/user,
 * /upload, /calendar, /analytics).
 *
 * These pages are the affiliate funnel: they explain what the connect +
 * publish flow does and send the visitor to Upload-Post. No API calls happen
 * here, so the site needs no Upload-Post subscription to serve them.
 *
 * The affiliate id lands in one place once the account is approved — set
 * NEXT_PUBLIC_UPLOAD_POST_AFFILIATE_URL in Vercel to the tracked link and
 * every CTA follows. Until then the plain signup URL is used.
 */
export const UPLOAD_POST_URL =
	process.env.NEXT_PUBLIC_UPLOAD_POST_AFFILIATE_URL?.trim() ||
	"https://app.upload-post.com?source=clipping-ai";

export const UPLOAD_POST_DOCS = "https://docs.upload-post.com";

export const CONNECTED_NETWORKS = [
	{ name: "TikTok", kind: "video" },
	{ name: "Instagram", kind: "video" },
	{ name: "YouTube", kind: "video" },
	{ name: "Facebook", kind: "social" },
	{ name: "LinkedIn", kind: "social" },
	{ name: "X", kind: "social" },
	{ name: "Threads", kind: "social" },
	{ name: "Pinterest", kind: "social" },
	{ name: "Bluesky", kind: "social" },
	{ name: "Google Business", kind: "social" },
] as const;
