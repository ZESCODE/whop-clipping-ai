/* Topic hubs: /platforms, /use-cases and /how-to.
 *
 * Each hub is the parent of a cluster. The platform pages and the sermon page
 * live under their hub's path (/platforms/youtube, /use-cases/sermons, ...);
 * the pages that were already ranking on a flat URL (/podcast-to-shorts,
 * /gta-5-clips, /auto-clip, /how-clipping-ai-works, ...) stay where they are and
 * are only listed here, with a breadcrumb pointing back at the hub.
 *
 * A card is rendered only when a page with that path is actually built (the
 * same rule llms.txt uses for its key pages), so a hub can name a page another
 * module adds and never links to a 404 before that page ships.
 *
 * Same rules as the rest of the SEO surface: nothing invented, the free plan is
 * always stated with its watermark and the paid price next to it, no em dashes.
 */

import { SITE, EDITIONS } from './data.js'
import { esc } from './render.js'

const PUBLISHED = '2026-10-29'
const CLOUD = EDITIONS.cloud
// Checked against data.js like clip-tools.js does, so the hubs cannot drift.
const FIRST_VIDEO_MINUTES = 60
if (!CLOUD.summary.includes(`up to ${FIRST_VIDEO_MINUTES} minutes`)) {
  throw new Error('[hub-pages] EDITIONS.cloud.summary no longer says the first video is free up to ' +
    `${FIRST_VIDEO_MINUTES} minutes; update FIRST_VIDEO_MINUTES in seo/hub-pages.js`)
}
const PRICE_LINE =
  `Your first video is on the house on Clipping AI Cloud, up to ${FIRST_VIDEO_MINUTES} minutes; after that you get ${CLOUD.freeMinutes} minutes a month, ` +
  `complete with a watermark and no card; paid plans start at $${CLOUD.lowPrice}/month with no watermark ` +
  '(<a href="/pricing">compare every plan</a>).'

/* Cards for the entries that exist in `built` (path -> page), in list order. */
const cardsFor = (entries, built) => entries.filter((e) => built.has(e.path))

const cardGrid = (cards) => `
<div class="tools-grid">
${cards.map((c) => `<a href="${c.path}"><strong>${esc(c.name)}</strong><span>${esc(c.blurb)}</span></a>`).join('\n')}
</div>`

/* The hub's children as an ItemList, next to the Article the renderer emits. */
const itemList = (path, name, cards) => ({
  '@type': 'ItemList',
  '@id': `${SITE.url}${path}#list`,
  name,
  itemListElement: cards.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    url: `${SITE.url}${c.path}`,
  })),
})

const hub = (path, extra) => ({
  path,
  published: PUBLISHED,
  updated: PUBLISHED,
  ogType: 'website',
  relatedTitle: 'Keep exploring',
  faq: [],
  ...extra,
})

/* ------------------------------------------------------------------ /platforms */

export const PLATFORM_CHILDREN = [
  { path: '/platforms/youtube', name: 'YouTube clip creator', blurb: 'Drop in a YouTube link and get vertical clips with captions and an opening hook.' },
  { path: '/platforms/youtube-shorts', name: 'YouTube Shorts builder', blurb: 'Turn long videos into Shorts, then post or schedule them to your channel.' },
  { path: '/platforms/tiktok', name: 'TikTok clip creator', blurb: 'Slice a long video into TikToks and send them to your TikTok inbox as drafts.' },
  { path: '/platforms/instagram-reels', name: 'AI Reels maker', blurb: 'Reels posted directly to Instagram, with Facebook Reels saved as files.' },
  { path: '/platforms/twitch', name: 'Twitch clip creator', blurb: 'Chop hours-long VODs into clips, keeping the facecam in view.' },
  { path: '/platforms/kick', name: 'Kick clip creator', blurb: 'Kick VOD and clip links, with layouts for IRL and facecam.' },
]

const PLATFORM_EXTRAS = [
  { path: '/youtube-to-shorts-converter', name: 'YouTube-to-Shorts converter', blurb: 'One link, one quick answer: paste it and get 9:16 clips with subtitles.' },
  { path: '/tools/tiktok-transcript-generator', name: 'TikTok transcript maker', blurb: 'Get the words from any TikTok as text, free and no sign-up.' },
]

