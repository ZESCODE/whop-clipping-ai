/* /auto-clip and /youtube-automation: the two pages about running a channel's
 * clipping without opening the app.
 *
 * Every rule stated here is a constant in cloud/autopilot.py (checked
 * 23-sep-2026); if one changes there, change it here. Screenshots are the real
 * Autopilot tab in production with the connected channel's name, handle,
 * thumbnails and video titles blurred: that channel belongs to someone who did
 * not agree to be on a marketing page. The usage numbers are aggregates over
 * all accounts from usage_ledger, nothing per user.
 */

import { SITE } from './data.js'
import { esc } from './render.js'

const PUBLISHED = '2026-09-23'

const faqBlock = (faq) =>
  `<h2>Questions, answered</h2><dl class="faq">${faq
    .map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`)
    .join('')}</dl>`

const sources = (items) =>
  `<h2>Our sources</h2><ul class="sources">${items.map((s) => `<li>${s}</li>`).join('')}</ul>`

/* Checked against GET https://api.clippingai.local/api/billing/plans on
 * 23-sep-2026. Autopilot is in every paid plan and in none of the free ones. */
const PLANS = [
  ['Starter', '$12/month', '100 minutes'],
  ['Creator', '$29/month', '300 minutes'],
  ['Pro', '$59/month', '750 minutes'],
]

/* usage_ledger, job_type "process", status committed, 24-aug to 23-sep-2026. */
const USAGE = { jobs: '4,641', minutes: '56,590', median: 12, window: '24 August to 23 September 2026' }

const plansTable = `
<table>
<thead><tr><th>Plan</th><th>Price</th><th>Source footage each month</th><th>Autopilot</th></tr></thead>
<tbody>
<tr><td>Free</td><td>$0</td><td>20 minutes, with a watermark</td><td>No (clip manually)</td></tr>
${PLANS.map(([n, p, m]) => `<tr><td class="os">${n}</td><td>${p}</td><td>${m}</td><td class="yes">Yes</td></tr>`).join('\n')}
</tbody>
</table>
<p class="sources">Prices pulled from the Clipping AI billing API, checked 23 September 2026. Pay yearly and you pay ten times the monthly rate.</p>`

const autoClip = () => ({
  path: '/auto-clip',
  title: 'Auto-Clip Your YouTube Videos Into Shorts | Clipping AI',
  description:
    'Autopilot turns every new YouTube upload into vertical shorts with captions and can post the standouts daily. See the rules, limits and price.',
  h1: 'Auto clip: every new YouTube upload becomes shorts by itself',
  breadcrumb: [{ name: 'Use cases', path: '/use-cases' }, { name: 'Auto clip' }],
  published: PUBLISHED,
  updated: PUBLISHED,
  relatedTitle: 'You might also like',
  related: ['/youtube-automation', '/n8n-youtube-shorts-automation', '/how-clipping-ai-works'],
  cta: {
    label: 'Autopilot',
    title: 'Link your channel once',
    body: 'Bundled into every paid plan from $12/month. Even on the free plan you can still cut any video manually.',
    button: 'Launch Autopilot',
    href: `${SITE.url}/#app?tab=autopilot`,
  },
  tldr: [
    'Auto clipping is software that watches a long video, picks the bits that work on their own and cuts them into short vertical clips. Clipping AI does it for any link you paste; Autopilot does it for every fresh upload on your YouTube channel, without you lifting a finger.',
    'Autopilot swings by your channel roughly hourly, clips each new upload (only videos posted after you flip it on, no more than one a day, the first 10 to 90 minutes of each), emails you when they are ready and, if you enable autopublish, lines up the best 1 to 5 at one a day on TikTok, Instagram and YouTube Shorts.',
  ],
  body: `
<h2>How "auto clip" works, step by step</h2>
<ol>
<li><strong>Transcribe.</strong> Audio is captured with word-level timestamps, so each clip can begin and end right on a word.</li>
<li><strong>Spot the cuts.</strong> Scene detection flags every place the picture shifts.</li>
<li><strong>Rank the moments.</strong> Google Gemini reads the transcript and scores 15 to 60 second stretches on how well they stand alone and hold attention, then keeps the best 3 to 15.</li>
<li><strong>Reframe to 9:16.</strong> Face tracking holds the speaker in shot; screen recordings and two-person shots get layouts of their own.</li>
<li><strong>Add captions and a title.</strong> Captions are burned in from the transcript, and every clip gets a hook plus a title.</li>
</ol>
<p>The pipeline is identical whether you paste a link yourself or Autopilot kicks
it off. The details live on <a href="/how-clipping-ai-works">how Clipping AI works</a>.
Across all accounts, Clipping AI Cloud ran ${USAGE.jobs} clipping jobs on
${USAGE.minutes} minutes of source video between ${USAGE.window}; the median
source video was ${USAGE.median} minutes long.</p>

<h2>Autopilot: your channel clips itself</h2>
<figure class="shot">
<img src="/screens/autopilot-settings.webp" width="920" height="672" loading="eager"
     alt="The Clipping AI Autopilot tab: a linked YouTube channel, Autopilot switched on with the first 10 minutes of each video selected, and autopublish left off.">
<figcaption>The live Autopilot tab, 23 September 2026. The channel name is blurred because it belongs to a real user.</figcaption>
</figure>
<p>Link your YouTube channel once. From there Autopilot reads your uploads
through the YouTube account you connected, so it also catches videos you post
straight to YouTube, and runs them through the normal pipeline. The rules are
intentionally cautious, since it spends your plan's minutes while you are not
watching:</p>
<ul>
<li><strong>Fresh uploads only.</strong> Flipping it on never touches your back catalogue: just videos published after that point, and only while they are 3 days old or newer.</li>
<li><strong>One auto video daily.</strong> Post three videos in a day and the extras wait for you. You can still cut up to 5 more a day by hand from that same tab.</li>
<li><strong>A per-video ceiling.</strong> Autopilot clips the first 10, 20, 30, 45, 60 or 90 minutes of each video (30 by default), so a three-hour stream cannot drain your plan.</li>
<li><strong>Shorts get skipped.</strong> Anything already a Short will not be clipped twice.</li>
<li><strong>You get an email</strong> once a video's clips are ready.</li>
</ul>

<figure class="shot">
<img src="/screens/autopilot-channel-videos.webp" width="920" height="454" loading="lazy"
     alt="The recent videos list in the Autopilot tab: each upload with its date, a clip count or not clipped, plus open and clip-it buttons.">
<figcaption>Your recent uploads, what Autopilot did with each, and a "clip it" button for any of them. Titles and thumbnails blurred.</figcaption>
</figure>

<h2>Autopublish: the standouts go out one a day</h2>
<p>Switched off out of the box. Turn it on and, for each video, Autopilot grabs
the 1 to 5 clips with the top predicted scores (3 by default) and schedules one
per day at the hour you pick, in your own time zone, on the accounts you choose:
TikTok, Instagram and YouTube Shorts. TikTok clips land as drafts in your TikTok
inbox, so you open the app to post them. Keep autopublish off and you review and
post each clip yourself.</p>

<h2>What it costs</h2>
<p>Autopilot draws from your plan's minutes, so it comes with the paid plans and
not the free one. A 30-minute cap per video spends no more than 30 minutes of
your allowance on that video.</p>
${plansTable}
<p>The free plan still bundles the clip generator itself: 20 minutes a month,
with a watermark, cut by hand. You can also stitch the same automation together
with the <a href="/n8n-youtube-shorts-automation">n8n workflow</a>.</p>

<h2>What it leaves out</h2>
<ul>
<li>It keeps an eye on YouTube and Twitch. Twitch is read-only: Autopilot lists your past broadcasts, waits for a stream to finish, cuts the stretch your viewers clipped most rather than the opening minutes, and never posts back to Twitch. Podcasts, Kick VODs or local files must be pasted in or sent through <a href="/automate-shorts-api">the API</a>.</li>
<li>It cannot promise views. It chooses the moments the model rates highest; some weeks those will miss, which is exactly why autopublish stays off until you switch it on.</li>
<li>It is fresh: Autopilot went live on 22 September 2026.</li>
</ul>

${faqBlock([
  {
    q: 'What is auto clipping?',
    a: 'Software that scans a long video, finds the moments that work on their own and cuts them into short vertical clips with subtitles, instead of you scrubbing the timeline yourself. Clipping AI delivers 3 to 15 clips of 15 to 60 seconds per video.',
  },
  {
    q: 'Can Clipping AI clip my new YouTube videos automatically?',
    a: 'Yes. Autopilot checks your linked channel roughly once an hour and clips each new video by itself: only videos published after you flip it on, no more than one a day, up to the minute cap you set.',
  },
  {
    q: 'Does Autopilot post the clips for me?',
    a: 'Only once you enable autopublish. It then schedules the best 1 to 5 clips of each video at one a day on TikTok, Instagram and YouTube Shorts. TikTok clips show up as drafts you post from the app.',
  },
  {
    q: 'Is automatic clipping free?',
    a: 'Cutting a video you paste is free for 20 minutes a month. Autopilot, which runs hands-free, comes with the paid plans from $12/month.',
  },
  {
    q: 'Will it clip my whole back catalogue and burn through my minutes?',
    a: 'No. It only picks up videos published after you flip it on, at most 3 days old, one a day, and only the first 10 to 90 minutes of each.',
  },
  {
    q: 'Can Autopilot clip my Twitch streams?',
    a: 'Yes. Link Twitch in the Autopilot tab (read-only) and each new past broadcast is clipped once the stream ends, under the same rules. Rather than the opening minutes, it cuts the stretch your viewers clipped most, since the start of a stream is usually a "starting soon" screen.',
  },
])}

${sources([
  `Autopilot rules: <code>cloud/autopilot.py</code> on the Clipping AI backend, checked 23 September 2026.`,
  'Usage numbers: the Clipping AI Cloud billing ledger, all accounts combined, 24 August to 23 September 2026.',
])}
`,
  faq: [
    { q: 'What is auto clipping?', a: 'Software that finds the parts of a long video that work on their own and cuts them into short vertical clips with subtitles. Clipping AI delivers 3 to 15 clips of 15 to 60 seconds per video.' },
    { q: 'Can Clipping AI clip my new YouTube videos automatically?', a: 'Yes. Autopilot checks your linked channel roughly once an hour and clips each new video: only videos published after you flip it on, no more than one a day.' },
    { q: 'Does Autopilot post the clips for me?', a: 'Only once you enable autopublish. It then schedules the best 1 to 5 clips of each video at one a day on TikTok, Instagram and YouTube Shorts.' },
    { q: 'Is automatic clipping free?', a: 'Cutting a pasted video is free for 20 minutes a month. Autopilot comes with the paid plans from $12/month.' },
    { q: 'Can Autopilot clip my Twitch streams?', a: 'Yes. Link Twitch in the Autopilot tab (read-only) and each new past broadcast is clipped once the stream ends, from the stretch your viewers clipped most rather than the opening minutes.' },
  ],
})

