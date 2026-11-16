import type { Metadata } from "next";
import SocialFeaturePage from "@/components/SocialFeaturePage";
import { SOCIAL_PAGES } from "@/lib/social-pages";

const page = SOCIAL_PAGES.upload;

export const metadata: Metadata = {
	title: "Publish Your Clips — Clipping AI",
	description:
		"Push a single clip to TikTok, Reels, Shorts and everywhere else — instantly or on a schedule.",
	alternates: { canonical: "/upload" },
};

export default function Page() {
	return <SocialFeaturePage page={page} />;
}
