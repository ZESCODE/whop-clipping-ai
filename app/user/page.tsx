import type { Metadata } from "next";
import SocialFeaturePage from "@/components/SocialFeaturePage";
import { SOCIAL_PAGES } from "@/lib/social-pages";

const page = SOCIAL_PAGES.user;

export const metadata: Metadata = {
	title: "Connected Accounts — Clipping AI",
	description:
		"Link TikTok, Instagram, YouTube and more just once, then publish right from the studio.",
	alternates: { canonical: "/user" },
};

export default function Page() {
	return <SocialFeaturePage page={page} />;
}
