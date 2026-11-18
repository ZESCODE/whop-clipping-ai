import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildPages, relatedFor } from "@/lib/seo/pages";
import { renderPage } from "@/lib/seo/render";
import { legalPages } from "@/lib/seo/legal";

// Paths with their own route in this app (or the app itself): the catch-all
// must not shadow them, and they stay out of the sitemap here.
const OWN_ROUTES = new Set([
	"/",
	"/pricing",
	"/legal",
	"/terms",
	"/privacy",
	"/legal-notice",
	"/refunds",
	"/report-content",
	"/discover",
	"/dashboard",
	"/experiences",
]);

// The SEO pages are plain data + an HTML renderer (seo/render.js), reused
// verbatim: buildPages() returns every marketing page, legalPages() the legal
// ones. Pages the vite plugin would have emitted get Next routes instead.
const seoPages = buildPages().filter((p) => !OWN_ROUTES.has(p.path));
const legalDocs = legalPages().filter((p) => !OWN_ROUTES.has(p.path));
const allPages = [...seoPages, ...legalDocs];

// Full document in, page content out: the renderer inlines the whole style
// sheet and wraps everything in <body>. Both are lifted out so Next's own
// html/head stay in charge (metadata, fonts) and only the content is injected.
function extract(html: string) {
	const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
		.map((m) => m[1])
		.join("\n");
	const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
	let body = bodyMatch ? bodyMatch[1] : html;
	// A module <script> inside innerHTML never executes, so lift the tool's
	// entry out of the body and re-emit it as a real React <script> tag.
	const toolScript = body.match(/<script type="module" src="([^"]+)"><\/script>/);
	const toolSrc = toolScript ? toolScript[1] : null;
	if (toolScript) body = body.replace(toolScript[0], "");
	const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
		(m) => m[1],
	);
	// The upstream pages send "open the app" CTAs to SITE.url/#app. In this
	// build the app is the Whop experience at /discover, so those links stay in
	// the app instead of jumping to a placeholder host.
	body = body
		.replaceAll("https://clip.zes.codes/#app", "/discover")
		.replaceAll('href="https://clip.zes.codes/"', 'href="/"');
	return { styles, body, ld, toolSrc };
}

// The vite plugin resolved these entry names to hashed build outputs; this app
// serves the same tool modules from /tools/ (vertical is pre-bundled with
// mediabunny, which has no bare-specifier resolution in a browser).
const TOOL_ENTRIES: Record<string, string> = {
	"tool-paste-link": "/tools/paste-link.js",
	"tool-metadata": "/tools/metadata.js",
	"tool-transcript": "/tools/transcript.js",
	"tool-vertical": "/tools/vertical.bundle.js",
};

export function generateStaticParams() {
	return allPages.map((p) => ({ slug: p.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const page = allPages.find((p) => p.path === `/${slug.join("/")}`);
	if (!page) return {};
	return {
		title: page.title,
		description: page.description,
		alternates: { canonical: page.path },
		openGraph: {
			title: page.title,
			description: page.description,
			type: "website",
		},
	};
}

export default async function SeoPage({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}) {
	const { slug } = await params;
	const path = `/${slug.join("/")}`;
	const page = allPages.find((p) => p.path === path);
	if (!page) notFound();

	const legal = legalDocs.some((p) => p.path === path);
	const toolEntry = (page.tool?.entry as string) || (page.pasteLink ? "tool-paste-link" : null);
	const toolScript = toolEntry ? TOOL_ENTRIES[toolEntry] || "" : "";
	const html = renderPage(page, legal ? [] : relatedFor(page, seoPages), {
		cta: !legal,
		toolScript,
		built: new Set(allPages.map((p) => p.path)) as unknown as null,
	});
	const { styles, body, ld, toolSrc } = extract(html);

	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: styles }} />
			{toolSrc ? <script type="module" src={toolSrc} /> : null}
			{ld.map((json, i) => (
				<script
					key={i}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: json }}
				/>
			))}
			<div dangerouslySetInnerHTML={{ __html: body }} />
		</>
	);
}