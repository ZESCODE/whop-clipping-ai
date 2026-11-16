import type { Metadata } from "next";
import SocialFeaturePage from "@/components/SocialFeaturePage";
import { SOCIAL_PAGES } from "@/lib/social-pages";

const page = SOCIAL_PAGES.analytics;

export const metadata: Metadata = {
	title: "Analytics — Clipping AI",
	description:
		"Impressions and engagement per platform, per brand.",
	alternates: { canonical: "/analytics" },
};

export default function Page() {
	return <SocialFeaturePage page={page} />;
}
