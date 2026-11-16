import type { Metadata } from "next";
import SocialFeaturePage from "@/components/SocialFeaturePage";
import { SOCIAL_PAGES } from "@/lib/social-pages";

const page = SOCIAL_PAGES.calendar;

export const metadata: Metadata = {
	title: "Publishing Calendar — Clipping AI",
	description:
		"See every scheduled post for every brand on a single, shared calendar.",
	alternates: { canonical: "/calendar" },
};

export default function Page() {
	return <SocialFeaturePage page={page} />;
}
