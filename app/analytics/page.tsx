import type { Metadata } from "next";
import SocialFeaturePage from "@/components/SocialFeaturePage";
import { SOCIAL_PAGES } from "@/lib/social-pages";

const page = SOCIAL_PAGES.analytics;

export const metadata: Metadata = {
	title: "Performance Analytics — Clipping AI",
	description:
		"Track views and engagement, broken out by platform and by brand.",
	alternates: { canonical: "/analytics" },
};

export default function Page() {
	return <SocialFeaturePage page={page} />;
}