const youtubeAutomation = () => ({
  path: '/youtube-automation',
  title: 'YouTube Automation for Shorts, Step by Step | Clipping AI',
  description:
    'Automate the grind of a real YouTube channel: turn every upload into Shorts, schedule them, or hook it up to n8n, the API or Claude through MCP.',
  h1: 'YouTube automation: hand the grunt work to software, keep the channel yours',
  breadcrumb: [{ name: 'Use cases', path: '/use-cases' }, { name: 'YouTube automation' }],
  published: PUBLISHED,
  updated: PUBLISHED,
  relatedTitle: 'You might also like',
  related: ['/auto-clip', '/n8n-youtube-shorts-automation', '/mcp'],
  cta: {
    label: 'No code needed',
    title: 'Switch on Autopilot for your channel',
    body: 'Every fresh upload clipped by itself, standout clips scheduled one a day if you like. In every paid plan from $12/month.',
    button: 'Open Autopilot',
    href: `${SITE.url}/#app?tab=autopilot`,
  },
  tldr: [
    '"YouTube automation" means two different things. One is faceless channels mass-producing videos from templates, which YouTube demonetises as inauthentic content. The other is taking the grunt work off a real channel: cutting each long video into Shorts, writing the metadata, scheduling the posts. This page is about the second.',
    'With Clipping AI you get three routes: Autopilot in the app (no code), the n8n template (you approve each clip from Telegram), or the REST API and MCP server for your own scripts and for agents like Claude and ChatGPT.',
  ],
  body: `
<h2>What is worth automating on a YouTube channel</h2>
<p>The jobs that never need your judgement, week after week:</p>
<ul>
<li><strong>Cutting Shorts from each long video.</strong> Finding the moments, reframing to 9:16, adding captions. It is the slowest part by hand and the simplest to automate well.</li>
<li><strong>Posting them on a schedule</strong> to YouTube Shorts, TikTok and Instagram, one a day rather than all at once.</li>
<li><strong>A first draft of titles, descriptions and tags.</strong> You still do the editing; the free <a href="/youtube-tag-generator">tag, title and description generator</a> writes it.</li>
<li><strong>Transcripts</strong> for show notes and blog posts, courtesy of the <a href="/youtube-transcript-generator">transcript generator</a>.</li>
</ul>
<p>What stays with you: the long video itself, and the call on what to publish.
YouTube changed its monetisation policy on 15 July 2025 to call out "inauthentic
content", which covers "AI-generated content made with generic or unoriginal
templates giving the impression of mass production". Automating the chores of a
channel you genuinely make is not that. Manufacturing the channel is.</p>

<h2>Three routes to automation, from no code to full control</h2>
<table>
<thead><tr><th>Route</th><th>Who it suits</th><th>Do you approve each post?</th><th>What you need</th></tr></thead>
<tbody>
<tr><td class="os">Autopilot</td><td>Creators who want it handled, no setup</td><td>Your call: autopublish on or off</td><td>A paid plan, your YouTube channel linked</td></tr>
<tr><td class="os">n8n template</td><td>People already running n8n</td><td>Yes, from Telegram</td><td>n8n, a Clipping AI API key, a Telegram bot</td></tr>
<tr><td class="os">API and MCP</td><td>Developers and AI agents</td><td>Whatever your code decides</td><td>An API key, or a claude.ai / ChatGPT connector</td></tr>
</tbody>
</table>

<h2>Route 1: Autopilot, zero code</h2>
<ol>
<li>Sign in to Clipping AI and open the <strong>Autopilot</strong> tab.</li>
<li>Link your YouTube channel.</li>
<li>Flip Autopilot on, confirm you own the content, and pick how many minutes of each video to clip (10 to 90).</li>
<li>Optionally enable autopublish: pick TikTok, Instagram and/or YouTube Shorts, how many clips per video (1 to 5) and the posting hour.</li>
</ol>
<figure class="shot">
<img src="/screens/autopilot-settings.webp" width="920" height="672" loading="eager"
     alt="The Clipping AI Autopilot settings: linked channel, Autopilot on with a 10-minute cap, autopublish off.">
<figcaption>Autopilot live in production, 23 September 2026. Channel name blurred.</figcaption>
</figure>
<p>From there Autopilot checks your channel roughly hourly, kicks off a job for
each fresh upload it finds and emails you when the clips are ready. The precise rules (one automatic
video a day, new videos only, Shorts skipped) live on the
<a href="/auto-clip">auto clip page</a>.</p>

<h2>Route 2: the n8n template, with a human in the loop</h2>
<figure class="shot">
<img src="/n8n-content-machine-workflow.png" width="950" height="750" loading="lazy"
     alt="The Clipping AI content machine workflow open in n8n, running from the channel trigger through Telegram approval to weekly analytics.">
<figcaption>The importable n8n workflow: watch the channel, clip, approve from Telegram, drip out posts, report weekly.</figcaption>
</figure>
<p>Already running n8n? The free <a href="/n8n-youtube-shorts-automation">n8n YouTube
Shorts template</a> does the same job with one difference that counts: every
clip lands in your Telegram with Publish and Skip buttons, and nothing goes out
until you tap Publish. It reads your channel's public RSS feed, so no YouTube
API key is needed.</p>

<h2>Route 3: the API and MCP, for your code and your agents</h2>
<p>Anything the app can do is one HTTP call away. <code>POST /api/process</code>
takes a video URL and a <code>webhook_url</code>, and Clipping AI calls you back
once with the finished clips; the details and a working example are on
<a href="/automate-shorts-api">automate shorts with the API</a>. The same
pipeline is also served up as an MCP server, so Claude, ChatGPT, Cursor or n8n's
agent node can clip and publish when you ask in plain language.</p>
<figure class="shot">
<img src="/screens/connect-an-agent.webp" width="684" height="366" loading="lazy"
     alt="The connect-an-agent card in the Clipping AI account page, with setup steps for claude.ai and the MCP server URL https://mcp.clippingai.local/mcp.">
<figcaption>Hooking up Claude takes a single URL: <code>https://mcp.clippingai.local/mcp</code>. The card also carries tabs for ChatGPT, Claude Code, Claude Desktop, Cursor, n8n and curl.</figcaption>
</figure>
<p>Read more about the tools on offer on the <a href="/mcp">MCP server page</a>.</p>

<h2>What it costs</h2>
<p>Autopilot, the API and MCP all draw on the same minutes as the app: 20 free
minutes a month on the free plan (Autopilot itself needs a paid plan), then
$12/month for 100 minutes, $29 for 300 or $59 for 750, as of 23 September 2026.</p>

${faqBlock([
  {
    q: 'Is YouTube automation allowed?',
    a: 'Automating chores on a channel you create is fine. What YouTube will not monetise is inauthentic content: mass-produced, generic or repetitive videos, including AI-generated content built from generic templates. Clipping your own long videos into Shorts is not that.',
  },
  {
    q: 'Can I automate YouTube Shorts from my long videos?',
    a: 'Yes. Clipping AI Autopilot turns each new upload on your channel into vertical Shorts with captions and can schedule the standouts one a day. The n8n template and the API do the same for people building their own flow.',
  },
  {
    q: 'Do I need to code?',
    a: 'No. Autopilot is a switch in the app. The n8n template needs n8n; the API and MCP server are for developers and AI agents.',
  },
  {
    q: 'Can an AI agent run my channel with Clipping AI?',
    a: 'An agent like Claude or ChatGPT can call Clipping AI over MCP to clip a video, list the clips and publish them. Whether it posts without asking is down to how you set it up; the n8n template keeps a human approval step on purpose.',
  },
])}

${sources([
  '<a href="https://support.google.com/youtube/answer/1311392" rel="noopener">YouTube channel monetization policies</a> (inauthentic content, renamed from repetitious content on 15 July 2025), checked 23 September 2026.',
  `Autopilot rules: <code>cloud/autopilot.py</code> on the Clipping AI backend; plan prices from the Clipping AI billing API. Both checked 23 September 2026.`,
])}
`,
  faq: [
    { q: 'Is YouTube automation allowed?', a: 'Automating chores on a channel you create is fine. YouTube will not monetise inauthentic content: mass-produced, generic or repetitive videos, including AI-generated content built from generic templates.' },
    { q: 'Can I automate YouTube Shorts from my long videos?', a: 'Yes. Clipping AI Autopilot turns each new upload into vertical Shorts with captions and can schedule the standouts one a day.' },
    { q: 'Do I need to code?', a: 'No. Autopilot is a switch in the app. The n8n template needs n8n; the API and MCP server are for developers and AI agents.' },
  ],
})

export function autopilotPages() {
  return [autoClip(), youtubeAutomation()]
}
