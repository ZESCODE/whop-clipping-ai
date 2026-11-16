"use client";

// The live half of the publishing pages. Everything here is read-only and
// keyed by the visitor's own Upload-Post key (BYOK): the pages never see a
// server key, so one deployment can show each signed-in user their own
// accounts, queue and numbers.
import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { CONNECT_HREF } from "../lib/upload-post";
import { readUploadPostKey, readUploadPostProfile, uploadPostGet } from "../lib/upload-post-client";

const SETTINGS_HREF = "/app#app?tab=settings";
const KEYS_URL = "https://app.upload-post.com/api-keys";
const SIGNUP_URL = "https://app.upload-post.com/login";

const NETWORK_ORDER = ["tiktok", "instagram", "youtube", "linkedin", "facebook", "x"];

function KeyPrompt() {
	return (
		<div className="card p-5 space-y-3">
			<h3 className="text-ink font-medium">Connect your own Upload-Post account</h3>
			<p className="text-sm text-muted leading-relaxed">
				These pages read <em>your</em> accounts, queue and numbers, so they need your key — not ours.
				Upload-Post has a free tier and no credit card is required.
			</p>
			<ol className="text-sm text-muted space-y-1.5 list-decimal list-inside">
				<li>
					Create an account at{" "}
					<a href={SIGNUP_URL} target="_blank" rel="noreferrer" className="text-ink underline">
						app.upload-post.com
					</a>
				</li>
				<li>Connect TikTok, Instagram or YouTube on the network's own screen</li>
				<li>
					Generate a key under{" "}
					<a href={KEYS_URL} target="_blank" rel="noreferrer" className="text-ink underline">
						API Keys
					</a>
				</li>
				<li>Paste it in Settings → Social Integration</li>
			</ol>
			<div className="flex flex-wrap gap-2 pt-1">
				<a href={SETTINGS_HREF} className="btn-primary">
					Open settings
				</a>
				<a href={KEYS_URL} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2 text-sm">
					Get a key
				</a>
			</div>
		</div>
	);
}

function Row({ label, value, muted = false }: { label: string; value: React.ReactNode; muted?: boolean }) {
	return (
		<div className="flex items-center justify-between gap-3 rounded-input border border-rule bg-paper2 px-3 py-2">
			<span className={`text-sm truncate ${muted ? "text-ink3" : "text-ink"}`}>{label}</span>
			<span className={`text-xs shrink-0 ${muted ? "text-muted" : "text-ink2"}`}>{value}</span>
		</div>
	);
}

function Accounts({ profiles }: { profiles: any[] }) {
	const socials = profiles[0]?.social_accounts || {};
	return (
		<div className="card p-4 space-y-2">
			<div className="flex items-center justify-between">
				<span className="readout text-ink2">{profiles[0]?.username || "profile"}</span>
				<span className="badge-brass">
					{NETWORK_ORDER.filter((n) => !!socials[n]).length} connected
				</span>
			</div>
			{NETWORK_ORDER.map((name) => {
				const account = socials[name];
			 const handle = typeof account === "string" ? account : account?.handle || account?.display_name || "";
				return (
					<Row
						key={name}
						label={name}
						muted={!handle}
						value={
							handle ? (
								<span className="text-ok">{handle}</span>
							) : (
								<a href={`${CONNECT_HREF}?platform=${name}`} className="underline hover:text-ink">
									connect →
								</a>
							)
						}
					/>
				);
			})}
		</div>
	);
}

