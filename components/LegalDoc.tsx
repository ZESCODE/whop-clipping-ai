import { legalPages } from "@/lib/legal";

// Renders one of the legal documents from seo/legal.js (the same source the
// OpenShorts static pages use). Unknown paths render a not-found note.
export default function LegalDoc({ path }: { path: string }) {
	const doc = legalPages().find((p) => p.path === path);
	if (!doc) {
		return (
			<main className="min-h-screen bg-paper text-ink2 px-6 py-20">
				<div className="max-w-3xl mx-auto">
					<h1 className="font-display text-3xl lowercase text-ink mb-4">Not found</h1>
					<p className="text-muted">This legal document does not exist.</p>
				</div>
			</main>
		);
	}
	return (
		<main className="min-h-screen bg-paper text-ink2 px-6 py-20">
			<article className="max-w-3xl mx-auto legal-prose">
				<p className="eyebrow mb-3">Legal</p>
				<h1 className="font-display text-4xl lowercase text-ink mb-2">{doc.h1}</h1>
				{doc.updated ? <p className="readout mb-8">Updated {doc.updated}</p> : null}
				{doc.tldr?.length ? (
					<ul className="card p-5 mb-8 space-y-2 text-sm text-ink2">
						{doc.tldr.map((t: string, i: number) => (
							<li key={i} className="flex gap-2">
								<span className="text-brass">•</span>
								<span dangerouslySetInnerHTML={{ __html: t }} />
							</li>
						))}
					</ul>
				) : null}
				<div dangerouslySetInnerHTML={{ __html: doc.body }} />
			</article>
		</main>
	);
}