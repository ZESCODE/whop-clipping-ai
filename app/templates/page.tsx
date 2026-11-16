import type { Metadata } from "next";
import TemplatesGallery from "@/components/TemplatesGallery";

export const metadata: Metadata = {
	title: "Short-Form Video & Avatar Templates · Clipping AI",
	description:
		"Explore ready-made short-form templates and AI actor avatars, all hosted on Clipping AI.",
};

export default function Page() {
	return <TemplatesGallery />;
}