function Schedule({ posts, title }: { posts: any[]; title: string }) {
	return (
		<div className="card p-4 space-y-2">
			<div className="flex items-center justify-between">
				<span className="readout text-ink2">{title}</span>
				<span className="badge-brass">{posts.length} queued</span>
			</div>
			{posts.length === 0 ? (
				<p className="text-sm text-muted py-2">
					Nothing queued yet. Publish or schedule a clip from the Publishing tab and it shows up here.
				</p>
			) : (
				<div className="space-y-2">
					{posts.slice(0, 12).map((p, i) => (
						<div
							key={p.id || p.job_id || i}
							className="rounded-input border border-rule bg-paper2 px-3 py-2"
						>
							<div className="flex items-center justify-between gap-2">
								<span className="text-sm text-ink truncate">{p.title || p.caption || "untitled"}</span>
								<span className="readout text-xs text-ink3 shrink-0">
									{p.scheduled_date ? String(p.scheduled_date).replace("T", " ").slice(0, 16) : "unscheduled"}
								</span>
							</div>
							<div className="flex flex-wrap gap-1.5 mt-1">
								{(
									Array.isArray(p.platforms)
										? p.platforms
										: p.platform
											? [p.platform]
											: []
								).map((pf: any) => (
									<span key={String(pf)} className="readout text-[11px] px-1.5 py-0.5 rounded-full border border-rule text-ink3">
										{typeof pf === "string" ? pf : pf?.platform || pf?.name || "?"}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function Analytics({ metrics, profile }: { metrics: Record<string, any>; profile: string }) {
	const entries = Object.entries(metrics || {});
	return (
		<div className="card p-4 space-y-3">
			<div className="flex items-center justify-between">
				<span className="readout text-ink2">{profile || "analytics"}</span>
				<span className="readout text-xs text-ink3">last 30 days</span>
			</div>
			{entries.length === 0 ? (
				<p className="text-sm text-muted py-2">
					No numbers reported yet. They appear a day or two after the first post.
				</p>
			) : (
				<div className="space-y-2">
					{entries.map(([platform, m]: [string, any]) => (
						<div key={platform} className="rounded-input border border-rule bg-paper2 px-3 py-2">
							<div className="flex items-center justify-between">
								<span className="readout text-ink2">{platform}</span>
								<span className="readout text-xs text-ink3">followers {m?.followers ?? "—"}</span>
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
								{[
									["impressions", m?.impressions],
									["likes", m?.likes],
									["comments", m?.comments],
									["shares", m?.shares],
								].map(([k, v]) => (
									<div key={String(k)}>
										<p className="readout text-[11px] text-ink3">{k}</p>
										<p className="text-sm text-ink">{v == null ? "—" : Number(v).toLocaleString()}</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

type PanelProps = {
	page: { preview: "accounts" | "upload" | "calendar" | "analytics" };
};

export default function SocialLivePanel({ page }: PanelProps) {
	const [state, setState] = useState("loading");
	const [profiles, setProfiles] = useState<any[]>([]);
	const [posts, setPosts] = useState<any[]>([]);
	const [metrics, setMetrics] = useState({});
	const [error, setError] = useState("");

	const load = useCallback(async () => {
		setError("");
		if (!readUploadPostKey()) {
			setState("nokey");
			return;
		}
		setState("loading");
		try {
			const data = await uploadPostGet("/uploadposts/users");
			const list = data?.profiles || [];
			setProfiles(list);
			const profile = readUploadPostProfile() || list[0]?.username || "";

			if (page.preview === "analytics") {
				const connected = NETWORK_ORDER.filter(
					(n) => typeof list[0]?.social_accounts?.[n] === "object" || !!list[0]?.social_accounts?.[n],
				);
				const platforms = (connected.length ? connected : ["youtube"]).join(",");
				const stats = await uploadPostGet(
					`/analytics/${encodeURIComponent(profile)}?platforms=${encodeURIComponent(platforms)}`,
				);
				setMetrics(stats || {});
			} else if (page.preview === "upload" || page.preview === "calendar") {
				const queue = await uploadPostGet(
					`/uploadposts/schedule?username=${encodeURIComponent(profile)}`,
				);
				setPosts(queue?.scheduled_posts || []);
			}
			setState("ready");
		} catch (e) {
			setError(String((e as Error)?.message || e).slice(0, 200));
			setState("error");
		}
	}, [page.preview]);

	useEffect(() => {
		load();
	}, [load]);

	if (state === "loading") {
		return (
			<div className="card p-4 flex items-center gap-2 text-sm text-muted">
				<RefreshCw size={14} className="animate-spin" /> loading your accounts…
			</div>
		);
	}
	if (state === "nokey") return <KeyPrompt />;
	if (state === "error") {
		return (
			<div className="card p-4 space-y-3">
				<p className="text-sm text-ink flex items-center gap-2">
					<AlertCircle size={15} className="text-danger" /> Upload-Post refused the request
				</p>
				<p className="text-xs text-muted break-words">{error}</p>
				<button onClick={load} className="text-xs text-ink3 hover:text-ink underline">
					try again
				</button>
			</div>
		);
	}

	const profile = profiles[0]?.username || "";

	return (
		<div className="space-y-2">
			{page.preview === "accounts" && <Accounts profiles={profiles} />}
			{(page.preview === "upload" || page.preview === "calendar") && (
				<Schedule posts={posts} title={page.preview === "calendar" ? "queue" : "scheduled posts"} />
			)}
			{page.preview === "analytics" && <Analytics metrics={metrics} profile={profile} />}
			<p className="text-xs text-muted flex items-center gap-1.5">
				reading your own Upload-Post profile ·{" "}
				<button onClick={load} className="underline hover:text-ink">
					refresh
				</button>
			</p>
		</div>
	);
}
