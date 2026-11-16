/**
 * Copy for the four publishing pages. One component renders all of them
 * (components/SocialFeaturePage.jsx); only the copy and the mock preview change.
 *
 * The product being described is Upload-Post, reached through our connect
 * link. Nothing here talks to its API: the pages are the affiliate funnel, so
 * they must stay honest about what happens after the click (the visitor signs
 * in on each network's own screen, inside Upload-Post).
 */
export type SocialSlug = "user" | "upload" | "calendar" | "analytics";

export type SocialFeature = { title: string; body: string };

export type SocialPageContent = {
	slug: SocialSlug;
	navLabel: string;
	eyebrow: string;
	title: string;
	lede: string;
	preview: "accounts" | "upload" | "calendar" | "analytics";
	features: SocialFeature[];
	steps: string[];
	cta: string;
	secondary: { href: string; label: string };
};

const CTA = "Connect your accounts";
const SECONDARY = { href: "/platforms", label: "See every platform" };

export const SOCIAL_PAGES: Record<SocialSlug, SocialPageContent> = {
	user: {
		slug: "user",
		navLabel: "Accounts",
		eyebrow: "Publish",
		title: "Your social accounts, connected once",
		lede:
			"TikTok, Instagram, YouTube, LinkedIn and eighteen more networks behind one connect link. Each network runs its own sign-in screen, so no password ever reaches Clipping AI or the publishing layer.",
		preview: "accounts",
		features: [
			{
				title: "One link per brand",
				body:
					"The connect page carries your logo, your title and your button. Send it once; the accounts stay attached to that brand, not to a device.",
			},
			{
				title: "Read-only option",
				body:
					"Prefer to stay hands-off? The link can open a view-only calendar, so a client sees what is queued without being able to change it.",
			},
			{
				title: "Reconnect, don't rebuild",
				body:
					"Expired tokens are flagged and re-signed in place. Nothing to re-upload, no captions to redo.",
			},
		],
		steps: [
			"Create a profile for the brand",
			"Share the branded connect link",
			"Sign in on each network's own screen",
		],
		cta: CTA,
		secondary: SECONDARY,
	},
	upload: {
		slug: "upload",
		navLabel: "Upload",
		eyebrow: "Publish",
		title: "One clip out to every platform",
		lede:
			"Send a finished vertical video to TikTok, Reels, Shorts, LinkedIn and the rest from a single request. Publish now or queue it for later; each network gets its own title and caption.",
		preview: "upload",
		features: [
			{
				title: "Per-network captions",
				body:
					"Write one caption per platform in the same request. Hashtags, mentions and link limits stop being a copy-paste chore.",
			},
			{
				title: "Schedule while you sleep",
				body:
					"Attach a publish time and the queue holds it. The calendar page shows exactly what goes out when.",
			},
			{
				title: "Cancellation and retry",
				body:
					"Pull a queued post before it fires, or retry one that failed on a single network without touching the others.",
			},
		],
		steps: [
			"Pick the clip from your library",
			"Choose the networks and write the caption",
			"Send now, or schedule it",
		],
		cta: CTA,
		secondary: { href: "/app", label: "Open the clipper" },
	},
	calendar: {
		slug: "calendar",
		navLabel: "Calendar",
		eyebrow: "Publish",
		title: "Your month at a glance",
		lede:
			"Everything queued across every brand, in one calendar. Move a post to another day, open a preview, or delete a slot before it goes out.",
		preview: "calendar",
		features: [
			{
				title: "One queue, many brands",
				body:
					"Each brand keeps its own profile, so the calendar never mixes one client's posts into another's.",
			},
			{
				title: "Preview before it posts",
				body:
					"Each scheduled item carries a preview of the video as it will appear, caption included.",
			},
			{
				title: "Share the view",
				body:
					"Send the read-only link to whoever approves the plan. They can look, not touch.",
			},
		],
		steps: [
			"Open the calendar for a brand",
			"Drop clips onto a day",
			"Share the read-only link for approval",
		],
		cta: CTA,
		secondary: { href: "/tools", label: "Free tools" },
	},
	analytics: {
		slug: "analytics",
		navLabel: "Analytics",
		eyebrow: "Publish",
		title: "Numbers per platform",
		lede:
			"Impressions, engagement and per-post results for each connected account, pulled per brand so a report is one request rather than seven logins.",
		preview: "analytics",
		features: [
			{
				title: "Per profile, per platform",
				body:
					"Ask for one brand and one network, or all of them. The numbers stay attached to the profile that owns the accounts.",
			},
			{
				title: "Per post detail",
				body:
					"Drill from a total into a single clip: which network carried it and how it landed.",
			},
			{
				title: "Fits your own dashboard",
				body:
					"Plain JSON over HTTPS, so the numbers land in your own reporting without exporting a CSV first.",
			},
		],
		steps: [
			"Connect the accounts",
			"Publish for a few days",
			"Read the totals per network",
		],
		cta: CTA,
		secondary: { href: "/pricing", label: "See plans" },
	},
};
