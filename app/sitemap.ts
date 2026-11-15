import type { MetadataRoute } from "next";
import { buildPages } from "@/lib/seo/pages";
import { legalPages } from "@/lib/seo/legal";

// Same set the vite plugin used to emit sitemap.xml: every marketing page,
// every legal page, plus the routes this app owns itself.
const marketing = buildPages().map((p) => p.path);
const legal = legalPages().map((p) => p.path);
const owned = ["/", "/pricing", "/discover"];

export default function sitemap(): MetadataRoute.Sitemap {
	const all = [...new Set([...owned, ...marketing, ...legal])];
	return all.map((path) => ({
		url: path,
		lastModified: new Date(),
		changeFrequency: path === "/" ? "weekly" : "monthly",
		priority: path === "/" ? 1 : path.startsWith("/alternatives") ? 0.7 : 0.8,
	}));
}