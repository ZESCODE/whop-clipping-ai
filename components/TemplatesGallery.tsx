"use client";

import { useMemo, useState } from "react";
import data from "@/lib/templates-data.json";

type Video = (typeof data.videos)[number];
type Avatar = (typeof data.avatars)[number];

const STYLE_LABEL: Record<string, string> = {
	ugc: "UGC",
	shock: "Shock hook",
	story: "Story",
	educational: "Educational",
	comparison: "Comparison",
};

function CopyButton({ text, label = "Copy script" }: { text: string; label?: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			className="btn-ghost text-xs"
			onClick={() => {
				navigator.clipboard?.writeText(text).then(
					() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					},
					() => {},
				);
			}}
		>
			{copied ? "Copied" : label}
		</button>
	);
}

function VideoCard({ video }: { video: Video }) {
	const [open, setOpen] = useState(false);
	const minutes = Math.floor(video.duration / 60);
	const seconds = Math.round(video.duration % 60);
	const length = minutes ? `${minutes}:${String(seconds).padStart(2, "0")}` : `${seconds}s`;

	return (
		<article className="frost-card flex flex-col overflow-hidden">
			{open ? (
				// biome-ignore lint/a11y/useMediaCaption: templates are short-form clips
				<video
					src={video.video}
					poster={video.poster}
					controls
					autoPlay
					playsInline
					className="aspect-[9/16] w-full bg-black object-contain"
				/>
			) : (
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="group relative aspect-[9/16] w-full overflow-hidden bg-black"
					aria-label={`Play ${video.title}`}
				>
					{/* biome-ignore lint/performance/noImgElement: static template poster */}
					<img
						src={video.poster}
						alt=""
						loading="lazy"
						className="h-full w-full object-cover transition group-hover:scale-[1.03]"
					/>
					<span className="absolute inset-0 grid place-items-center">
						<span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-black shadow-lg">
							<span className="ml-0.5 block h-0 w-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-black" />
						</span>
					</span>
				</button>
			)}

			<div className="flex flex-1 flex-col gap-2 p-4">
				<div className="flex flex-wrap items-center gap-1.5 text-[11px]">
					<span className="badge-ok">{STYLE_LABEL[video.style] || video.style}</span>
					<span className="badge-float">{video.mode === "premium" ? "Premium" : "Low cost"}</span>
					<span className="badge-float">{length}</span>
				</div>
				<h3 className="text-base font-semibold leading-snug text-ink">{video.title}</h3>
				{video.hook && <p className="text-sm text-muted">“{video.hook}”</p>}
				{video.productName && (
					<p className="text-xs text-muted">
						Product:{" "}
						{video.productUrl ? (
							<a
								href={video.productUrl}
								target="_blank"
								rel="noreferrer"
								className="underline hover:text-ink"
							>
								{video.productName}
							</a>
						) : (
							video.productName
						)}
					</p>
				)}
				<div className="mt-auto flex items-center gap-2 pt-2">
					<CopyButton text={video.narration} />
					<a href={video.video} download className="btn-ghost text-xs">
						Download
					</a>
				</div>
			</div>
		</article>
	);
}

function AvatarCard({ avatar }: { avatar: Avatar }) {
	return (
		<figure className="frost-card overflow-hidden">
			{/* biome-ignore lint/performance/noImgElement: static template image */}
			<img
				src={avatar.file}
				alt={avatar.description || "AI actor avatar"}
				loading="lazy"
				className="aspect-[3/4] w-full object-cover"
			/>
			<figcaption className="flex flex-col gap-2 p-3">
				<p className="line-clamp-4 text-xs leading-relaxed text-muted">{avatar.description}</p>
				<CopyButton text={avatar.description || ""} label="Copy prompt" />
			</figcaption>
		</figure>
	);
}

export default function TemplatesGallery() {
	const [tab, setTab] = useState<"videos" | "avatars">("videos");
	const [query, setQuery] = useState("");

	const videos = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return data.videos;
		return data.videos.filter((v) =>
			[v.title, v.hook, v.narration, v.style, v.productName].join(" ").toLowerCase().includes(q),
		);
	}, [query]);

	const avatars = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return data.avatars;
		return data.avatars.filter((a) => (a.description || "").toLowerCase().includes(q));
	}, [query]);

	return (
		<div className="ambient-page min-h-screen">
			<div className="mx-auto w-full max-w-6xl px-5 py-10">
				<header className="mb-6 flex flex-col gap-3">
					<p className="eyebrow">Templates</p>
					<h1 className="text-3xl font-semibold text-ink">Video &amp; avatar templates</h1>
					<p className="max-w-2xl text-sm text-muted">
						{videos.length} short-form video templates and {data.avatars.length} AI actor avatars,
						hosted here. Play one, copy its script, or reuse an actor prompt in your own clips.
					</p>
				</header>

				<div className="mb-6 flex flex-wrap items-center gap-3">
					<div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
						<button
							type="button"
							onClick={() => setTab("videos")}
							className={`rounded-lg px-3 py-1.5 text-sm ${tab === "videos" ? "bg-white text-black" : "text-muted hover:text-ink"}`}
						>
							Videos ({data.videos.length})
						</button>
						<button
							type="button"
							onClick={() => setTab("avatars")}
							className={`rounded-lg px-3 py-1.5 text-sm ${tab === "avatars" ? "bg-white text-black" : "text-muted hover:text-ink"}`}
						>
							Avatars ({data.avatars.length})
						</button>
					</div>
					<input
						type="search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder={tab === "videos" ? "Search videos…" : "Search avatars…"}
						className="input-field max-w-xs flex-1"
					/>
					<a
						href="/templates/index.json"
						className="text-xs text-muted underline hover:text-ink"
						download
					>
						manifest.json
					</a>
				</div>

				{tab === "videos" ? (
					videos.length ? (
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{videos.map((v) => (
								<VideoCard key={v.id} video={v} />
							))}
						</div>
					) : (
						<p className="text-sm text-muted">No videos match “{query}”.</p>
					)
				) : avatars.length ? (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
						{avatars.map((a, i) => (
							<AvatarCard key={`${a.file}-${i}`} avatar={a} />
						))}
					</div>
				) : (
					<p className="text-sm text-muted">No avatars match “{query}”.</p>
				)}
			</div>
		</div>
	);
}
