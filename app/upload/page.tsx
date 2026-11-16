import type { Metadata } from "next";
import SocialFeaturePage from "@/components/SocialFeaturePage";
import { SOCIAL_PAGES } from "@/lib/social-pages";

const page = SOCIAL_PAGES.upload;

export const metadata: Metadata = {
	title: "Upload — Clipping AI",
	description:
		"Send one clip to TikTok, Reels, Shorts and the rest, now or scheduled.",
	alternates: { canonical: "/upload" },
};

export default function Page() {
	return <SocialFeaturePage page={page} />;
}