/* Destination and source specs. Lengths are the ones the platform pages state
 * with their sources (YouTube help, Instagram's announcement, TikTok's
 * Content Posting API), checked 28 October 2026. The caption line is what the
 * renderer does on every clip (subtitles.SAFE_MARGIN_V). */
const SPECS_CHECKED = '28 October 2026'
const CAPTIONS = 'Sits about 15% of the frame height above the bottom edge, clear of the caption and music strip'
const PLATFORM_SPECS = [
  ['YouTube Shorts', 'Destination', 'Up to 3 minutes', 'Vertical or square; our clips are 9:16', CAPTIONS, 'Goes to your channel, or on a schedule'],
  ['TikTok', 'Destination', 'Bigger uploads fine; clips here reach 180 s', '9:16', CAPTIONS, 'Lands in your TikTok inbox as a draft, finished in the app'],
  ['Instagram Reels', 'Destination', 'Up to 3 minutes', '9:16', CAPTIONS, 'Published to Instagram, or scheduled'],
  ['Facebook Reels', 'Destination', 'Clips up to 180 s', '9:16', CAPTIONS, 'Grab the MP4 and post it yourself'],
  ['YouTube', 'Source', 'Any public video, cut from your minute balance', '16:9 in, 9:16 out', 'Word-by-word, pulled from the transcript', 'n/a (one video link at a time)'],
  ['Twitch and Kick', 'Source', 'Hours-long VODs, cut into sections', '16:9 in, facecam stacked below the gameplay', 'Word-by-word, pulled from the transcript', 'Nothing posted back; clips head to Shorts, TikTok or Reels'],
]

const specsTable = () => `
<table>
<thead><tr><th>Platform</th><th>Role</th><th>Max length</th><th>Aspect</th><th>Captions safe zone</th><th>Posting via Clipping AI</th></tr></thead>
<tbody>
${PLATFORM_SPECS.map(([name, ...cells]) => `<tr><td class="os">${esc(name)}</td>${cells.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('\n')}
</tbody>
</table>`

const platformsHub = (built) => {
  const children = cardsFor(PLATFORM_CHILDREN, built)
  const extras = cardsFor(PLATFORM_EXTRAS, built)
  return hub('/platforms', {
    title: 'AI Clips for YouTube, TikTok, Reels & Beyond | Clipping AI',
    description: `A single AI clip generator for YouTube, Shorts, TikTok, Instagram Reels, Twitch and Kick: what each platform takes and how clips reach it. First video free up to ${FIRST_VIDEO_MINUTES} min.`,
    h1: 'AI clips for every platform: YouTube, TikTok, Reels, Twitch & Kick',
    lede: 'The clip generator works the same no matter where you publish: it scans the entire video, picks the moments that work alone and cuts them to 9:16 with captions. What shifts between platforms is where the video starts, how long a clip can run and how it gets shared.',
    breadcrumb: [{ name: 'Platforms' }],
    related: ['/use-cases', '/how-to', '/tools'],
    extraNodes: [itemList('/platforms', 'Clipping AI clip makers by platform', [...children, ...extras])],
    body: `
<h2>Choose your platform</h2>
<p>Every page below covers a single source or destination: the links it takes,
the layout it uses, and what happens once the clip is cut.</p>
${cardGrid(children)}

<h2>Platform specs side by side</h2>
<p class="checked">Platform limits checked ${esc(SPECS_CHECKED)} against each platform's own help pages; sources are listed on every platform page.</p>
${specsTable()}
<p>Clips run 15 to 60 seconds by default, since most moments that work alone
last about that long; you can push the ceiling to 180 seconds in the advanced
settings. Every clip is at least 1080 pixels wide, so a 1080p source yields
1080x1920. Captions sit above the bottom strip where TikTok, Reels and Shorts
paint the username, description and music ticker, so the download and the
posted clip look identical.</p>

