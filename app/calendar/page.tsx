import type { Metadata } from "next";
import SocialFeaturePage from "@/components/SocialFeaturePage";
import { SOCIAL_PAGES } from "@/lib/social-pages";

const page = SOCIAL_PAGES.calendar;

export const metadata: Metadata = {
	title: "Calendar — Clipping AI",
	description:
		"Every queued post across every brand in one calendar.",
	alternates: { canonical: "/calendar" },
};

export default function Page() {
	return <SocialFeaturePage page={page} />;
}
