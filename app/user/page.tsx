import type { Metadata } from "next";
import SocialFeaturePage from "@/components/SocialFeaturePage";
import { SOCIAL_PAGES } from "@/lib/social-pages";

const page = SOCIAL_PAGES.user;

export const metadata: Metadata = {
	title: "Accounts — Clipping AI",
	description:
		"Connect TikTok, Instagram, YouTube and the rest once, then publish from the clipper.",
	alternates: { canonical: "/user" },
};

export default function Page() {
	return <SocialFeaturePage page={page} />;
}
