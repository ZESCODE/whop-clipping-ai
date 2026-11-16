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

const CTA = "Connect Your Accounts";
const SECONDARY = { href: "/platforms", label: "See All Platforms" };

export const SOCIAL_PAGES: Record<SocialSlug, SocialPageContent> = {
	user: {
		slug: "user",
		navLabel: "Connections",
		eyebrow: "Go Live",
		title: "Link Every Social Account Once",
		lede:
			"Bring TikTok, Instagram, YouTube, LinkedIn and eighteen other networks together with a single connect link. Every network handles its own sign-in, so no password ever touches Clipping AI or the publishing layer.",
		preview: "accounts",
		features: [
			{
				title: "A Link for Every Brand",
				body:
					"Your connect page carries your logo, your headline and your button. Share it once — the accounts stay tied to the brand, not to any one device.",
			},
			{
				title: "View-Only Mode",
				body:
					"Want to stay hands-off? The link can open a read-only calendar, so a client sees what's queued without changing a thing.",
			},
			{
				title: "Reconnect Without Redoing",
				body:
					"Expired tokens get flagged and re-signed in place. Nothing to re-upload, no captions to rewrite.",
			},
		],
		steps: [
			"Set up a profile for the brand",
			"Share your branded connect link",
			"Sign in on each network's own screen",
		],
		cta: CTA,
		secondary: SECONDARY,
	},
	upload: {
		slug: "upload",
		navLabel: "Publish",
		eyebrow: "Distribute",
		title: "One Clip, Every Platform",
		lede:
			"Ship a finished vertical video to TikTok, Reels, Shorts, LinkedIn and beyond in one go. Post immediately or schedule it — every network gets its own title and caption.",
		preview: "upload",
		features: [
			{
				title: "Captions per Network",
				body:
					"Write a separate caption for each platform in the same request. Hashtags, mentions and link limits stop being a copy-paste headache.",
			},
			{
				title: "Set It and Schedule It",
				body:
					"Add a publish time and the queue holds it. The calendar shows exactly what goes out, and when.",
			},
			{
				title: "Pull Back or Retry",
				body:
					"Cancel a queued post before it fires, or retry one that flopped on a single network without touching the rest.",
			},
		],
		steps: [
			"Grab a clip from your library",
			"Pick networks and write captions",
			"Post now or schedule it",
		],
		cta: CTA,
		secondary: { href: "/app", label: "Open the studio" },
	},
	calendar: {
		slug: "calendar",
		navLabel: "Calendar",
		eyebrow: "Plan",
		title: "Your Whole Month at a Glance",
		lede:
			"Every queued post across every brand, on one calendar. Shift a post to another day, open a preview, or delete a slot before it goes live.",
		preview: "calendar",
		features: [
			{
				title: "One Queue, Many Brands",
				body:
					"Each brand keeps its own profile, so one client's posts never bleed into another's.",
			},
			{
				title: "Preview Before Publishing",
				body:
					"Every scheduled item shows the video exactly as it will appear, caption included.",
			},
			{
				title: "Share the View",
				body:
					"Send the view-only link to whoever signs off on the plan. They can look, not touch.",
			},
		],
		steps: [
			"Open a brand's calendar",
			"Drop clips onto a day",
			"Share the view-only link for approval",
		],
		cta: CTA,
		secondary: { href: "/tools", label: "Free Tools" },
	},
	analytics: {
		slug: "analytics",
		navLabel: "Analytics",
		eyebrow: "Measure",
		title: "Stats by Platform",
		lede:
			"Impressions, engagement and per-post results for every connected account — pulled per brand, so a report takes one request instead of seven logins.",
		preview: "analytics",
		features: [
			{
				title: "By Profile, by Platform",
				body:
					"Pull one brand and one network, or all of them. The numbers stay tied to the profile that owns the accounts.",
			},
			{
				title: "Down to Each Post",
				body:
					"Drill from a total into a single clip: which network carried it and how it landed.",
			},
			{
				title: "Fits Your Dashboard",
				body:
					"Plain JSON over HTTPS, so the numbers land in your own reporting — no CSV export needed.",
			},
		],
		steps: [
			"Connect your accounts",
			"Publish for a few days",
			"Read totals per network",
		],
		cta: CTA,
		secondary: { href: "/pricing", label: "See Plans" },
	},
};
