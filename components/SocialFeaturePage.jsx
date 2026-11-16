"use client";

// The four publishing pages (/user, /upload, /calendar, /analytics).
//
// They describe Upload-Post's connect-and-publish flow and hand the visitor
// over to it. No API call happens here — the affiliate funnel has to work
// before there is a subscription to pay for — so the previews are mock UI
// built from divs, not screenshots of someone else's dashboard.
import {
	ArrowRight,
	CalendarDays,
	Check,
	Clock,
	LineChart,
	Link2,
	ShieldCheck,
	Upload,
} from "lucide-react";
import SiteNav from "./SiteNav";
import SocialLivePanel from "./SocialLivePanel";
import { CONNECT_HREF, UPLOAD_POST_URL } from "../lib/upload-post";

const NETWORKS = [
	{ name: "TikTok", short: "TT", slug: "tiktok" },
	{ name: "Instagram", short: "IG", slug: "instagram" },
	{ name: "YouTube", short: "YT", slug: "youtube" },
	{ name: "LinkedIn", short: "LI", slug: "linkedin" },
	{ name: "Facebook", short: "FB", slug: "facebook" },
	{ name: "X", short: "X", slug: "x" },
];

function PlatformChip({ children, on = true }) {
	return (
		<span
			className={`readout px-2 py-1 rounded-full border ${
				on ? "border-rule text-ink2" : "border-rule text-muted"
			}`}
		>
			{children}
		</span>
	);
}

export default function SocialFeaturePage({ page }) {

	return (
		<div className="ambient-page min-h-screen bg-paper text-ink2">
			<SiteNav />

			<header className="px-6 pt-16 pb-10">
				<div className="max-w-3xl mx-auto">
					<p className="eyebrow mb-4">{page.eyebrow}</p>
					<h1 className="font-display lowercase text-ink tracking-tight text-4xl md:text-5xl leading-[1.05] mb-5">
						{page.title}
					</h1>
					<p className="text-ink2 text-base md:text-lg leading-relaxed mb-8">{page.lede}</p>
					<div className="flex flex-wrap items-center gap-3">
						<a href={CONNECT_HREF} className="btn-primary">
							{page.cta}
							<ArrowRight size={15} className="ml-1" />
						</a>
						<a href={page.secondary.href} className="btn-ghost px-4 py-2 text-sm">
							{page.secondary.label}
						</a>
					</div>
					<p className="text-xs text-muted mt-4">
						Publishing runs on Upload-Post. Your social passwords go to the network, never to us.{" "}
						<a href={UPLOAD_POST_URL} className="underline hover:text-ink2" target="_blank" rel="noreferrer">
							Open Upload-Post directly
						</a>
						.
					</p>
				</div>
			</header>

			<section className="px-6 pb-14">
				<div className="max-w-3xl mx-auto">
					<SocialLivePanel page={page} />
				</div>
			</section>

			<section className="px-6 py-14 border-t border-rule">
				<div className="max-w-3xl mx-auto">
					<h2 className="font-display lowercase text-2xl text-ink mb-8">how it works</h2>
					<ol className="space-y-4">
						{page.steps.map((step, i) => (
							<li key={step} className="flex gap-4">
								<span className="readout w-7 h-7 shrink-0 grid place-items-center rounded-full border border-rule bg-paper2 text-ink2">
									{i + 1}
								</span>
								<span className="text-ink2 leading-relaxed">{step}</span>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section className="px-6 py-14 border-t border-rule">
				<div className="max-w-3xl mx-auto grid gap-5 sm:grid-cols-3">
					{page.features.map((f) => (
						<div key={f.title} className="card p-5">
							<h3 className="text-ink font-medium mb-2">{f.title}</h3>
							<p className="text-sm text-muted leading-relaxed">{f.body}</p>
						</div>
					))}
				</div>
			</section>

			<section className="px-6 py-16 border-t border-rule">
				<div className="max-w-3xl mx-auto card p-6 sm:p-8 text-center">
					<h2 className="font-display lowercase text-2xl sm:text-3xl text-ink mb-3">
						connect once, publish from the clipper.
					</h2>
					<p className="text-muted mb-6">
						Clip the video here, send it to every network from the publishing tab. One queue, one
						calendar, one set of numbers.
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						<a href={CONNECT_HREF} className="btn-primary">
							{page.cta}
						</a>
						<a href="/#app" className="btn-ghost px-4 py-2 text-sm">
							Open the clipper
						</a>
					</div>
					<p className="text-xs text-muted mt-4 inline-flex items-center gap-1.5">
						<ShieldCheck size={13} /> OAuth on each network · encrypted tokens · revoke any time
					</p>
				</div>
			</section>

			<footer className="border-t border-rule py-10 px-6">
				<div className="max-w-3xl mx-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
					<a href="/user" className="hover:text-ink transition-colors">
						accounts
					</a>
					<a href="/upload" className="hover:text-ink transition-colors">
						upload
					</a>
					<a href="/calendar" className="hover:text-ink transition-colors">
						calendar
					</a>
					<a href="/analytics" className="hover:text-ink transition-colors">
						analytics
					</a>
					<a href="/tools" className="hover:text-ink transition-colors">
						free tools
					</a>
					<a href="/pricing" className="hover:text-ink transition-colors">
						pricing
					</a>
					<span className="ml-auto inline-flex items-center gap-1.5">
						<Check size={13} /> powered by Upload-Post
					</span>
				</div>
			</footer>
		</div>
	);
}
