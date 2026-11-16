import type { Metadata } from "next";
import TemplatesGallery from "@/components/TemplatesGallery";

export const metadata: Metadata = {
	title: "Video & avatar templates · Clipping AI",
	description:
		"Browse short-form video templates and AI actor avatars, hosted on Clipping AI.",
};

export default function Page() {
	return <TemplatesGallery />;
}
