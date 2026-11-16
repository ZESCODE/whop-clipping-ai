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

function AccountsPreview() {
	// Empty state, not a made-up brand: the rows are real connect links, and a
	// profile with nothing attached says so.
	return (
		<div className="card p-4 space-y-2">
			<div className="flex items-center justify-between">
				<span className="readout text-muted">no profile connected</span>
				<span className="badge-float">not connected</span>
			</div>
			{NETWORKS.map((n) => (
				<a
					key={n.name}
					href={`${CONNECT_HREF}?platform=${n.slug}`}
					className="flex items-center justify-between gap-3 rounded-input border border-rule bg-paper2 px-3 py-2 hover:border-brass/50 transition-colors"
				>
					<div className="flex items-center gap-2 min-w-0">
						<span className="readout w-7 h-7 grid place-items-center rounded-full bg-paper3 text-ink3">
							{n.short}
						</span>
						<span className="text-sm text-ink3 truncate">{n.name}</span>
					</div>
					<span className="text-xs text-muted">connect →</span>
				</a>
			))}
		</div>
	);
}

function UploadPreview() {
	return (
		<div className="card p-4 space-y-3">
			<div className="flex items-center gap-2 text-sm text-ink3">
				<Upload size={14} className="text-muted" />
				<span>no clip selected</span>
				<span className="ml-auto readout">—</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{NETWORKS.slice(0, 4).map((n) => (
					<PlatformChip key={n.name} on={false}>
						{n.name}
					</PlatformChip>
				))}
				<PlatformChip on={false}>+2</PlatformChip>
			</div>
			<p className="text-sm text-muted leading-relaxed">The caption goes here, one per network.</p>
			<div className="flex items-center justify-between text-xs text-muted">
				<span className="inline-flex items-center gap-1">
					<Clock size={12} /> not scheduled
				</span>
				<span>no networks selected</span>
			</div>
			<div className="h-1.5 rounded-full bg-paper3 overflow-hidden">
				<div className="h-full w-0 bg-brass" />
			</div>
			<div className="flex items-center justify-between readout text-xs text-muted">
				<span>0 of 0 networks</span>
				<span>nothing queued</span>
			</div>
		</div>
	);
}

function CalendarPreview() {
	const days = ["m", "t", "w", "t", "f", "s", "s"];
	return (
		<div className="card p-4">
			<div className="flex items-center justify-between mb-3">
				<span className="readout text-muted">no profile connected</span>
				<span className="badge-float">0 queued</span>
			</div>
			<div className="grid grid-cols-7 gap-1.5">
				{days.map((d, i) => (
					<div key={`h${i}`} className="readout text-center text-muted pb-1">
						{d}
					</div>
				))}
				{Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
					<div
						key={day}
						className="aspect-square rounded-input grid place-items-center text-xs bg-paper2 text-ink3 border border-rule"
					>
						{day}
					</div>
				))}
			</div>
		</div>
	);
}

function AnalyticsPreview() {
	return (
		<div className="card p-4 space-y-3">
			<div className="grid grid-cols-3 gap-2">
				{[
					["views", "—"],
					["reposts", "—"],
					["follows", "—"],
				].map(([label, value]) => (
					<div key={label} className="rounded-input border border-rule bg-paper2 px-3 py-2">
						<p className="readout text-xs text-muted">{label}</p>
						<p className="text-lg text-ink3">{value}</p>
					</div>
				))}
			</div>
			<div className="flex items-end gap-1.5 h-20">
				{Array.from({ length: 7 }, (_, i) => (
					<div key={i} className="flex-1 rounded-t bg-paper3" style={{ height: "6%" }} />
				))}
			</div>
			<div className="flex items-center justify-between readout text-xs text-muted">
				<span>no data yet</span>
				<span>connect an account</span>
			</div>
		</div>
	);
}

const PREVIEWS = {
	accounts: AccountsPreview,
	upload: UploadPreview,
	calendar: CalendarPreview,
	analytics: AnalyticsPreview,
};

const PREVIEW_LABEL = {
	accounts: "connect page · empty profile",
	upload: "publish · nothing queued",
	calendar: "queue · empty month",
	analytics: "reporting · no data",
};

export default function SocialFeaturePage({ page }) {
	const Preview = PREVIEWS[page.preview];

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
					<Preview />
					<p className="readout text-xs text-muted mt-2">{PREVIEW_LABEL[page.preview]}</p>
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