<h2>Sources and destinations play different roles</h2>
<p>YouTube, Twitch and Kick are usually where the long video starts. A podcast
episode, a stream VOD or an interview gets scanned end to end and split into
several clips. YouTube Shorts, TikTok and Instagram Reels are where those clips
end up. Post the same clip to all three from the dashboard, spread them across
the week, or download an MP4 to use anywhere.</p>
${extras.length ? `<div class="cluster">${extras.map((c) => `<a href="${c.path}"><strong>${esc(c.name)}</strong><span>${esc(c.blurb)}</span></a>`).join('')}</div>` : ''}

<h2>What it costs</h2>
<p>${PRICE_LINE}</p>
`,
  })
}

/* ------------------------------------------------------------------ /use-cases */

export const USE_CASE_CHILDREN = [
  { path: '/podcast-to-shorts', name: 'Podcast clip creator', blurb: 'Podcast clips that keep both hosts in frame.' },
  { path: '/use-cases/sermons', name: 'Sermon clip creator', blurb: 'Isolate the sermon from a service, with the preacher tracked.' },
  { path: '/gta-5-clips', name: 'GTA 5 and gaming clips', blurb: 'Stream VODs with the webcam inset intact, and quiet gameplay still covered.' },
  { path: '/gta-6-clips', name: 'GTA 6 clips', blurb: 'Console captures and stream VODs into TikToks, facecam kept, silent footage covered.' },
  { path: '/wow-forever-clips', name: 'WoW Forever clips', blurb: 'Record your raids, then turn kills, wipes and Twitch VODs into vertical clips with the facecam intact.' },
  { path: '/auto-reframe', name: 'Auto reframe 9:16', blurb: 'Horizontal to vertical by tracking the speaker, stacking two, or holding the screen.' },
  { path: '/auto-clip', name: 'Auto clip', blurb: 'Every fresh upload on your channel clipped by itself, under your rules.' },
  { path: '/youtube-automation', name: 'YouTube automation', blurb: 'Autopilot, n8n or the API: automate a real channel, not a content mill.' },
  { path: '/ai-ugc-video-generator', name: 'AI Ad Video Maker', blurb: 'Short product videos with an AI presenter, for ads and social.' },
]

const caseHub = (built) => {
  const children = cardsFor(USE_CASE_CHILDREN, built)
  return hub('/use-cases', {
    title: 'AI Clips by Use Case: Podcasts, Sermons, Gaming | Clipping AI',
    description: `See how Clipping AI clips podcasts, sermons, gaming streams and entire channels: the layouts, the reframing and the automation behind each. First video free up to ${FIRST_VIDEO_MINUTES} min.`,
    h1: 'AI clips by use case: podcasts, sermons, gaming and hands-off channels',
    lede: 'A two-host podcast, a church service and a GTA stream each ask something different of a clip: keep both faces, isolate the sermon, stack the facecam under the game. These pages show what the clip generator does for each, and how to run it without ever opening the app.',
    breadcrumb: [{ name: 'Use cases' }],
    related: ['/platforms', '/how-to', '/how-clipping-ai-works'],
    extraNodes: [itemList('/use-cases', 'Clipping AI use cases', children)],
    body: `
<h2>Pick the use case</h2>
${cardGrid(children)}

<h2>What shifts between use cases</h2>
<ul>
<li><strong>Who stays in frame.</strong> A podcast holds both hosts, stacked when they talk over each other. A sermon tracks one preacher across the stage. A stream pins the facecam below the gameplay.</li>
<li><strong>What makes the cut.</strong> The transcript is scored for passages that make sense alone. Gameplay with little talking still gets clipped, so a quiet stream never comes back empty.</li>
<li><strong>How often it runs.</strong> One video at a time from the dashboard, or every fresh upload on a channel via Autopilot, n8n or the API.</li>
</ul>
<p>The reframing behind all of them is described on <a href="/auto-reframe">the
auto reframe page</a>, and the whole pipeline stage by stage on
<a href="/how-clipping-ai-works">how Clipping AI works</a>.</p>

<h2>What it costs</h2>
<p>${PRICE_LINE}</p>
`,
  })
}

/* --------------------------------------------------------------------- /how-to */

export const GUIDE_CHILDREN = [
  { path: '/how-to/clip-a-youtube-video', name: 'How to clip a YouTube video', blurb: 'Four free routes, from the Clip button to AI-cut vertical Shorts.' },
  { path: '/how-to/make-youtube-shorts', name: 'How to make YouTube Shorts', blurb: 'The app camera, a vertical upload, or Shorts cut from your long videos.' },
  { path: '/how-to/youtube-shorts-aspect-ratio', name: 'YouTube Shorts aspect ratio', blurb: '9:16 at 1080 x 1920, square allowed, up to 3 minutes, plus the safe zones.' },
  { path: '/how-to/instagram-reel-dimensions', name: 'Instagram Reel dimensions', blurb: '1080 x 1920, the 3:4 grid crop on the cover, safe zones and export settings.' },
  { path: '/how-to/make-a-reel-on-facebook', name: 'How to make a Reel on Facebook', blurb: 'The app, Meta Business Suite, specs and sharing Reels over from Instagram.' },
  { path: '/how-to/best-time-to-post-youtube-shorts', name: 'Best time to post YouTube Shorts', blurb: 'No one-size-fits-all hour: find when your viewers are online in Analytics and test it.' },
  { path: '/how-clipping-ai-works', name: 'How Clipping AI works', blurb: 'The full pipeline, from the link to a captioned 9:16 clip.' },
  { path: '/n8n-youtube-shorts-automation', name: 'Automate Shorts with n8n', blurb: 'The importable workflow: channel in, approved Shorts out.' },
  { path: '/automate-shorts-api', name: 'Automate Shorts with the API', blurb: 'One POST in, one signed webhook back, no polling.' },
  { path: '/mcp', name: 'Clip from an AI agent (MCP)', blurb: 'Run the whole pipeline from Claude, ChatGPT or n8n.' },
]

const guidesHub = (built) => {
  const children = cardsFor(GUIDE_CHILDREN, built)
  return hub('/how-to', {
    title: 'Clipping AI Guides: Clip & Automate',
    description: 'Step-by-step guides: clip a YouTube video, see how the pipeline works, and automate Shorts with n8n, the API or an AI agent.',
    h1: 'Clipping AI guides: clip and automate',
    lede: 'Guides for what people do with Clipping AI after clip one: figure out what it did, and get it running without them.',
    breadcrumb: [{ name: 'Guides' }],
    related: ['/platforms', '/use-cases', '/tools'],
    extraNodes: [itemList('/how-to', 'Clipping AI guides', children)],
    body: `
<h2>All guides</h2>
${cardGrid(children)}

<h2>Where to begin</h2>
<ul>
<li><strong>New to clipping?</strong> <a href="/how-to/clip-a-youtube-video">How to clip a YouTube video</a> weighs the free manual routes against letting the AI cut the Shorts.</li>
<li><strong>Need the specs or the steps?</strong> <a href="/how-to/youtube-shorts-aspect-ratio">YouTube Shorts aspect ratio</a> and <a href="/how-to/instagram-reel-dimensions">Instagram Reel dimensions</a> spell out sizes and safe zones; <a href="/how-to/make-youtube-shorts">how to make YouTube Shorts</a> and <a href="/how-to/make-a-reel-on-facebook">how to make a Reel on Facebook</a> walk you through it; <a href="/how-to/best-time-to-post-youtube-shorts">the best time to post Shorts</a> helps you find your own window.</li>
<li><strong>Curious what happens to your video?</strong> <a href="/how-clipping-ai-works">How Clipping AI works</a> walks through transcription, moment picking, reframing and captions.</li>
<li><strong>Want it running on autopilot?</strong> Start with <a href="/n8n-youtube-shorts-automation">the n8n workflow</a> for a channel, or <a href="/automate-shorts-api">the API</a> and <a href="/mcp">the MCP server</a> for your own code or agent.</li>
</ul>

<h2>What it costs</h2>
<p>${PRICE_LINE}</p>
`,
  })
}

/* `all` is every other built page; the hubs only link what is in it. */
export function hubPages(all) {
  const built = new Set(all.map((p) => p.path))
  return [platformsHub(built), caseHub(built), guidesHub(built)]
}
