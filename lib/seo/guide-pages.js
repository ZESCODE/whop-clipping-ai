/* Guide pages: the free-plan comparison, the "how to clip a
 * YouTube video" guide and the platform how-to guides (Reel and Shorts specs,
 * Facebook Reels, making Shorts, when to post). Pricing links go to the
 * standalone /pricing page (seo/pricing-page.js).
 *
 * Every price, minute and limit on these pages is read from data.js. Where a
 * fact had to be transcribed into a structured field (the free-plan table), the
 * transcription is checked against the data.js wording at build time, so a
 * change in data.js that the table no longer matches fails the build instead of
 * shipping a stale number.
 */

import { SITE, COMPETITORS, EDITIONS, PRICE_MODELS, PIPELINE_STEPS } from './data.js'
import { costCalculator, priceFor } from './components.js'
import { esc } from './render.js'

const PUBLISHED = '2026-10-28'

const faqBlock = (faq) =>
  `<h2>Questions people ask</h2><dl class="faq">${faq
    .map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`)
    .join('')}</dl>`

const sources = (items) =>
  `<h2>Sources & checks</h2><ul class="sources">${items.map((s) => `<li>${s}</li>`).join('')}</ul>`

/* Build-time guard: a transcribed fact must still appear in its data.js text. */
function assertIn(text, needle, where) {
  if (!String(text).toLowerCase().includes(String(needle).toLowerCase())) {
    throw new Error(`[guide-pages] ${where}: data.js no longer says "${needle}". Update guide-pages.js.`)
  }
}

const money = (n) => (n === 0 ? '$0' : `$${n % 1 ? n.toFixed(2) : n}`)
const monthName = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/* ---------------------------------------------------------------- pricing data */

const OS = PRICE_MODELS.clippingai
const osPlan = (name) => {
  const p = OS.plans.find((x) => x.name === name)
  if (!p) throw new Error(`[guide-pages] PRICE_MODELS.clippingai has no "${name}" plan`)
  return p
}
const FREE = osPlan('Free')
// Plan ids are the ones PricingSection.jsx and the Stripe lookup keys use.
const PAID = [
  ['starter', 'Starter', 'For getting started'],
  ['creator', 'Creator', 'For regular creators'],
  ['pro', 'Pro', 'For power users and teams'],
].map(([id, name, blurb]) => {
  const p = osPlan(name)
  return {
    id,
    name,
    blurb,
    minutes: p.monthly.minutes,
    monthly: p.monthly.price,
    yearlyPerMonth: p.yearly.price,
    yearlyTotal: Math.round(p.yearly.price * 12),
    perMinuteCents: Math.round((p.monthly.price / p.monthly.minutes) * 1000) / 10,
  }
})
const [STARTER, , PRO] = PAID
const FIRST_VIDEO_MINUTES = 60
assertIn(EDITIONS.cloud.summary, `up to ${FIRST_VIDEO_MINUTES} minutes`, 'EDITIONS.cloud first video')
assertIn(EDITIONS.cloud.summary, 'about 50 seconds', 'EDITIONS.cloud GPU speed')
if (FREE.monthly.minutes !== EDITIONS.cloud.freeMinutes) throw new Error('[guide-pages] free minutes disagree in data.js')
if (STARTER.monthly !== EDITIONS.cloud.lowPrice || PRO.monthly !== EDITIONS.cloud.highPrice) {
  throw new Error('[guide-pages] EDITIONS.cloud low/high price disagree with PRICE_MODELS')
}

/* ------------------------------------------------ /free-ai-clipping-tools-compared */

/* One row per tool. `must` lists the phrases the row relies on; each has to
 * appear in that vendor's free-tier text in data.js (tiers[0] plus tierNote),
 * or the build fails. "Not stated" means the vendor's pricing page did not say
 * on the checked date, not that the answer is no. */
const FREE_ROWS = [
  {
    slug: '2short',
    ongoing: true,
    allowance: '30 min of analysis a month',
    resolution: '1080p',
    watermark: 'No',
    card: 'Not stated',
    limits: 'YouTube links only',
    must: ['30 minutes', 'no watermark', '1080p', 'YouTube links only'],
  },
  {
    slug: 'opus-clip',
    ongoing: true,
    allowance: '60 min of source a month',
    resolution: '1080p',
    watermark: 'Yes',
    card: 'Not stated (the 7-day Pro trial needs none)',
    limits: 'No editing; export within 3 days',
    must: ['60 credits', '1080p', 'watermark', 'no editing', '3 days', 'no card'],
  },
  {
    slug: 'vizard',
    ongoing: true,
    allowance: '60 min of uploads a month',
    resolution: '720p',
    watermark: 'Yes',
    card: 'Not stated',
    limits: 'Uploads up to 60 min, exports up to 10 min, 3-day storage',
    must: ['60 credits', '720p', 'watermark', 'up to 60 minutes', 'up to 10 minutes', '3-day storage'],
  },
  {
    slug: 'vidyo-ai',
    ongoing: true,
    allowance: '75 min a month (about 1 credit per min)',
    resolution: '720p',
    watermark: 'Not stated',
    card: 'Not stated',
    limits: 'Data kept 7 days, no scheduling',
    must: ['75 credits', '720p', '7 days', 'no scheduling'],
  },
  {
    slug: 'klap',
    ongoing: false,
    allowance: 'One video, once',
    resolution: 'Not stated',
    watermark: 'Not stated',
    card: 'No',
    limits: 'No ongoing free plan',
    must: ['one video', 'no card', 'no ongoing free tier'],
  },
  {
    slug: 'submagic',
    ongoing: false,
    allowance: 'None; a trial instead',
    resolution: 'n/a',
    watermark: 'n/a',
    card: 'No (for the trial)',
    limits: 'No free plan',
    must: ['no free tier', 'no card'],
  },
  {
    slug: 'sendshort',
    ongoing: false,
    allowance: 'None; 3 free videos at sign-up',
    resolution: 'n/a',
    watermark: 'n/a',
    card: 'Not stated',
    limits: 'No free plan; long-video clipping from the $29 plan',
    must: ['no free tier', '3 free videos'],
  },
]

for (const r of FREE_ROWS) {
  const c = COMPETITORS[r.slug]
  if (!c) throw new Error(`[guide-pages] no competitor "${r.slug}" in data.js`)
  const text = `${c.tiers[0][1]} ${c.tierNote || ''} ${c.tiers[0][0]}`
  for (const m of r.must) assertIn(text, m, `${r.slug} free tier`)
}
assertIn(COMPETITORS.sendshort.gotcha, '$29', 'sendshort clipping price')

const freeCompared = () => {
  const vendorRows = FREE_ROWS.map((r) => ({ ...r, name: COMPETITORS[r.slug].name, paid: COMPETITORS[r.slug].entryPrice, checked: COMPETITORS[r.slug].checked, link: `/alternatives/${r.slug}` }))
  const osCloud = {
    name: 'Clipping AI Cloud',
    ongoing: true,
    allowance: `Whole first video up to ${FIRST_VIDEO_MINUTES} min, then ${FREE.monthly.minutes} min a month`,
    resolution: 'Same as the paid plans',
    watermark: 'Yes',
    card: 'No (Google sign-in)',
    limits: 'Clips kept for 7 days',
    paid: `${money(STARTER.monthly)}/month`,
    checked: OS.checked,
    link: '/pricing',
    us: true,
  }
  const all = [...vendorRows.filter((r) => r.ongoing), osCloud, ...vendorRows.filter((r) => !r.ongoing)]
  const latest = all.map((r) => r.checked).sort().at(-1)
  const asOf = monthName(latest)
  const listNames = (rows) =>
    rows.map((r) => r.name).reduce((s, n, i, a) => (i === 0 ? n : i === a.length - 1 ? `${s} and ${n}` : `${s}, ${n}`), '')
  const noMark = all.filter((r) => r.ongoing && r.watermark === 'No')
  const marked = all.filter((r) => r.ongoing && r.watermark === 'Yes')
  const unknown = all.filter((r) => r.ongoing && r.watermark === 'Not stated')
  const noFree = all.filter((r) => !r.ongoing)
  const answer = `As of ${asOf}, the free plans here that export with no watermark are ${listNames(noMark)}. ${listNames(marked)} stamp a watermark on free exports${unknown.length ? `; ${listNames(unknown)} says nothing on its pricing page` : ''}. ${listNames(noFree)} offer no ongoing free plan.`

  const cell = (v) => {
    const cls = v === 'No' ? ' class="yes"' : ''
    return `<td${cls}>${esc(v)}</td>`
  }
  const table = `<table>
<thead><tr><th>Tool</th><th>Free allowance</th><th>Max resolution</th><th>Watermark</th><th>Card needed?</th><th>Limits</th><th>Paid from</th><th>Checked</th></tr></thead>
<tbody>${all
    .map(
      (r) =>
        `<tr><td class="os"><a href="${esc(r.link)}">${esc(r.name)}</a></td><td>${esc(r.allowance)}</td><td>${esc(r.resolution)}</td>${cell(r.watermark)}<td>${esc(r.card)}</td><td>${esc(r.limits)}</td><td>${esc(r.paid)}</td><td>${esc(r.checked)}</td></tr>`
    )
    .join('')}</tbody>
</table>`

  const minutesFree = vendorRows.filter((r) => r.ongoing).map((r) => ({ name: r.name, min: PRICE_MODELS[r.slug]?.plans.find((p) => p.monthly.price === 0)?.monthly.minutes })).filter((x) => x.min)
  const biggest = minutesFree.sort((a, b) => b.min - a.min)[0]
  biggest.resolution = vendorRows.find((r) => r.name === biggest.name).resolution

  const faq = [
    {
      q: 'Which free AI clip generator leaves no watermark?',
      a: `${answer} Watermark details come from each vendor's pricing page on the date checked.`,
    },
    {
      q: 'Which free AI clip generator comes out on top?',
      a: `Depends what you need from free. For the most free minutes on a hosted plan, ${biggest.name} gives ${biggest.min} a month at ${biggest.resolution}. For clips you can post watermark-free, 2short.ai's free plan (30 minutes, YouTube links only) or any paid Clipping AI Cloud plan. To test a tool on one long video, the Clipping AI Cloud free plan cuts the first video whole up to ${FIRST_VIDEO_MINUTES} minutes, watermarked.`,
    },
    {
      q: 'Does the Clipping AI free plan add a watermark?',
      a: `Yes. The Clipping AI Cloud free plan stamps its clips and stores them for 7 days; paid plans from ${money(STARTER.monthly)}/month do not, and upgrading clears the mark from clips you already made.`,
    },
    {
      q: 'Do free AI clipping tools ask for a card?',
      a: 'Of the plans we checked, Clipping AI Cloud (Google sign-in), Klap\'s one free video and the Opus Clip and Submagic trials say no card is needed. Most other vendors stay silent on their pricing pages either way.',
    },
    {
      q: 'Why do free clipping tools slap on a watermark?',
      a: 'Because the GPU time and AI calls behind every clip cost the vendor money, and the watermark is what nudges a free user toward paying.',
    },
  ]

  return {
    path: '/free-ai-clipping-tools-compared',
    // The verdict first: "best free AI clipping tool" is answered in one
    // paragraph before the table, from the same numbers the table shows.
    lede: `The best free clipping tool hinges on what "free" means to you. Most free minutes on a hosted plan: ${esc(biggest.name)} (${biggest.min} a month at ${esc(biggest.resolution)}), then ${minutesFree.slice(1, 3).map((x) => `${esc(x.name)} (${x.min})`).join(' and ')}. Hosted with no card: Clipping AI cuts your first video free up to ${FIRST_VIDEO_MINUTES} minutes (watermarked), with the mark removed from ${money(STARTER.monthly)}/month.`,
    title: 'Free AI Clipping Tools Compared: Who Skips the Watermark?',
    description: `The free plans of ${vendorRows.length + 1} AI clipping tools side by side, checked ${asOf}: free minutes, resolution, watermarks, card rules, limits and entry price.`,
    h1: 'Free AI clipping tools compared: minutes, watermarks and limits',
    breadcrumb: [{ name: 'Alternatives', path: '/alternatives' }, { name: 'Free plans compared' }],
    published: PUBLISHED,
    updated: '2026-10-30',
    cta: {
      label: 'Free plan',
      title: 'Try it free, hosted',
      body: `First video free up to ${FIRST_VIDEO_MINUTES} minutes, then ${FREE.monthly.minutes} minutes a month, watermarked, no card. Paid plans remove the watermark.`,
      button: 'Dashboard',
    },
    tldr: [
      answer,
      `Free plans differ far more than the word "free" suggests: from no ongoing plan at all to ${biggest.min} minutes a month, from 720p to 1080p, and from 3 days to 7 days before your clips disappear.`,
    ],
    body: `
<h2>Free AI clip generators, head to head</h2>
<p class="checked">Each vendor's figures checked on the date in its row, on its public pricing page. "Not stated" means the page stayed silent, not that the answer is no.</p>
${table}
<p>Paid prices are the cheapest entry plan; where a vendor discounts annual
billing, the figure shown is the one it advertises, and the
<a href="/alternatives">alternatives hub</a> lays out every plan in full.</p>

<h2>How we put this table together</h2>
<p>Every figure for a third-party tool comes straight from that vendor's public
pricing and help pages, read on the date in the "Checked" column. We list only
what the vendor actually states. When a pricing page is quiet on a point (whether
the free plan needs a card, whether Quso's free exports carry a watermark), the
cell reads "Not stated" rather than guessing. Clipping AI's figures come from our
own plans. Vendors change free tiers without warning, so check their page before
leaning on a number, and let us know if one has shifted.</p>
<p>"Free allowance" is what you can process each month for $0. Tools meter in
different units: Opus Clip, Vizard and Quso count minutes of video imported,
2short.ai counts minutes analysed, while Klap, Submagic and SendShort count clips
or videos. A one-off trial does not count as a free plan.</p>

<h2>Which free plan suits which job?</h2>
<ul>
<li><strong>You need clips you can post today, watermark-free:</strong> 2short.ai's free plan if your sources already live on YouTube and 30 minutes a month suffices; any Clipping AI Cloud paid plan if you want no watermark and no cap.</li>
<li><strong>You want the most free minutes on a hosted tool:</strong> ${esc(biggest.name)} (${biggest.min} minutes at ${esc(biggest.resolution)}), then ${minutesFree.slice(1).map((x) => `${esc(x.name)} (${x.min})`).join(', ')}.</li>
<li><strong>You want to judge quality on a full-length episode:</strong> the Clipping AI Cloud free plan cuts your first video whole up to ${FIRST_VIDEO_MINUTES} minutes, so a whole podcast or webinar fits.</li>
<li><strong>You want 1080p on free:</strong> Opus Clip (watermarked) or 2short.ai (no watermark). Vizard and Quso cap free exports at 720p.</li>
<li><strong>Your footage is sensitive:</strong> every hosted clipping tool, ours included, means uploading it. Check the retention terms before you start.</li>
<li><strong>You only want a one-off test:</strong> Klap's one free video and the Submagic and SendShort trials cover a single try, not ongoing use.</li>
</ul>

<h2>Why the watermark column counts</h2>
<p>A watermark on a free export is no bug or trick: it is how the vendor covers
GPU time and AI calls for people who are not paying. That is also why a hosted
free plan without a watermark is rare, and why the generous ones tend to cap
something else: links only, minutes analysed, a short storage window. The one
structural exception is software you run yourself, where there is no vendor cost
to recoup. The full reasoning is on
<a href="/free-ai-clip-generator">the free AI clip generator page</a>.</p>
<p>The Clipping AI Cloud free plan follows the hosted rule and says so: its clips
carry a watermark, and paid plans from ${money(STARTER.monthly)}/month do not. The
<a href="/pricing">pricing table on the homepage</a> lists every plan.</p>

<h2>What happens once the free plan runs dry?</h2>
<ul>
${vendorRows.filter((r) => r.ongoing).map((r) => `<li><strong>${esc(r.name)}:</strong> paid plans from ${esc(r.paid)}.</li>`).join('\n')}
<li><strong>Clipping AI Cloud:</strong> ${STARTER.name} at ${money(STARTER.monthly)}/month for ${STARTER.minutes} minutes, watermark-free.</li>
</ul>
<p>To price your own monthly volume across the tools that meter minutes, use the
calculator on <a href="/alternatives">the alternatives hub</a> or the
<a href="/opus-clip-pricing">Opus Clip pricing breakdown</a>.</p>

${faqBlock(faq)}

${sources([
  ...vendorRows.map((r) => `${esc(r.name)}: free tier and entry price checked ${esc(r.checked)}; details in <a href="${esc(r.link)}">our ${esc(r.name)} comparison</a>.`),
  `Clipping AI: <a href="/pricing">plans</a>.`,
])}
`,
    faq,
    related: ['/free-ai-clip-generator', '/alternatives', '/pricing'],
  }
}

/* -------------------------------------------------- /how-to/clip-a-youtube-video */

const HOWTO_FAQ = [
  {
    q: 'How do you clip a YouTube video?',
    a: 'Jot down the start and end of the bit you want, then pick one of four routes: YouTube Studio\'s editor or Video Clips tool for your own uploads, a free trimmer or ffmpeg on a copy you have the rights to, or an AI clipper like Clipping AI that finds the best moments and cuts them into vertical Shorts. YouTube\'s viewer Clip button, where it survives, only produces a shareable link.',
  },
  {
    q: 'How do I cut a clip out of a YouTube video?',
    a: 'Grab a copy of a video you own or are licensed to use (Studio lets you download your own uploads), then cut it: ffmpeg -ss 00:01:30 -to 00:02:15 -i input.mp4 -c copy clip.mp4 keeps 1:30 to 2:15 without re-encoding. Any free trimmer, QuickTime, the Windows Photos app or your phone\'s gallery, does the same with a slider.',
  },
  {
    q: 'How do I copy a clip from YouTube?',
    a: 'To share a moment, hit Share and tick "Start at" to copy a link that opens the video at that second. To get an actual file you need a video you own or may use: download your own upload from Studio, or rely on the creator\'s licence (Creative Commons, say), then trim it.',
  },
  {
    q: 'How do I pull a clip from YouTube for TikTok or Shorts?',
    a: 'Cut the segment, reframe it from 16:9 to 9:16 and add captions. Do it by hand with an editor or ffmpeg, or paste the link into an AI clipper like Clipping AI, which picks 3 to 15 moments of 15 to 60 seconds, reframes them with face tracking and burns in word-by-word captions.',
  },
  {
    q: 'How do I save a clip of a YouTube video?',
    a: 'A YouTube Clip or timestamp link is not a file; it plays the original on YouTube and vanishes if the video is pulled. To keep a clip, save a trimmed copy of a video you have the rights to on your own device, via Studio\'s download plus a trimmer, or with ffmpeg.',
  },
  {
    q: 'Did YouTube retire Clips?',
    a: 'In April 2026 YouTube said it was discontinuing viewer Clips and making Share at timestamp, now on mobile too, the main way to share a moment. Creators still have the Video Clips tool in Studio for republishing chunks of their own longer videos and archived streams. Availability can vary by account and region.',
  },
  {
    q: 'Can I clip someone else\'s YouTube video?',
    a: 'Sharing a link or timestamp is fine. Downloading, re-uploading or monetising a cut of another creator\'s video needs their permission or a licence that allows it, such as Creative Commons Attribution; YouTube\'s Terms of Service restrict downloading, and fair use is a narrow defence decided case by case, not a rule you can bank on.',
  },
  {
    q: 'Can I clip a YouTube video on my phone?',
    a: 'Yes. Share at timestamp works in the mobile apps. For your own videos, the YouTube Studio app and the YouTube app\'s Shorts tools let you reuse parts of your uploads. For a file you have the rights to, the trim tool in iPhone Photos or Google Photos cuts it in seconds.',
  },
]

const howToClip = () => ({
  path: '/how-to/clip-a-youtube-video',
  title: 'How to Clip a YouTube Video in 2026 (4 Free Ways)',
  description:
    'Four free ways to clip a YouTube video: share a moment, edit your own in Studio, cut it with ffmpeg or a free trimmer, or let AI slice it into Shorts.',
  h1: 'How to clip a YouTube video: 4 free routes, from a link to a vertical Short',
  breadcrumb: [{ name: 'Guides', path: '/how-to' }, { name: 'How to clip a YouTube video' }],
  published: PUBLISHED,
  updated: PUBLISHED,
  cta: {
    label: 'The fast way',
    title: 'Paste a YouTube link, get vertical clips',
    body: `Clipping AI finds the best moments and cuts them into 9:16 Shorts with captions. First video free up to ${FIRST_VIDEO_MINUTES} minutes, no card; paid plans remove the watermark.`,
    button: 'Clip a video',
  },
  tldr: [
    'There are four ways to clip a YouTube video, and the right one hinges on whether you are after a <strong>link</strong>, a <strong>file</strong> or a <strong>vertical Short</strong>.',
    '<strong>1.</strong> Share a moment: the Clip button where it still appears, or Share at timestamp. <strong>2.</strong> YouTube Studio, for videos on your own channel. <strong>3.</strong> Cut the segment yourself with a free trimmer or a single ffmpeg command. <strong>4.</strong> Let Clipping AI find the best moments and cut them into captioned 9:16 Shorts.',
    'Only clip content you own or have the rights to use. A link to someone else\'s video is fine; downloading and re-uploading a cut of it usually is not.',
  ],
  body: `
<h2>Which method should you pick?</h2>
<table>
<thead><tr><th>You want</th><th>Method</th><th>You get</th><th>Works on</th></tr></thead>
<tbody>
<tr><td class="os">To send a friend one moment</td><td>1. Clip button or Share at timestamp</td><td>A link</td><td>Any public video</td></tr>
<tr><td class="os">To shorten or reuse your own upload</td><td>2. YouTube Studio</td><td>An edited video or a republished clip</td><td>Your own channel</td></tr>
<tr><td class="os">An exact segment as a file</td><td>3. Free trimmer or ffmpeg</td><td>An MP4 on your device</td><td>Videos you own or may use</td></tr>
<tr><td class="os">Several Shorts from one long video</td><td>4. AI clipping (Clipping AI)</td><td>Vertical 9:16 clips with captions</td><td>Videos you own or may use</td></tr>
</tbody>
</table>
<p>Whichever route you take, pin down the exact moment first. Scrub the timeline,
or open the transcript (the "Show transcript" button in the description) and
search for a phrase you recall: every line carries a timestamp. Note the start
and end times down to the second.</p>

<h2>Method 1: share a moment with the Clip button or a timestamp</h2>
<p>For years YouTube offered a <strong>Clip</strong> button (the scissors icon
under the player) that let a viewer pick a short stretch, name it and share it as
a link. In April 2026 YouTube announced it was scrapping viewer Clips and making
<strong>Share at timestamp</strong> the main way to share a moment, now in the
mobile apps as well as on desktop. Rollouts are gradual, so what you see depends
on your account and region.</p>
<p>If the Clip button still shows under a video:</p>
<ol>
<li>Click or tap <strong>Clip</strong>.</li>
<li>Drag the selection over the stretch you want and add a title.</li>
<li>Hit <strong>Share clip</strong> and copy the link.</li>
</ol>
<p>If not, use a timestamp link, which does the same job for most people:</p>
<ol>
<li>Pause the video on the moment you want.</li>
<li>Hit <strong>Share</strong>, tick <strong>Start at</strong> (it fills in the current time) and copy the link. On a phone, find the same option in the Share sheet where it exists.</li>
<li>Or add it by hand: append <code>&amp;t=95</code> (seconds) to a youtube.com/watch link, or <code>?t=95</code> to a youtu.be link.</li>
</ol>
<p>Both hand you a <strong>link, not a file</strong>. The viewer watches the
original on YouTube, the creator keeps the view, and if the video is removed or
made private the link dies. Perfect for sharing, wrong for making your own
content.</p>

<h2>Method 2: YouTube Studio, for your own channel's videos</h2>
<p>If the video is yours, YouTube Studio offers three tools that cover most needs.</p>
<h3>Trim your upload in the Studio editor</h3>
<ol>
<li>Open YouTube Studio, head to <strong>Content</strong> and click the video.</li>
<li>Pick <strong>Editor</strong> in the left menu, then <strong>Trim &amp; cut</strong>.</li>
<li>Drag the edges to keep the part you want, or add cuts to drop stretches in the middle, then <strong>Save</strong>.</li>
</ol>
<p>This edits the published video itself; it does not create a second one. The
change takes time to process, the URL and views stay put, and some videos cannot
be edited (Studio tells you when). Keep a copy of the original if you might want
it back.</p>
<h3>Republish part of a video with Video Clips</h3>
<p>Studio also has a <strong>Video Clips</strong> tool for creators, which YouTube
describes as a way to republish clips from your longer videos and archived live
streams. YouTube has said it will extend it to Shorts. Where it is live on your
channel, it is the most direct way to turn one segment of your own video into a
standalone upload without downloading anything.</p>
<h3>Download your own video to edit elsewhere</h3>
<p>In <strong>Content</strong>, open a video's three-dot menu and choose
<strong>Download</strong>. You get an MP4 of your own upload, ready to cut with
method 3 or clip with method 4. This is the clean, allowed way to get a file of a
YouTube video: it is yours, and Studio hands it over.</p>

<h2>Method 3: cut the segment yourself, for free</h2>
<p>Once you have a file you have the rights to (your own Studio download, your
original recording, or a video licensed under something like Creative Commons
Attribution), pulling a segment takes seconds.</p>
<h3>With a free trimmer</h3>
<ul>
<li><strong>Mac:</strong> open the file in QuickTime Player, choose Edit, Trim, drag the yellow handles and hit save.</li>
<li><strong>Windows:</strong> open it in the Photos app or Clipchamp (both ship with Windows 11) and use Trim.</li>
<li><strong>iPhone:</strong> in Photos, tap Edit and drag the ends of the timeline; save as a new clip to preserve the original.</li>
<li><strong>Android:</strong> in Google Photos, tap Edit, drag the trim handles, then Save copy.</li>
</ul>
<h3>With ffmpeg, down to the exact second</h3>
<p>ffmpeg is free, runs on every operating system and powers most video software
under the hood. This keeps 1:30 to 2:15 without re-encoding, so it is instant and
lossless:</p>
<pre><code>ffmpeg -ss 00:01:30 -to 00:02:15 -i input.mp4 -c copy clip.mp4</code></pre>
<p>With <code>-c copy</code> the cut snaps to the nearest keyframe, so it can begin
a fraction early. For a frame-exact cut, re-encode instead:</p>
<pre><code>ffmpeg -ss 00:01:30 -to 00:02:15 -i input.mp4 -c:v libx264 -crf 18 -preset veryfast -c:a aac -b:a 160k clip.mp4</code></pre>
<p>And to turn a 16:9 segment into a centred 9:16 vertical clip for Shorts, TikTok
or Reels:</p>
<pre><code>ffmpeg -ss 00:01:30 -to 00:02:15 -i input.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -c:a aac clip_vertical.mp4</code></pre>
<p>A fixed centre crop works if the speaker stays put in the middle. Once they move,
or two people share the frame, a static crop cuts someone off, and that is where
the manual route stops scaling. If you only need the format change, the free
<a href="/video-aspect-ratio-converter">16:9 to 9:16
converter</a> does it right in your browser.</p>
<p>For a Creative Commons video or your own upload, yt-dlp can grab just the part
you need instead of the whole file:
<code>yt-dlp --download-sections "*00:01:30-00:02:15" &lt;video-url&gt;</code>. Use it
only where you have the rights; YouTube's Terms of Service restrict downloading
other people's videos.</p>

<h2>Method 4: let AI find the best moments and cut the Shorts</h2>
<p>Methods 1 to 3 assume you already know which 30 seconds you want. With a
45-minute podcast or a two-hour stream, finding them is the real work. An AI
clipper takes that on: it reads the whole video and hands back the strongest
moments already cut, reframed and captioned.</p>
<p>With Clipping AI:</p>
<ol>
<li>Paste the YouTube link (or upload the file) at clip.zes.codes.</li>
<li>The video is transcribed with a timestamp for every word and scanned for scene changes.</li>
<li>Google Gemini scores the transcript and picks the 3 to 15 strongest moments, each 15 to 60 seconds, that stand on their own.</li>
<li>Each moment is cut and reframed to 9:16: face tracking for one speaker, both people stacked for a two-person podcast, the screen above the presenter for a tutorial.</li>
<li>Captions are burned in from the word-level transcript, with a hook line over the opening seconds. Download the clips, or post them to YouTube Shorts, TikTok and Instagram Reels.</li>
</ol>
<p>The same rights rule applies: use it on your own videos, channels you manage, or
footage you are licensed to clip. Details for YouTube sources are on
<a href="/platforms/youtube">the YouTube clip creator</a> page, and for turning a
channel's long videos into Shorts, see
<a href="/platforms/youtube-shorts">the YouTube Shorts builder</a> and
<a href="/youtube-to-shorts-converter">the YouTube-to-Shorts converter</a>.</p>
<p>What it costs: Clipping AI Cloud cuts your first video free up to
${FIRST_VIDEO_MINUTES} minutes, then ${FREE.monthly.minutes} minutes a month with a
watermark, and paid plans start at ${money(STARTER.monthly)}/month without one
(<a href="/pricing">compare plans</a>).</p>

<h2>Copyright: what you may clip</h2>
<p>The method is the easy part. Whether you are allowed to use the clip is what
gets channels struck.</p>
<ul>
<li><strong>Sharing a link or timestamp</strong> to any public video is fine: it plays the original on YouTube, with credit to the creator.</li>
<li><strong>Your own videos</strong> are yours to cut, download from Studio and repost wherever you like.</li>
<li><strong>Licensed videos</strong>, such as those marked Creative Commons Attribution (CC BY) in YouTube's description panel, can be reused as long as you credit the creator the way the licence asks.</li>
<li><strong>Someone else's video</strong> needs their permission to download, re-upload or monetise. Many creators run clipping programmes and mention it in their description; ask if not.</li>
<li><strong>Fair use</strong> (commentary, criticism, news) is a legal defence judged case by case, not a licence. Do not build a channel assuming it covers you.</li>
</ul>
<p>Re-uploading other people's clips without permission also tends to trip
YouTube's reused-content rules for monetisation, copyright aside.</p>

<h2>Clipping on mobile versus desktop</h2>
<p><strong>On a phone</strong>, sharing is the strong suit: Share at timestamp
from the Share sheet, plus the YouTube and YouTube Studio apps for reusing bits
of your own uploads in Shorts. For a file you already have, the trim tools in
Photos and Google Photos cut it fastest.</p>
<p><strong>On a desktop</strong>, you get the full Studio editor, frame-exact
cuts with ffmpeg and a mouse for precise trimming. Long videos are easier to
scrub on a big timeline too. An AI clipper works the same on both, since the
processing runs on the server.</p>

<h2>Common slip-ups when clipping YouTube videos</h2>
<ul>
<li><strong>Cutting mid-sentence.</strong> Start a beat before the first word and end just after the last. A transcript with word timestamps makes this precise.</li>
<li><strong>Keeping 16:9 for Shorts.</strong> A horizontal clip in a vertical feed shrinks to a little box between black bars. Reframe to 9:16.</li>
<li><strong>No captions.</strong> Most short-form video is watched muted. Burn subtitles in.</li>
<li><strong>Clips that need context.</strong> A moment that only lands after the previous ten minutes will lose a stranger. Pick moments that stand alone.</li>
</ul>

${faqBlock(HOWTO_FAQ)}

${sources([
  'YouTube scrapping viewer Clips in favour of Share at timestamp, and the Studio Video Clips tool: <a href="https://9to5google.com/2026/04/17/youtube-clips-share-at-time-changes/" rel="noopener">9to5Google, 17 April 2026</a>; <a href="https://www.tubefilter.com/2026/04/17/youtube-clipping-tool-viewer-clips-shorts/" rel="noopener">Tubefilter, 17 April 2026</a>.',
  'ffmpeg options <code>-ss</code>, <code>-to</code> and <code>-c copy</code>: <a href="https://ffmpeg.org/ffmpeg.html" rel="noopener">ffmpeg documentation</a>.',
  `Clipping AI pipeline: <a href="/how-clipping-ai-works">how Clipping AI works</a>.`,
])}
`,
  faq: HOWTO_FAQ,
  extraNodes: [
    {
      '@type': 'HowTo',
      '@id': `${SITE.url}/how-to/clip-a-youtube-video#howto`,
      name: 'How to clip a YouTube video',
      description:
        'Cut a segment from a YouTube video you own or may use, and turn it into a vertical clip for Shorts, TikTok or Reels.',
      totalTime: 'PT10M',
      supply: [{ '@type': 'HowToSupply', name: 'A YouTube video you own or have the rights to clip' }],
      tool: [
        { '@type': 'HowToTool', name: 'YouTube Studio' },
        { '@type': 'HowToTool', name: 'ffmpeg or a free video trimmer' },
        { '@type': 'HowToTool', name: 'Clipping AI (optional, for AI clipping)' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          name: 'Find the moment',
          text: 'Scrub the timeline or search the transcript for a phrase, and note the start and end times to the second.',
        },
        {
          '@type': 'HowToStep',
          name: 'Share it, or get a copy you have the rights to',
          text: 'To share, use Share with Start at for a timestamp link. To make a clip, download your own upload from YouTube Studio (Content, three-dot menu, Download), or use footage you are licensed to reuse.',
        },
        {
          '@type': 'HowToStep',
          name: 'Cut the segment',
          text: 'Trim it in QuickTime, the Windows Photos app or your phone gallery, or run: ffmpeg -ss 00:01:30 -to 00:02:15 -i input.mp4 -c copy clip.mp4',
        },
        {
          '@type': 'HowToStep',
          name: 'Make it vertical and add captions',
          text: 'For Shorts, TikTok or Reels, reframe the clip from 16:9 to 9:16 and burn in subtitles, by hand or with an AI clipper like Clipping AI that also picks the moments.',
        },
        {
          '@type': 'HowToStep',
          name: 'Export and post',
          text: 'Save the clip as an MP4 and upload it, crediting the original creator where the licence asks.',
        },
      ],
    },
  ],
  related: ['/platforms/youtube', '/platforms/youtube-shorts', '/youtube-to-shorts-converter'],
})

/* ------------------------------------------------- platform how-to guides */

/* Five informational guides under /how-to that answer a platform question
 * (specs, steps, timing) first and then point at the product. Platform facts
 * are dated: they are the ones the platforms' own help pages and announcements
 * gave as of the date below, and a number nobody publishes is described as a
 * rule of thumb, never as an official figure. Wording about Clipping AI
 * (posting targets, caption margin, scheduling) matches clip-tools.js and
 * autopilot-pages.js. */
const GUIDES_PUBLISHED = '2026-10-29'
const AS_OF = 'October 2026'
const APP_URL = `${SITE.url}/#app`

const PLAN_SHORT = `Cloud's free plan carries a watermark, paid plans start at ${money(STARTER.monthly)}/month.`
const PLAN_LINE =
  `Clipping AI Cloud offers a free plan: your first video is cut whole up to ${FIRST_VIDEO_MINUTES} minutes, then ` +
  `${FREE.monthly.minutes} minutes a month, with a watermark and no card. Paid plans start at ` +
  `${money(STARTER.monthly)}/month watermark-free ` +
  '(<a href="/pricing">compare plans</a>).'

/* The above-the-fold aside, rendered by render.js right after the summary. */
const guideCta = (title, body) => ({ label: 'Give it a go', title, body: `${body} ${PLAN_SHORT}`, button: 'Start clipping' })

/* The closing "try it" block: same markup as render.js's CTA box, reported with
 * its position so the end block can be told apart from the top one. */
const nextStep = (path, { heading, html, title, body }) => `
<h2>${esc(heading)}</h2>
${html}
<p>${PLAN_LINE}</p>
<div class="cta-box">
  <div class="copy">
    <span class="label">Give it a go</span>
    <strong>${esc(title)}</strong>
    <p>${esc(body)}</p>
  </div>
  <a class="btn" href="${esc(APP_URL)}" onclick="window.op&amp;&amp;window.op('track','SeoCtaClick',{page:'${esc(path)}',position:'end'})">Start clipping</a>
</div>`

const howToSteps = (path, name, description, steps, extra = {}) => ({
  '@type': 'HowTo',
  '@id': `${SITE.url}${path}#howto`,
  name,
  description,
  ...extra,
  step: steps.map(([n, text]) => ({ '@type': 'HowToStep', name: n, text })),
})

const guide = (path, crumb, page) => ({
  path,
  breadcrumb: [{ name: 'Guides', path: '/how-to' }, { name: crumb }],
  published: GUIDES_PUBLISHED,
  updated: GUIDES_PUBLISHED,
  ...page,
})

const SRC_IG_3MIN =
  'Instagram Reels running up to 3 minutes: announced by Instagram in January 2025, reported by <a href="https://www.socialmediatoday.com/news/instagram-officially-expands-reels-length-3-minutes/737766/" rel="noopener">Social Media Today</a>.'
const SRC_YT_UPLOAD =
  '<a href="https://support.google.com/youtube/answer/12779649" rel="noopener">YouTube Help: Upload YouTube Shorts</a> (up to 3 minutes, square or vertical).'
const SRC_YT_3MIN =
  '<a href="https://support.google.com/youtube/answer/15424877" rel="noopener">YouTube Help: Understand three-minute YouTube Shorts</a> (uploads from 15 October 2024; Shorts over a minute with an active Content ID claim are blocked).'
const SRC_FB_REELS =
  'Facebook treating fresh videos as Reels with no length or format limits: <a href="https://creators.facebook.com/blog/making-it-easier-to-create-videos-on-facebook" rel="noopener">Meta for Creators, 17 June 2025</a>; <a href="https://techcrunch.com/2025/06/17/facebook-announces-that-all-videos-on-its-platform-will-soon-be-shared-as-reels" rel="noopener">TechCrunch, 17 June 2025</a>.'
const SRC_CAPTIONS = `Caption placement (roughly 15% of the frame height above the bottom edge) is <code>SAFE_MARGIN_V</code> in <code>subtitles.py</code>.`

/* ------------------------------------------- /how-to/instagram-reel-dimensions */

const REEL_DIM_FAQ = [
  {
    q: 'What are the dimensions of an Instagram Reel?',
    a: '1080 x 1920 pixels, a 9:16 vertical frame that fills a phone screen. That is the size to export at. Instagram takes other sizes, but anything that is not 9:16 ends up framed with empty space or cropped.',
  },
  {
    q: 'What is the pixel size of an Instagram Reel?',
    a: '1080 pixels wide by 1920 tall. 720 x 1280 shares the same shape and still uploads, but looks softer after Instagram compresses it. Going above 1080 x 1920 rarely shows on a phone, since the file is recompressed for playback anyway.',
  },
  {
    q: 'What aspect ratio does an Instagram Reel use?',
    a: '9:16, vertical. A 16:9 horizontal video posted as a Reel plays as a narrow band in the middle of the screen, so convert it to 9:16 first with a blurred background, a crop or an AI reframe that tracks the speaker.',
  },
  {
    q: 'How long can an Instagram Reel run?',
    a: 'Up to 3 minutes. Instagram lifted the limit from 90 seconds in January 2025. Most Reels that hold attention are far shorter: match the length to the moment instead of filling the limit.',
  },
  {
    q: 'What is the safe zone on an Instagram Reel?',
    a: 'Instagram publishes none for organic Reels. As a rule of thumb, keep text and faces out of the bottom strip (roughly the lowest 15% of the frame, more with a long description), the right edge where the buttons sit and the very top. Meta\'s guidance for Reels ads, as widely quoted, is tighter: about 14% clear at the top, 35% at the bottom and 6% on each side.',
  },
  {
    q: 'What size should an Instagram Reel cover use?',
    a: '1080 x 1920, the same as the Reel. As of October 2026 the profile grid shows a 3:4 crop from its middle, roughly the centre 1080 x 1440, so keep the title and the face inside that band.',
  },
  {
    q: 'Can I post a horizontal video as a Reel?',
    a: 'You can, but it will not fill the screen and most viewers scroll right past a small box. Convert it to 9:16 first. The free Clipping AI converter does it in your browser; the clip generator reframes it by tracking the speaker.',
  },
  {
    q: 'Which file format works best for a Reel?',
    a: 'MP4 with H.264 video, 8-bit 4:2:0 colour (yuv420p), 30 frames per second and AAC audio at 48 kHz. That combination uploads everywhere and is what most editors export by default.',
  },
]

const reelDimensions = () => {
  const path = '/how-to/instagram-reel-dimensions'
  return guide(path, 'Instagram Reel dimensions', {
    title: 'Instagram Reel Dimensions, Size and Safe Zones (2026)',
    description:
      'Instagram Reel dimensions as of October 2026: 1080 x 1920 at 9:16, up to 3 minutes, how the grid crops the cover, safe zones and export settings.',
    h1: 'Instagram Reel dimensions: size, aspect ratio, cover and safe zones',
    cta: guideCta('Turn a long video into Reels with AI', 'Paste a link and get 1080 x 1920 Reels with captions kept clear of Instagram\'s buttons.'),
    tldr: [
      'An Instagram Reel is <strong>1080 x 1920 pixels</strong>, a <strong>9:16</strong> vertical frame, and can run <strong>up to 3 minutes</strong> (Instagram lifted the limit from 90 seconds in January 2025). Export an MP4 with H.264 video and AAC audio at 30 frames per second and you will not hit a format snag.',
      `The entire 9:16 frame plays in the Reels feed, but the cover gets cropped elsewhere: as of ${AS_OF} the profile grid shows a 3:4 slice from the middle. Keep faces and cover text centred, captions out of the bottom strip where Instagram paints the username, description and audio line, and nothing vital under the right-hand buttons.`,
      'Got a horizontal 16:9 video? Convert it to 9:16 with a blurred background, a crop or bars in the free converter, or let an AI reframe hold the speaker in shot.',
    ],
    facts: [
      { k: 'Size', v: '1080 x 1920', s: 'Pixels, width by height' },
      { k: 'Aspect ratio', v: '9:16', s: 'Vertical, full-screen' },
      { k: 'Max length', v: '3 min', s: 'Since January 2025' },
      { k: 'Grid crop', v: '3:4', s: `Cover on the profile, as of ${AS_OF}` },
    ],
    body: `
<h2>Instagram Reel size at a glance</h2>
<table>
<thead><tr><th>Spec</th><th>Use this</th><th>Why</th></tr></thead>
<tbody>
<tr><td class="os">Resolution</td><td>1080 x 1920 px</td><td>Fills a phone screen sharply; 720 x 1280 works but looks softer once compressed</td></tr>
<tr><td class="os">Aspect ratio</td><td>9:16</td><td>Any other shape gets empty space around it or is cropped</td></tr>
<tr><td class="os">Length</td><td>Up to 3 minutes</td><td>The limit since January 2025; most solid Reels run far shorter</td></tr>
<tr><td class="os">File</td><td>MP4, H.264, yuv420p</td><td>The most compatible pairing; MOV and HEVC from a phone usually work too</td></tr>
<tr><td class="os">Frame rate</td><td>30 fps</td><td>Keep the source rate between 24 and 60; no point converting 25 to 30</td></tr>
<tr><td class="os">Audio</td><td>AAC, 48 kHz, stereo</td><td>What every editor exports by default</td></tr>
<tr><td class="os">Cover</td><td>1080 x 1920 image or a frame</td><td>The grid shows the middle 3:4 (roughly 1080 x 1440)</td></tr>
<tr><td class="os">Text safe area</td><td>Centre of the frame</td><td>Instagram's interface covers the bottom strip, the right edge and the top</td></tr>
</tbody>
</table>
<p class="checked">Platform details as of ${AS_OF}. Instagram tweaks its interface often and rolls changes out gradually, so what you see in your app can differ a little.</p>

<h2>Why 1080 x 1920 and 9:16</h2>
<p>A Reel is built for full-screen viewing on an upright phone, and 9:16 is that
screen's shape: nine units wide for every sixteen tall. 1080 pixels wide is the
width Instagram is built around for full-screen video, so 1080 x 1920 fills the
screen without any scaling up.</p>
<p>Two things follow. First, a smaller file of the same shape, like 720 x 1280,
uploads fine but gets enlarged on the way to the screen, and after Instagram's
compression the softness shows in faces and text. Second, a bigger file, such as
a 2160 x 3840 export from a 4K camera, rarely looks better, because Instagram
recompresses every upload for playback and a phone screen shows only so much
detail. Upload at 1080 x 1920 unless your source is genuinely sharper and you
have checked the result.</p>
<p>Other shapes? Instagram accepts them, but a Reel that is not 9:16 will not fill
the screen. A horizontal 16:9 video plays as a band across the middle with empty
space above and below; a square video leaves less of a gap but still does not
fill the frame. In a feed people scroll with one thumb, a small picture loses to
a full one.</p>

<h2>How long can an Instagram Reel run?</h2>
<p>Up to <strong>3 minutes</strong>. Instagram lifted the limit from 90 seconds in
January 2025. That limit is a ceiling, not a target. A Reel is judged in its
first second or two, and the moments that hold a stranger's attention usually
run between about 15 seconds and a minute: one idea, one story, one answer. Use
the extra length when the moment needs it, for a tutorial step or a story that
only lands at the end, not just to cram more in.</p>
<p>A video over the Reels limit will not be cut for you. Trim it first, or split a
long recording into several Reels that each stand on their own.</p>

<h2>The Reel cover: what shows where (as of ${AS_OF})</h2>
<p>The cover is the still image people see before the Reel plays. It turns up in
three places, and only one of them shows the whole frame:</p>
<ul>
<li><strong>The Reels tab and full screen</strong> show the full 9:16 cover.</li>
<li><strong>Your profile grid</strong> shows a crop. Instagram moved the grid from square tiles to taller 3:4 rectangles in early 2025, so it shows roughly the middle 1080 x 1440 of a 1080 x 1920 cover: about 240 pixels are trimmed from the top and the same from the bottom.</li>
<li><strong>The main feed and shares</strong> can show a shorter crop than full screen, depending on where the Reel appears and the app version.</li>
</ul>
<p>The safe way to design a cover is to put everything that matters, the face and
the title text, in the middle band and treat the top and bottom as background.
When you pick the cover, Instagram lets you choose a frame from the video or
upload an image from your camera roll, and shows how the profile grid will crop
it so you can adjust. Upload the cover at 1080 x 1920, keep the title short and
big enough to read at grid size, and check the grid preview before sharing.</p>

<h2>Instagram Reel safe zones</h2>
<p>Instagram paints its interface on top of your video. Anything underneath is
still in the file, just unreadable to the viewer. The parts that cover the
frame, as of ${AS_OF}:</p>
<ul>
<li><strong>The bottom strip:</strong> your username and follow button, the description (which grows when it is long or tapped open) and the audio line.</li>
<li><strong>The right edge:</strong> the like, comment, share and more buttons stacked vertically, with the audio thumbnail below them.</li>
<li><strong>The top:</strong> the Reels header and camera icon.</li>
</ul>
<p>Instagram publishes no official safe zone for organic Reels, so treat any number
you read as a rule of thumb. A practical working area on a 1080 x 1920 frame:
keep captions and key text above roughly the lowest 15% (more with long
descriptions), clear of the right-hand 10 to 15%, and a little below the top
edge. Faces sit comfortably in the centre third.</p>
<p>Ads are stricter. Meta's guidance for Reels ads, as widely quoted, asks you to
keep roughly 14% of the top, 35% of the bottom and 6% of each side free of text
and logos, which on a 1080 x 1920 frame is about 270, 670 and 65 pixels. If a
Reel might be boosted or reused as an ad, design for those margins from the start.</p>
<p>For reference, Clipping AI burns its captions about 15% of the frame height
above the bottom edge, keeping them clear of the username and description
Instagram paints on an organic Reel.</p>

<h2>How to convert a 16:9 video to 9:16 for a Reel</h2>
<p>Most recordings are horizontal: a webinar, a podcast camera, a screen recording,
a YouTube video. There are three ways to make them vertical, and the right one
depends on what is in the picture.</p>
<h3>1. Keep the whole frame over a blurred background</h3>
<p>The original 16:9 picture sits in the middle at full width, and a blurred,
enlarged copy fills the space above and below. Nothing is cut off, which suits
slides, wide shots and anything with text across the frame. The picture is small,
though: a 1920 x 1080 frame scaled to 1080 wide is only about 608 pixels tall.
In ffmpeg:</p>
<pre><code>ffmpeg -i input.mp4 -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac reel.mp4</code></pre>
<h3>2. Crop to fill</h3>
<p>A 9:16 window is cut out of the 16:9 frame and enlarged to fill the screen. It
looks native, but keeps only about a third of the original width, so it works if
the subject stays centred and fails when they move or two people sit side by
side. A centred crop in ffmpeg:</p>
<pre><code>ffmpeg -i input.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac reel.mp4</code></pre>
<h3>3. Black bars</h3>
<p>The frame is placed in the middle with black above and below. It is the
simplest and the least attractive; use it only when the exact picture must stay
untouched.</p>
<p>All three run in your browser, with no upload and no account, in the free
<a href="/video-aspect-ratio-converter">16:9 to 9:16 converter</a>. What none of
them does is follow a person. When the speaker walks across the frame, or two
people talk in turn, a fixed crop cuts someone off. That is what an AI reframe
is for: it tracks the face that is speaking, stacks two speakers one above the
other, or holds a shared screen readable with the presenter beside it. The
modes are explained on <a href="/auto-reframe">the auto reframe page</a>.</p>

<h2>Export settings that upload cleanly</h2>
<p>Instagram recompresses everything, so aim for a clean, high-quality file in a
standard format, not the tiniest one. These settings work in any editor, and as
an ffmpeg command:</p>
<pre><code>ffmpeg -i edit.mov -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart reel.mp4</code></pre>
<ul>
<li><strong>H.264 in an MP4</strong> is the most compatible pairing. HEVC (H.265) from a recent phone usually uploads fine too.</li>
<li><strong>yuv420p (8-bit 4:2:0)</strong> matters more than it looks. Some cameras record 10-bit or 4:2:2 colour, which can upload with shifted colours or fail outright.</li>
<li><strong>Keep the source frame rate.</strong> 24, 25, 30 or 60 are all fine; converting between them adds judder.</li>
<li><strong>HDR footage</strong> from recent phones sometimes shows at a different brightness than you expect. If colours matter, export in standard dynamic range and check it on your own phone.</li>
<li><strong>Upload over Wi-Fi</strong> and, in the app's settings, switch on the highest-quality upload option if your app offers it.</li>
</ul>

<h2>Common mistakes</h2>
<ul>
<li><strong>Text at the very bottom.</strong> Captions placed where a TV subtitle would go end up under the username and description.</li>
<li><strong>A cover designed for the full frame.</strong> The title at the top of the cover vanishes in the 3:4 grid crop.</li>
<li><strong>Uploading horizontal and hoping.</strong> A small 16:9 band in a vertical feed is easy to scroll past.</li>
<li><strong>Exporting below 1080 wide.</strong> It saves nothing and costs sharpness after compression.</li>
<li><strong>Using all 3 minutes just because you can.</strong> Length should come from the moment, not the limit.</li>
</ul>

${nextStep(path, {
  heading: 'Next step: turn a long video into Reels with AI',
  html: `<p>If your Reels come from longer recordings (a podcast, a webinar, a class,
a YouTube video), the slow part is not the size: it is watching the whole thing
to find the moments that stand alone, then cutting, reframing and captioning
each one. Clipping AI takes that on. Paste a link or upload the file, and it
returns 1080 x 1920 Reels with word-by-word captions kept clear of Instagram's
interface and a hook over the opening seconds. It can publish them to Instagram
as Reels or schedule a week of them; for Facebook Reels you download the MP4.
The details are on <a href="/platforms/instagram-reels">the AI Reels maker</a>
page.</p>`,
  title: 'Paste a link, get captioned 9:16 Reels',
  body: 'The AI picks the moments, reframes them to 1080 x 1920 and burns in captions.',
})}

${faqBlock(REEL_DIM_FAQ)}

${sources([
  SRC_IG_3MIN,
  'Instagram\'s 3:4 profile grid (early 2025) and the Reels interface are described as of October 2026 from the Instagram app; Instagram publishes no official safe zone for organic Reels.',
  'Reels ad margins (about 14% top, 35% bottom, 6% sides) as quoted from Meta\'s ad guidance by advertising guides; check Meta\'s current ad specs before leaning on them for a campaign.',
  'ffmpeg filters <code>scale</code>, <code>crop</code>, <code>boxblur</code> and <code>overlay</code>: <a href="https://ffmpeg.org/ffmpeg-filters.html" rel="noopener">ffmpeg filters documentation</a>.',
  SRC_CAPTIONS,
])}
`,
    faq: REEL_DIM_FAQ,
    extraNodes: [
      howToSteps(path, 'How to size a video for an Instagram Reel',
        'Size a video at 1080 x 1920 in 9:16, keep its text within the safe area and export in a format Instagram takes.', [
          ['Start vertical, or convert', 'Record in 9:16, or convert a 16:9 video with a blurred background, a crop or an AI reframe that tracks the speaker.'],
          ['Set the size to 1080 x 1920', 'Export at 1080 pixels wide by 1920 tall, the size that fills a phone screen without enlargement.'],
          ['Keep text in the safe area', 'Place captions above roughly the lowest 15% of the frame, away from the right-hand buttons and just below the top edge.'],
          ['Export a standard file', 'MP4 with H.264 video in yuv420p, the source frame rate (30 fps is typical) and AAC audio at 48 kHz.'],
          ['Pick the cover and check the grid', 'Choose a frame or upload a 1080 x 1920 image, and keep the face and title in the middle 3:4 the profile grid shows.'],
        ], { totalTime: 'PT10M' }),
    ],
    related: ['/platforms/instagram-reels', '/video-aspect-ratio-converter', '/auto-reframe'],
  })
}

/* ------------------------------------------- /how-to/youtube-shorts-aspect-ratio */

const SHORTS_AR_FAQ = [
  {
    q: 'What aspect ratio do YouTube Shorts use?',
    a: '9:16 vertical is the standard, and square (1:1) is accepted too. YouTube\'s help pages say a Short needs a square or vertical shape and runs up to 3 minutes. A horizontal video is posted as a regular video, not a Short.',
  },
  {
    q: 'What size is a YouTube Short?',
    a: '1080 x 1920 pixels for a 9:16 Short, or 1080 x 1080 for a square one. Export at those sizes. Higher resolutions are accepted, but on a phone the difference is minor.',
  },
  {
    q: 'What resolution should a YouTube Short use?',
    a: '1080 x 1920 (1080p vertical) is the practical standard. 720 x 1280 uploads and plays but looks softer. Shoot in vertical 4K and you can upload it, with YouTube serving the higher quality where the viewer\'s screen and connection allow.',
  },
  {
    q: 'How long can a YouTube Short run?',
    a: 'Up to 3 minutes for videos uploaded from 15 October 2024. Before that the limit was 60 seconds, and longer vertical videos posted before that date stay regular videos.',
  },
  {
    q: 'Do I need #Shorts in the title?',
    a: 'No. YouTube decides an upload is a Short from its shape and length: square or vertical, up to 3 minutes. A hashtag will not turn a horizontal video into a Short.',
  },
  {
    q: 'What is the safe zone on YouTube Shorts?',
    a: 'YouTube publishes no exact pixel margins. As a rule of thumb, keep text and faces out of the bottom strip where the title, channel name and subscribe button appear (roughly the lowest 15%, more with a two-line title), away from the right-hand column of buttons and a little below the top.',
  },
  {
    q: 'Can I upload a horizontal video as a Short?',
    a: 'Not as a Short: a 16:9 video is treated as a regular upload. Convert it to 9:16 first with a crop, a blurred background or an AI reframe that tracks the speaker, then upload it.',
  },
  {
    q: 'Why is my Short over one minute blocked?',
    a: 'YouTube blocks a Short over one minute worldwide while an active Content ID claim of any type is attached, for example from music added outside YouTube. It becomes viewable again once the claim is cleared. Shorts under a minute are unaffected.',
  },
]

const shortsAspectRatio = () => {
  const path = '/how-to/youtube-shorts-aspect-ratio'
  return guide(path, 'YouTube Shorts aspect ratio', {
    title: 'YouTube Shorts Aspect Ratio, Size and Resolution (2026)',
    description:
      'YouTube Shorts aspect ratio and size as of October 2026: 9:16 at 1080 x 1920, square allowed, up to 3 minutes, safe zones and how to turn 16:9 vertical.',
    h1: 'YouTube Shorts aspect ratio, size and resolution',
    cta: guideCta('Turn a long video into Shorts with AI', 'Paste a YouTube link and get 1080 x 1920 Shorts with captions and a hook.'),
    tldr: [
      'A YouTube Short is <strong>9:16 vertical at 1080 x 1920 pixels</strong>. YouTube also takes <strong>square</strong> (1:1, 1080 x 1080). It runs <strong>up to 3 minutes</strong>. Square or vertical plus a 3-minute cap is what makes an upload a Short; no hashtag required.',
      'A horizontal 16:9 video is posted as a regular video, however short it is. To make it a Short, convert it to 9:16 with a crop, a blurred background or an AI reframe that holds the speaker in shot.',
      `Keep text out of the bottom strip, where the Shorts player paints the title, channel name and subscribe button, and away from the buttons down the right edge (as of ${AS_OF}).`,
    ],
    facts: [
      { k: 'Aspect ratio', v: '9:16', s: 'Square 1:1 accepted too' },
      { k: 'Size', v: '1080 x 1920', s: 'Pixels, width by height' },
      { k: 'Max length', v: '3 min', s: 'Uploads from 15 Oct 2024' },
      { k: 'Horizontal', v: 'Not a Short', s: 'Posted as a regular video' },
    ],
    body: `
<h2>YouTube Shorts specs at a glance</h2>
<table>
<thead><tr><th>Spec</th><th>Use this</th><th>Notes</th></tr></thead>
<tbody>
<tr><td class="os">Aspect ratio</td><td>9:16 vertical</td><td>Square (1:1) is accepted too; horizontal is not a Short</td></tr>
<tr><td class="os">Size</td><td>1080 x 1920 px</td><td>1080 x 1080 for a square Short</td></tr>
<tr><td class="os">Resolution</td><td>1080p vertical</td><td>720p uploads but looks softer; 4K vertical is accepted</td></tr>
<tr><td class="os">Length</td><td>Up to 3 minutes</td><td>For uploads from 15 October 2024; 60 seconds before</td></tr>
<tr><td class="os">File</td><td>MP4, H.264, AAC</td><td>The safest upload; YouTube takes most common formats</td></tr>
<tr><td class="os">Frame rate</td><td>Same as the source</td><td>24, 25, 30, 50 and 60 fps all work</td></tr>
<tr><td class="os">Text safe area</td><td>Centre of the frame</td><td>The player covers the bottom strip and the right edge</td></tr>
</tbody>
</table>
<p class="checked">Length and aspect ratio from YouTube's help pages; the player layout as of ${AS_OF}. YouTube tests interface changes gradually, so your app may differ a little.</p>

<h2>9:16, square and why horizontal is not a Short</h2>
<p>YouTube's help pages define a Short by two properties: a <strong>square or
vertical</strong> aspect ratio and a length of <strong>up to 3 minutes</strong>.
An upload with both is a Short and shows up on the Shorts shelf and in the feed.
A horizontal one is a regular video, even at 30 seconds, and a vertical one over
3 minutes is a regular video too.</p>
<p>9:16 is the shape to aim for because the Shorts player runs full screen on an
upright phone. A square Short is allowed, but in the player it sits in the middle
with space above and below, so it fills only part of the screen. Square makes
sense when the same file must also work in a square spot elsewhere; for Shorts
alone, vertical uses the whole screen.</p>
<p>Posting the same video as both a Short and a regular video comes down to the
file, not a setting: export a 9:16 version for Shorts and keep the 16:9 one for
the main channel.</p>

<h2>YouTube Shorts size and resolution</h2>
<p><strong>1080 x 1920</strong> is the size to export a vertical Short at, and
<strong>1080 x 1080</strong> a square one. It is the width that fills a phone
screen sharply without enlargement. A 720 x 1280 file shares the shape and
uploads fine, but after YouTube's compression it looks noticeably softer on
faces and text. Shoot vertical 4K (2160 x 3840) and YouTube accepts it, serving a
higher-quality stream where the screen and connection allow; whether viewers see
the difference on a phone is another matter, and the file takes far longer to
upload.</p>
<p>Export settings that work: MP4 with H.264 video in 8-bit 4:2:0 colour
(yuv420p), the source frame rate and AAC audio at 48 kHz. In ffmpeg:</p>
<pre><code>ffmpeg -i edit.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart short.mp4</code></pre>

<h2>How long can a YouTube Short run?</h2>
<p>Up to <strong>3 minutes</strong>. YouTube lifted the limit from 60 seconds for
videos uploaded from 15 October 2024; a vertical video over a minute posted
before that date stays a regular video. The help page on three-minute Shorts adds
one rule worth knowing: a Short <strong>over one minute with an active Content ID
claim</strong> of any type is blocked worldwide until the claim is cleared. If you
add a commercial song outside YouTube, keep the Short under a minute or use music
you know is cleared.</p>
<p>As with any short-form format, the limit is a ceiling. A Short is decided in
the feed's first second or two, and most moments that hold a stranger run well
under a minute.</p>

<h2>YouTube Shorts safe zones</h2>
<p>The Shorts player paints its controls on top of the video. As of ${AS_OF}:</p>
<ul>
<li><strong>The bottom strip</strong> carries the title, channel name and avatar, the subscribe button and, when present, the sound and a related-video link. It grows with a two-line title.</li>
<li><strong>The right edge</strong> carries a column of buttons: like, dislike, comments, share, remix and the sound thumbnail.</li>
<li><strong>The top</strong> carries the search and menu icons.</li>
</ul>
<p>YouTube publishes no exact pixel margins, so treat numbers as rules of thumb. A
practical working area on a 1080 x 1920 frame: keep captions and key text above
roughly the lowest 15%, clear of the right-hand 10 to 15%, and a little below the
top edge. Faces and the main action belong in the centre of the frame. Check a
draft on your own phone before you publish a batch.</p>
<p>Clipping AI places burned-in captions about 15% of the frame height above the
bottom edge, so the Shorts player's title, channel name and buttons do not sit on
top of them.</p>

<h2>How to turn a 16:9 video into a 9:16 Short</h2>
<p>A horizontal video has to change shape before it can be a Short. There are
three common ways, plus one smart one.</p>
<ul>
<li><strong>Crop to fill.</strong> Cut a 9:16 window out of the middle and enlarge it. It looks native but keeps only about a third of the width, so a moving subject, or a second person, ends up out of frame.</li>
<li><strong>Blurred background.</strong> Keep the whole 16:9 picture across the middle and fill above and below with a blurred copy. Nothing is lost, but the picture is small: about 608 pixels tall in a 1920-pixel frame.</li>
<li><strong>Black bars.</strong> The same, with black instead of blur. The simplest and the least attractive.</li>
<li><strong>Reframe that follows the speaker.</strong> A crop that moves with the face that is talking, two speakers stacked one above the other, or a screen recording held readable with the presenter beside it.</li>
</ul>
<p>The first three run in your browser, with no upload and no account, in the
free <a href="/video-aspect-ratio-converter">16:9 to 9:16 converter</a>. A
centred crop in ffmpeg is a single line:</p>
<pre><code>ffmpeg -i input.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac short.mp4</code></pre>
<p>The fourth is what an AI reframe does, and why a fixed crop is fine for one
speaker sitting still but not for a podcast, an interview or a talk. The modes
are explained on <a href="/auto-reframe">the auto reframe page</a>.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Uploading a short horizontal clip and expecting a Short.</strong> Shape decides it, not length alone.</li>
<li><strong>Captions in the TV position.</strong> Low captions end up under the title and channel name.</li>
<li><strong>Text under the right-hand buttons.</strong> Long captions running edge to edge get partly covered.</li>
<li><strong>Exporting at 720p to save time.</strong> The softness shows after compression.</li>
<li><strong>A claimed song on a two-minute Short.</strong> Over one minute, an active Content ID claim blocks the Short.</li>
</ul>

${nextStep(path, {
  heading: 'Next step: make Shorts from your long videos',
  html: `<p>Getting the aspect ratio right is the easy part. The work behind a
steady flow of Shorts is finding the moments in your long videos that stand
alone and cutting each one: reframed to 9:16, captioned, with a hook in the
first seconds. Clipping AI reads the whole video, picks those moments and
returns them as 1080 x 1920 Shorts, 15 to 60 seconds by default and up to 3
minutes if you raise the ceiling. It can publish them to your channel or
schedule a week of them. See <a href="/platforms/youtube-shorts">the YouTube
Shorts builder</a> for the details.</p>`,
  title: 'Paste a YouTube link, get 9:16 Shorts',
  body: 'Moments picked from the whole video, reframed to follow the speaker, captioned word by word.',
})}

${faqBlock(SHORTS_AR_FAQ)}

${sources([
  SRC_YT_UPLOAD,
  SRC_YT_3MIN,
  'The Shorts player layout is described as of October 2026 from the YouTube app; YouTube publishes no pixel safe-zone margins.',
  SRC_CAPTIONS,
])}
`,
    faq: SHORTS_AR_FAQ,
    extraNodes: [
      howToSteps(path, 'How to format a video for YouTube Shorts',
        'Make a video 9:16 at 1080 x 1920 and up to 3 minutes long so YouTube treats it as a Short.', [
          ['Make it vertical', 'Record in 9:16, or convert a 16:9 video with a crop, a blurred background or an AI reframe that tracks the speaker. Square 1:1 is also accepted.'],
          ['Export at 1080 x 1920', 'Export MP4 with H.264 video in yuv420p, the source frame rate and AAC audio.'],
          ['Keep it to 3 minutes or less', 'Shorts can run up to 3 minutes. Past one minute, avoid music that may carry a Content ID claim.'],
          ['Keep text in the safe area', 'Place captions above the bottom strip where the title and channel name appear, and away from the right-hand buttons.'],
          ['Upload it', 'Upload from the YouTube app or YouTube Studio. A square or vertical video up to 3 minutes becomes a Short automatically.'],
        ], { totalTime: 'PT10M' }),
    ],
    related: ['/platforms/youtube-shorts', '/auto-reframe', '/video-aspect-ratio-converter'],
  })
}

/* --------------------------------------------- /how-to/make-a-reel-on-facebook */

const FB_REEL_FAQ = [
  {
    q: 'How do I make a Reel on Facebook?',
    a: 'In the Facebook app, tap Create (or the plus button) and pick Reel. Record or choose a video from your gallery, add audio, text and effects, hit Next, write a description, choose your audience and share. Labels shift between app versions, but the flow stays the same.',
  },
  {
    q: 'How do I post a Facebook Reel from a computer?',
    a: 'For a Page, use Meta Business Suite: choose Create reel, upload a vertical video, add a description and post now or schedule it. Since 2025 Facebook also treats fresh video uploads as Reels, so a vertical video posted from a Page on the web generally becomes a Reel too.',
  },
  {
    q: 'How long can a Facebook Reel run?',
    a: 'In June 2025 Meta announced all new Facebook videos would be shared as Reels, with no length or format limit, rolled out gradually. Before that, Reels were capped at 90 seconds. The Reels feed is still built for short vertical clips.',
  },
  {
    q: 'What size is a Facebook Reel?',
    a: '1080 x 1920 pixels, 9:16 vertical. Export an MP4 with H.264 video and AAC audio. Keep captions clear of the bottom strip where Facebook shows your name and description, plus the right-hand buttons.',
  },
  {
    q: 'Can I auto-share my Instagram Reels to Facebook?',
    a: 'Yes, if both accounts sit in the same Accounts Center. Switch on the Facebook option on Instagram\'s share screen for one Reel, or set it to always share in Accounts Center under sharing across profiles. Some music licensed on Instagram may not be available on Facebook.',
  },
  {
    q: 'Can I schedule a Facebook Reel?',
    a: 'For a Page, yes: Meta Business Suite lets you schedule a Reel for a chosen date and time. Scheduling on personal profiles depends on whether professional mode is on and on the app version.',
  },
  {
    q: 'Why is the Reel option missing on Facebook?',
    a: 'Update the app first: Reels tools roll out by region and account type, and the Create menu changes between versions. On the web, personal profiles offer fewer creation tools than Pages; Meta Business Suite is the reliable desktop route for a Page.',
  },
  {
    q: 'Can I make Facebook Reels from a long video?',
    a: 'Yes. Cut the strongest moments from the long video, reframe them to 9:16 and caption them, by hand in an editor or with an AI clipper like Clipping AI, then upload each as a Reel. Clipping AI makes the files; you post them to Facebook yourself.',
  },
]

const facebookReel = () => {
  const path = '/how-to/make-a-reel-on-facebook'
  return guide(path, 'How to make a Reel on Facebook', {
    title: 'How to Make a Facebook Reel (Phone and Desktop, 2026)',
    description:
      'How to make and post Reels on Facebook as of October 2026: the phone app, Meta Business Suite on desktop, specs, sharing from Instagram and long videos.',
    h1: 'How to make a Facebook Reel, on your phone or a computer',
    cta: guideCta('Turn a long video into Reels with AI', 'Paste a link and download captioned 9:16 Reels, ready to post on Facebook.'),
    tldr: [
      '<strong>On your phone:</strong> open the Facebook app, tap <strong>Create</strong> (or the plus button) and pick <strong>Reel</strong>, record or choose a video, edit it, hit <strong>Next</strong>, write a description, choose your audience and <strong>Share</strong>.',
      '<strong>On a computer:</strong> for a Page, open <strong>Meta Business Suite</strong>, choose <strong>Create reel</strong>, upload a vertical video, add a description and post or schedule it. Since 2025 Facebook also treats fresh video uploads as Reels.',
      `Make it <strong>1080 x 1920, 9:16</strong> and keep text centred. Already post Reels on Instagram? You can share them to Facebook automatically. Steps and labels as of ${AS_OF}; Meta changes its menus often.`,
    ],
    facts: [
      { k: 'Size', v: '1080 x 1920', s: '9:16 vertical' },
      { k: 'Length', v: 'No fixed cap', s: 'Since Meta\'s June 2025 change' },
      { k: 'Desktop', v: 'Business Suite', s: 'Create reel, for Pages' },
      { k: 'From Instagram', v: 'Auto-share', s: 'Via Accounts Center' },
    ],
    body: `
<h2>How to make a Reel in the Facebook app</h2>
<p>The Facebook app on iPhone and Android is the main place to create Reels, and
the only one with the full set of editing tools. As of ${AS_OF} the flow is:</p>
<ol>
<li><strong>Open Create.</strong> Tap the plus button or the <strong>Create</strong> area at the top of your feed and pick <strong>Reel</strong>. You can also start from the Reels tab (which replaced the old Video tab in 2025) by tapping the create or camera icon.</li>
<li><strong>Record or choose a video.</strong> Hold or tap the record button to film with the Reels camera, in one take or several clips, or pick one or more videos from your gallery. A video already shot vertically is the easiest starting point.</li>
<li><strong>Edit it.</strong> Trim the clips, add music from Facebook's audio library or keep the original sound, then add text, stickers, effects, a voice-over or automatic captions where your app offers them. Put any text in the centre of the frame (see the safe-zone section below).</li>
<li><strong>Tap Next.</strong> Write a description: one line saying what the Reel is about, plus a few relevant hashtags if you use them. Tag people or a location if it helps.</li>
<li><strong>Choose the audience.</strong> Public lets the Reel be recommended to people who do not follow you; Friends keeps it to them. Pages and professional-mode profiles have more options here, including scheduling on some versions.</li>
<li><strong>Share.</strong> Tap <strong>Share now</strong> (or <strong>Share reel</strong>). It shows up in your followers' feeds and in the Reels tab.</li>
</ol>
<p>No Reel option? Update the app first. Reels tools roll out by region and account
type, and the position of the Create menu changes between versions.</p>

<h2>How to post a Facebook Reel from a computer</h2>
<p>Facebook on the web offers fewer creation tools than the app, so there are two
routes depending on what you are posting from.</p>
<h3>For a Page: Meta Business Suite</h3>
<ol>
<li>Open Meta Business Suite and select the Page.</li>
<li>Choose <strong>Create reel</strong> (from the home screen or the Content or Planner section).</li>
<li>Upload a vertical video. It gets checked for size and length as it uploads.</li>
<li>Add a description, a cover if you want one and any options Business Suite offers that Page, such as collaborators or a location.</li>
<li>Choose <strong>Share now</strong> or <strong>Schedule</strong>, pick the date and time and confirm.</li>
</ol>
<p>Business Suite is also where a Page's scheduled Reels are listed and can be
moved or deleted, which makes it the better route for a team planning posts a
week ahead.</p>
<h3>From facebook.com</h3>
<p>In June 2025 Meta announced that new videos uploaded to Facebook would be
shared as Reels, with the change rolled out gradually to profiles and Pages. In
practice, a vertical video posted from a Page, or from a professional-mode
profile, on facebook.com generally becomes a Reel. On the web you get the upload,
the description and the audience; for music, effects and the Reels camera, use
the app.</p>

<h2>Facebook Reel specs</h2>
<table>
<thead><tr><th>Spec</th><th>Use this</th><th>Notes</th></tr></thead>
<tbody>
<tr><td class="os">Aspect ratio</td><td>9:16 vertical</td><td>Other shapes are accepted since 2025, but vertical fills the Reels feed</td></tr>
<tr><td class="os">Size</td><td>1080 x 1920 px</td><td>Smaller files look soft after compression</td></tr>
<tr><td class="os">Length</td><td>As long as the moment needs</td><td>Meta removed the length limit in June 2025; Reels were capped at 90 seconds before</td></tr>
<tr><td class="os">File</td><td>MP4, H.264, AAC</td><td>MOV from a phone works too</td></tr>
<tr><td class="os">Frame rate</td><td>Same as the source</td><td>30 fps is typical</td></tr>
<tr><td class="os">Text safe area</td><td>Centre of the frame</td><td>The interface covers the bottom strip and right edge</td></tr>
</tbody>
</table>
<p>The Facebook Reels player, like Instagram's, paints your name, the description
and the audio line across the bottom and a column of buttons (like, comment,
share) down the right edge. Facebook publishes no official safe zone for organic
Reels; as a rule of thumb keep captions above roughly the lowest 15% of the
frame, clear of the right-hand 10 to 15% and faces centred. Meta's guidance for
Reels <em>ads</em>, as widely quoted, is stricter: about 14% of the top, 35% of
the bottom and 6% of each side kept free of text. The full size guide, written
for Instagram but true for Facebook Reels too, is
<a href="/how-to/instagram-reel-dimensions">Instagram Reel dimensions</a>.</p>
<p>No length limit does not mean longer is better. A Reel is judged in its first
second or two, and the Reels feed is still built for short vertical video. A
long horizontal episode posted as a Reel competes with clips made for the
format.</p>

<h2>Cross-posting Reels from Instagram to Facebook</h2>
<p>Already making Reels for Instagram? The cheapest way to get Facebook Reels is
to share the same ones. Both accounts need to sit in the same Meta Accounts
Center.</p>
<ul>
<li><strong>One Reel at a time:</strong> on Instagram's final share screen, switch on the Facebook option (it may read <strong>Share to Facebook</strong> or <strong>Recommend on Facebook</strong>) before sharing.</li>
<li><strong>Every Reel:</strong> in Instagram, open Accounts Center, go to <strong>Sharing across profiles</strong>, choose the Instagram account and the Facebook profile or Page and switch on automatic sharing for Reels.</li>
</ul>
<p>Two things to know. Music licensed for your Reel on Instagram is not always
available on Facebook, so a Reel with a popular track may be shared without its
sound or not shared at all. The audiences differ too: a description written for
Instagram (hashtags, an @ handle) can read oddly on Facebook, so check the first
few that cross over.</p>

<h2>Making Facebook Reels from long videos</h2>
<p>Many Pages already hold hours of video that never become Reels: Facebook Live
replays, webinars, sermons, interviews, podcast recordings. Each one usually has
several moments that would stand on their own. Turning them into Reels by hand
means four jobs for every clip:</p>
<ol>
<li><strong>Find the moment.</strong> Watch or skim the recording, or search its transcript, and note where a complete idea begins and ends.</li>
<li><strong>Cut it.</strong> Trim it in an editor, starting a beat before the first word and ending just after the last.</li>
<li><strong>Make it vertical.</strong> Crop the 16:9 frame to 9:16 so the speaker fills the screen, or keep the whole frame over a blurred background.</li>
<li><strong>Caption it.</strong> Most Reels are watched muted, so burn subtitles in, clear of the bottom strip.</li>
</ol>
<p>The steps are simple; the time goes into finding the moments and keeping the
speaker in frame when they move. That is the part an AI clipper automates.</p>

${nextStep(path, {
  heading: 'Next step: let AI cut the Reels for you',
  html: `<p>Clipping AI reads the whole recording, picks the passages that stand on
their own and returns each as a 9:16 Reel with word-by-word captions, a hook over
the opening seconds and a description. Paste the link of a public Facebook video
or Live replay, a YouTube video, or upload the file. It publishes to Instagram as
Reels; it does not post to Facebook, so for Facebook Reels you download the MP4
and post it from the Facebook app or Meta Business Suite, as above. More on
<a href="/platforms/instagram-reels">the AI Reels maker</a> page.</p>`,
  title: 'Paste a link, get Reels ready for Facebook',
  body: 'Moments picked from the whole video, reframed to 9:16, captioned and ready to download.',
})}

${faqBlock(FB_REEL_FAQ)}

${sources([
  SRC_FB_REELS,
  'Facebook app, Meta Business Suite and Accounts Center steps described as of October 2026; Meta tests and renames menus gradually, so labels can vary by account and region.',
  'Reels ad margins (about 14% top, 35% bottom, 6% sides) as quoted from Meta\'s ad guidance by advertising guides; check Meta\'s current ad specs before leaning on them.',
  SRC_CAPTIONS,
])}
`,
    faq: FB_REEL_FAQ,
    extraNodes: [
      howToSteps(path, 'How to make a Reel on Facebook',
        'Create and post a Facebook Reel from the app, or from Meta Business Suite on a computer for a Page.', [
          ['Open Create and choose Reel', 'In the Facebook app, tap Create or the plus button and choose Reel. On a computer, for a Page, open Meta Business Suite and choose Create reel.'],
          ['Record or upload a vertical video', 'Film with the Reels camera or pick a 9:16 video, ideally 1080 x 1920, from your gallery or computer.'],
          ['Edit it', 'Trim it, add music or keep the original sound, and add text or captions in the centre of the frame, clear of the bottom strip and right-hand buttons.'],
          ['Write the description and choose the audience', 'Add a one-line description and any hashtags, then choose Public or Friends.'],
          ['Share or schedule', 'Tap Share now, or schedule the Reel for a date and time in Meta Business Suite.'],
        ], { totalTime: 'PT10M' }),
    ],
    related: ['/platforms/instagram-reels', '/how-to/instagram-reel-dimensions', '/auto-reframe'],
  })
}

/* ---------------------------------------------------- /how-to/make-youtube-shorts */

const MAKE_SHORTS_FAQ = [
  {
    q: 'How do you make a YouTube Short?',
    a: 'In the YouTube app, tap the plus button and choose Create a Short, record or pick a vertical video, add sound and text, hit Next, add a title and upload. Or upload any square or vertical video up to 3 minutes from YouTube Studio: it becomes a Short automatically.',
  },
  {
    q: 'How do I make a YouTube Short from a long video?',
    a: 'For your own videos, the YouTube app can turn part of an upload into a Short (Remix, then Edit into a Short, where available). Or cut the segment yourself, reframe it to 9:16 and caption it, or let an AI clipper like Clipping AI pick the moments and cut several Shorts at once.',
  },
  {
    q: 'How long can a YouTube Short run?',
    a: 'Up to 3 minutes for videos uploaded from 15 October 2024. A Short over one minute with an active Content ID claim is blocked worldwide until the claim is cleared.',
  },
  {
    q: 'Can I make YouTube Shorts on a computer?',
    a: 'Yes, by uploading. In YouTube Studio choose Create, then Upload videos, and pick a square or vertical video up to 3 minutes. The Shorts camera, music library and Shorts effects live in the mobile app only.',
  },
  {
    q: 'Do I need #Shorts for a video to count as a Short?',
    a: 'No. YouTube classifies a video as a Short from its shape and length: square or vertical and up to 3 minutes. The hashtag will not make a horizontal video a Short.',
  },
  {
    q: 'What size should a YouTube Short use?',
    a: '1080 x 1920 pixels, 9:16 vertical. Square 1080 x 1080 is accepted too. Keep text out of the bottom strip and away from the right-hand buttons.',
  },
  {
    q: 'Can I add music to a YouTube Short?',
    a: 'Yes, from the sound library in the YouTube app\'s Shorts editor. Music added outside YouTube can bring a Content ID claim, and a claimed Short over a minute is blocked, so use cleared or royalty-free music for longer Shorts.',
  },
  {
    q: 'Can I link a Short to my long video?',
    a: 'Yes. In YouTube Studio or the app you can set a related video on a Short, which shows a link to that video from your channel underneath. It is the simplest way to send Shorts viewers to the full episode.',
  },
  {
    q: 'Is Clipping AI free for making Shorts?',
    a: `On two terms. The hosted free plan cuts your first video whole up to ${FIRST_VIDEO_MINUTES} minutes, then ${FREE.monthly.minutes} minutes a month, with a watermark and no card; paid plans start at ${money(STARTER.monthly)}/month without one. Paid plans remove the watermark from new clips and from ones you already made.`,
  },
]

const makeShorts = () => {
  const path = '/how-to/make-youtube-shorts'
  return guide(path, 'How to make YouTube Shorts', {
    title: 'How to Make YouTube Shorts (Phone, Desktop, Long Videos)',
    description:
      'How to make YouTube Shorts as of October 2026: the YouTube app camera, uploading a vertical video up to 3 minutes and cutting Shorts from long videos.',
    h1: 'How to make YouTube Shorts: camera, upload or long video',
    cta: guideCta('Turn a long video into Shorts with AI', 'Paste a YouTube link and get several captioned 9:16 Shorts, ready to post.'),
    tldr: [
      'There are three ways to make a YouTube Short. <strong>1. Film it in the YouTube app:</strong> tap the plus button, choose <strong>Create a Short</strong>, record, add sound and text, hit <strong>Next</strong> and upload. <strong>2. Upload a vertical video:</strong> any square or vertical video <strong>up to 3 minutes</strong>, from the app or YouTube Studio, becomes a Short automatically. <strong>3. Cut it from a long video</strong> you already made.',
      'The third is where most channels find their Shorts: one long video holds several moments that stand on their own. Cut them by hand, use YouTube\'s own tool for your uploads, or let an AI clipper find and cut them for you.',
      `Make it <strong>9:16, 1080 x 1920</strong>, put the point up front in the first seconds and caption it for viewers on mute. Steps as of ${AS_OF}.`,
    ],
    facts: [
      { k: 'Shape', v: '9:16', s: 'Or square; never horizontal' },
      { k: 'Max length', v: '3 min', s: 'Uploads from 15 Oct 2024' },
      { k: 'Size', v: '1080 x 1920', s: 'Pixels' },
      { k: 'Hashtag', v: 'Not needed', s: 'Shape and length decide it' },
    ],
    body: `
<h2>What makes a video a Short</h2>
<p>YouTube's help pages define a Short by two things: a <strong>square or
vertical</strong> aspect ratio and a length of <strong>up to 3 minutes</strong>
(the limit for videos uploaded from 15 October 2024; 60 seconds before that).
Any upload with both is a Short, however you made it, and shows up on the Shorts
shelf and in the feed. A horizontal video is a regular video at any length, and
a #Shorts hashtag will not change that. The full specs, safe zones included, are
in <a href="/how-to/youtube-shorts-aspect-ratio">YouTube Shorts
aspect ratio and size</a>.</p>

<h2>Method 1: film a Short in the YouTube app</h2>
<p>The Shorts camera in the YouTube app for iPhone and Android is the quickest
route when you are filming something new. As of ${AS_OF}:</p>
<ol>
<li><strong>Tap the plus button</strong> at the bottom of the YouTube app and choose <strong>Create a Short</strong> (on some versions, <strong>Short</strong>).</li>
<li><strong>Choose the length</strong> with the duration control at the top of the camera, if you want a Short longer than the default.</li>
<li><strong>Add a sound first</strong> if the Short is set to music: tap <strong>Add sound</strong> and pick a track from the library so you can film to the beat.</li>
<li><strong>Record.</strong> Hold the record button, or tap to start and stop. You can film in several clips; the bar at the top shows how much time is left. Use the timer for hands-free takes, plus the speed, filter and green-screen tools if you need them.</li>
<li><strong>Tap the tick</strong> to finish, then edit: add text timed to the right moments, a voice-over, filters, or trim the clips on the timeline.</li>
<li><strong>Tap Next</strong>, write a title (most viewers read it, so keep it short), choose the visibility and whether it is made for kids, then tap <strong>Upload Short</strong>. Where your app offers it, you can schedule it instead of publishing straight away.</li>
</ol>

<h2>Method 2: upload a vertical video you already have</h2>
<p>Edit elsewhere (CapCut, Premiere, DaVinci Resolve, your phone's editor)? Export
a 9:16 file at 1080 x 1920, no longer than 3 minutes, and upload it. There is no
separate Shorts upload: shape and length are enough.</p>
<h3>From your phone</h3>
<ol>
<li>Tap the plus button and choose <strong>Create a Short</strong>.</li>
<li>Tap the gallery thumbnail in the bottom-left corner and pick the video.</li>
<li>Trim it if needed, add sound or text, hit <strong>Next</strong>, add the title and upload.</li>
</ol>
<p>Choosing <strong>Upload a video</strong> instead of the Shorts camera works too:
a vertical video up to 3 minutes still posts as a Short.</p>
<h3>From a computer</h3>
<ol>
<li>Open YouTube Studio and choose <strong>Create</strong>, then <strong>Upload videos</strong>.</li>
<li>Pick the vertical or square file, up to 3 minutes.</li>
<li>Add the title and description, choose the audience and, on the Visibility step, publish it or set a date and time to schedule it.</li>
</ol>
<p>The Shorts camera, sound library and Shorts effects are in the mobile app only;
on a computer you upload a finished file.</p>
<p>One rule for both routes: YouTube blocks a Short over one minute worldwide
while it carries an active Content ID claim, for example from a song you added in
your editor. Keep claimed music out of longer Shorts, or use the app's sound
library.</p>

<h2>Method 3: make Shorts from your long videos</h2>
<p>A long video you already published is the best Shorts source most channels
have: a 40-minute podcast or tutorial often holds half a dozen moments that make
sense to someone who has never seen the channel. There are three ways to pull
them out.</p>
<h3>YouTube's own tool, for your uploads</h3>
<p>In the YouTube app, open one of your own long videos, tap <strong>Remix</strong>
then <strong>Edit into a Short</strong> where available. Pick the segment and it
opens in the Shorts editor, where you can reframe it, add text and publish. It is
free and stays inside YouTube, but you pick the moment yourself and make one
Short at a time, and the tool's segment length and availability can differ from
the full 3-minute Shorts limit.</p>
<h3>By hand, in an editor</h3>
<p>Download your own upload from YouTube Studio (Content, three-dot menu,
Download) or use the original file, then for each Short: find the moment
(the transcript speeds this up: search a phrase and jump to its timestamp), cut
it on sentence boundaries, crop the 16:9 frame to 9:16 so the speaker fills it,
burn in captions and export at 1080 x 1920. It gives you full control, and most
people spend well over ten minutes per Short. The detailed steps, ffmpeg commands
included, are in <a href="/how-to/clip-a-youtube-video">how
to clip a YouTube video</a>.</p>
<h3>With an AI clipper</h3>
<p>An AI clipper does the slow part: it reads the whole video and hands back the
strongest moments already cut, reframed and captioned. With Clipping AI:</p>
<ol>
<li>Paste the YouTube link, or upload the file.</li>
<li>The video is transcribed word by word, and Gemini scores every stretch for how well it stands alone.</li>
<li>The best moments are cut on sentence boundaries, 15 to 60 seconds by default or up to 3 minutes if you raise the ceiling.</li>
<li>Each is reframed to 9:16: the speaker tracked, two people stacked, or a screen held readable beside the presenter. Captions are burned in from the transcript and a hook is drawn over the opening seconds.</li>
<li>Publish them to your channel, schedule a week of them or download the files.</li>
</ol>
<p>Use it on your own videos, channels you manage or footage you are licensed to
clip; each job asks you to confirm that.</p>

<h2>What makes a Short work</h2>
<ul>
<li><strong>The first second.</strong> Viewers decide in the feed whether to stay. Open on the point, not a greeting or a logo.</li>
<li><strong>One idea.</strong> A Short that needs the previous ten minutes of context loses a stranger. Pick moments that stand alone.</li>
<li><strong>Captions.</strong> Many people watch with the sound off. Burn subtitles in, above the bottom strip where the title and channel name sit.</li>
<li><strong>A clean ending.</strong> End on the payoff. A Short that loops smoothly back to its start often gets watched twice.</li>
<li><strong>A link to the long video.</strong> Set the Short's related video to the full episode, so viewers who want more can find it.</li>
<li><strong>A steady rhythm.</strong> One Short a day from last week's long video beats ten in one day and then silence.</li>
</ul>

${nextStep(path, {
  heading: 'Next step: make a week of Shorts from one video',
  html: `<p>Already publishing long videos? Your next Shorts are inside them.
Paste a link and Clipping AI returns several 9:16 Shorts with captions, a hook and
a title written for the Shorts feed, and can post them to your channel one a day.
The details are on <a href="/platforms/youtube-shorts">the YouTube Shorts
builder</a>; for any YouTube source, see <a href="/platforms/youtube">the YouTube
clip creator</a>; and for the one-link flow, <a href="/youtube-to-shorts-converter">the
YouTube-to-Shorts converter</a>.</p>`,
  title: 'Paste a YouTube link, get Shorts',
  body: 'The AI picks the moments, reframes them to 9:16 and captions them word by word.',
})}

${faqBlock(MAKE_SHORTS_FAQ)}

${sources([
  SRC_YT_UPLOAD,
  SRC_YT_3MIN,
  'YouTube app and YouTube Studio steps described as of October 2026; YouTube rolls out interface changes gradually, so labels can vary by account and region.',
  `Clipping AI pipeline: <a href="/how-clipping-ai-works">how Clipping AI works</a>.`,
])}
`,
    faq: MAKE_SHORTS_FAQ,
    extraNodes: [
      howToSteps(path, 'How to make a YouTube Short',
        'Make a YouTube Short with the YouTube app camera, by uploading a vertical video or by cutting it from a long video.', [
          ['Start a Short', 'In the YouTube app, tap the plus button and choose Create a Short. On a computer, open YouTube Studio and choose Create, then Upload videos.'],
          ['Record or pick a vertical video', 'Film with the Shorts camera, or pick a square or vertical video up to 3 minutes, ideally 1080 x 1920. From a long video, cut the moment and reframe it to 9:16 first.'],
          ['Add sound, text and captions', 'Add a track from the sound library or keep the original audio, and place text and captions above the bottom strip.'],
          ['Add a title', 'Tap Next and write a short title. Choose the visibility and whether the Short is made for kids.'],
          ['Upload or schedule', 'Tap Upload Short, or schedule it for a date and time.'],
        ], { totalTime: 'PT15M' }),
    ],
    related: ['/platforms/youtube-shorts', '/youtube-to-shorts-converter', '/how-to/youtube-shorts-aspect-ratio'],
  })
}

/* --------------------------------------------- /how-to/best-time-to-post-youtube-shorts */

const BEST_TIME_FAQ = [
  {
    q: 'When is the best time to post YouTube Shorts?',
    a: 'No single best time works for every channel, and YouTube publishes none. Your best time is just before your own viewers are most active, which YouTube Analytics shows in the "When your viewers are on YouTube" chart. Then test it.',
  },
  {
    q: 'Does posting time matter for a YouTube Short?',
    a: 'Less than for most formats. Shorts ride a recommendation feed and can keep collecting views for days or weeks, so a good Short posted at an odd hour still finds an audience. Timing mostly affects how fast the first views arrive from people who already watch you.',
  },
  {
    q: 'How do I find when my viewers are on YouTube?',
    a: 'In YouTube Studio, open Analytics, then the Audience tab, and find "When your viewers are on YouTube". It is a grid of days and hours, darker where more of your viewers are online, based on the last 28 days. It covers your whole channel, not just Shorts, and needs enough viewers to show up.',
  },
  {
    q: 'Which times are often recommended for Shorts?',
    a: 'Scheduling-tool blogs often cite weekday early afternoons (around 12 to 3 pm) and evenings (around 6 to 9 pm) in the viewers\' time zone, plus late weekend mornings. Those are averages across other channels, not YouTube guidance. Use them as starting slots for a test if your own chart is empty.',
  },
  {
    q: 'How often should I post YouTube Shorts?',
    a: 'As often as you can keep up good ones. A steady rhythm, like one Short a day or a few a week at similar times, is easier to test and sustain than bursts. A string of weak Shorts will not help a channel.',
  },
  {
    q: 'Should I post Shorts in my time zone or my viewers\'?',
    a: 'Your viewers\'. Check the top geographies in YouTube Analytics, and if most viewers sit in another time zone, plan around their day. YouTube Studio\'s scheduler uses the time zone it shows beside the date and time, so check it before you schedule.',
  },
  {
    q: 'How long should I wait before judging a time slot?',
    a: 'Compare each Short at the same age, such as 48 hours and 7 days after posting, and only after several Shorts per slot. One Short doing well or badly says more about the Short than the time.',
  },
  {
    q: 'Can I schedule YouTube Shorts?',
    a: 'Yes. In YouTube Studio, set the visibility to Schedule and pick a date and time when you upload; the mobile app offers scheduling too. Clipping AI can schedule a batch of Shorts one a day at the time and time zone you pick.',
  },
]

const bestTimeShorts = () => {
  const path = '/how-to/best-time-to-post-youtube-shorts'
  return guide(path, 'Best time to post YouTube Shorts', {
    title: 'Best Time to Post YouTube Shorts: Find Your Own Window',
    description:
      'There is no universal best time to post YouTube Shorts. Find yours in YouTube Analytics, test time slots properly and post on a schedule you can sustain.',
    h1: 'The best time to post YouTube Shorts, and how to find yours',
    cta: guideCta('Schedule a week of Shorts from one video', 'Paste a link, get Shorts and post them one a day at the hour you choose.'),
    tldr: [
      '<strong>There is no universal best time to post YouTube Shorts</strong>, and YouTube publishes none. Shorts ride a recommendation feed and can keep finding viewers for days, so the time you post matters less than the Short itself.',
      'The time that does matter is <strong>when your own viewers are online</strong>. YouTube Studio shows it in Analytics, under Audience, in the <strong>"When your viewers are on YouTube"</strong> chart. Post a little before the darkest blocks, in your viewers\' time zone.',
      'Then <strong>test</strong>: rotate two or three time slots for a few weeks, compare each Short at the same age and keep the slot that wins. Above all, <strong>stay consistent</strong>: one good Short a day at a steady time beats a burst and a silence.',
    ],
    facts: [
      { k: 'Universal best time', v: 'None', s: 'YouTube publishes none' },
      { k: 'Your data', v: 'Analytics', s: 'Audience tab, last 28 days' },
      { k: 'Test window', v: '3-4 weeks', s: 'Several Shorts per slot' },
      { k: 'Rhythm', v: 'Steady', s: 'Similar times, sustainable pace' },
    ],
    body: `
<h2>Why there is no single best time</h2>
<p>Search for the best time to post Shorts and you will find confident answers
that contradict each other. They differ because they are averages over different
sets of channels, and your audience is not an average. A channel whose viewers
are students in one country, one whose viewers work nights, and one whose viewers
span five time zones have three different best times.</p>
<p>Shorts also make timing matter less than a chronological feed does. The Shorts
feed shows each viewer what it predicts they will watch, not what went up most
recently, and a Short can keep collecting views long after publishing. Posting
when your existing viewers are online helps a Short pick up first views sooner;
after that, how it performs with the people it is shown to carries far more
weight than the minute it went up. A strong Short posted at a bad time still
finds its audience. A weak one at the perfect time does not.</p>
<p>So the useful question is not "what is the best time" but "when are my viewers
on YouTube, and does posting then make a difference for my channel?" Both have
answers you can dig up yourself.</p>

<h2>Step 1: find when your viewers are on YouTube</h2>
<p>YouTube Studio has a chart for exactly this:</p>
<ol>
<li>Open <strong>YouTube Studio</strong> on a computer and choose <strong>Analytics</strong>.</li>
<li>Open the <strong>Audience</strong> tab.</li>
<li>Find the card <strong>When your viewers are on YouTube</strong>. It is a grid of days and hours, darker where more of your viewers are online.</li>
</ol>
<p>Things to know about that chart:</p>
<ul>
<li>It covers the <strong>last 28 days</strong> across all devices, and shows when your viewers are on YouTube in general, not only when they watch you.</li>
<li>It is <strong>channel-wide</strong>, not specific to Shorts. If most of your viewers come from long videos, it still describes them. Usually that is the best starting point you have.</li>
<li>It needs <strong>enough viewers</strong> to appear. On a new channel it may be missing; use the fallback below.</li>
<li>Check the <strong>time zone</strong> the chart shows and compare it with the one your YouTube Studio scheduler uses.</li>
</ul>
<p>Read it for the pattern, not the single darkest square. Most channels show a
daily rise and fall, often with a different shape at weekends. A common move is
to publish an hour or two before the busiest stretch begins, so the Short has
been out a little while when most of your viewers arrive.</p>
<h3>If the chart is empty: start with geography</h3>
<p>On a small channel, open the same Audience tab and look at the top geographies,
or simply think about who you make videos for. Pick the time zone most viewers
live in and start with two plausible slots in their day, like early afternoon
and evening. Scheduling-tool blogs often cite weekday early afternoons (around
12 to 3 pm) and evenings (around 6 to 9 pm) in the viewers' time zone, plus late
weekend mornings. Treat those as starting slots for a test, not as rules: they
are averages over other people's channels, and YouTube does not endorse them.</p>

<h2>Step 2: test your time slots properly</h2>
<p>A chart tells you when viewers are online. A test tells you whether posting then
actually changes anything for your Shorts. A simple method that needs nothing
beyond YouTube Studio and a spreadsheet:</p>
<ol>
<li><strong>Choose two or three slots</strong> from Step 1, for example 1 pm and 7 pm in your viewers' time zone.</li>
<li><strong>Rotate them</strong> for three to four weeks, so each slot gets several Shorts and each weekday sees each slot. Posting one Short a day and alternating slots is easy to keep up.</li>
<li><strong>Keep everything else as steady as you can:</strong> similar kinds of Shorts, similar length, the same posting rhythm. If one slot gets all your best Shorts, you are testing the Shorts, not the time.</li>
<li><strong>Compare at the same age.</strong> Record each Short's views, and if you can, its average percentage viewed and how many viewers kept watching, at 48 hours and 7 days after posting. In YouTube Studio, the Content tab lists your Shorts and each one's analytics shows those figures.</li>
<li><strong>Compare medians, not totals.</strong> One Short that takes off can make any slot look like the winner. The median Short per slot is what tells you about the time.</li>
<li><strong>Keep the winner and retest later.</strong> Audiences shift with seasons, school terms and your own growth; a test every few months keeps your slot current.</li>
</ol>
<p>Expect the difference to be small. If two slots perform about the same, that is
a useful result too: post at whichever time you can keep up.</p>

<h2>Step 3: be consistent, then automate it</h2>
<p>For most channels the biggest gain is not the perfect hour but a steady
rhythm. A Short a day, or a few a week at similar times, feeds the algorithm
regularly, gives returning viewers something to expect and makes your tests
readable. Bursts (ten Shorts on Sunday, nothing for two weeks) are hard to
sustain and hard to learn from.</p>
<p>The way to keep a rhythm is to stop depending on being online at the right
moment:</p>
<ul>
<li><strong>YouTube Studio</strong> lets you schedule a Short: when you upload, choose <strong>Schedule</strong> on the Visibility step and pick the date and time. The mobile app offers scheduling too.</li>
<li><strong>Clipping AI</strong> can schedule a whole batch: once it has cut the Shorts from a long video, <strong>Schedule a week</strong> posts one a day, starting the next day, at the time you choose in your own time zone, to YouTube Shorts and, if you like, TikTok and Instagram.</li>
<li><strong>Autopilot</strong> (on paid plans) goes one step further: it clips each new upload on your connected channel by itself and, with autopublish on, schedules the best clips of each video one a day at the hour you pick, in your time zone. It only picks up videos published after you flip it on.</li>
</ul>

<h2>What matters more than the time</h2>
<ul>
<li><strong>The first second.</strong> Viewers decide in the feed. Open on the point.</li>
<li><strong>Retention.</strong> A Short people watch to the end, or twice, gets shown to more people. Cut the slow parts.</li>
<li><strong>One idea per Short.</strong> A moment that stands on its own works for strangers, who make up most of the Shorts audience.</li>
<li><strong>Captions.</strong> Many viewers watch with the sound off.</li>
<li><strong>Volume you can sustain.</strong> A steady supply of good Shorts is what a posting time optimises; without it there is nothing to optimise.</li>
</ul>

${nextStep(path, {
  heading: 'Next step: a week of Shorts, posted at your time',
  html: `<p>The hardest part of posting at a consistent time is having a Short ready
every day. Publish long videos? Clipping AI cuts several Shorts from each one and
can schedule them one a day at the hour your viewers are online. See
<a href="/platforms/youtube-shorts">the YouTube Shorts builder</a> for the clips
and posting, <a href="/auto-clip">auto clip</a> for clipping every new upload on
its own and <a href="/youtube-automation">YouTube automation</a> for Autopilot,
n8n and the API.</p>`,
  title: 'Paste a link, schedule a week of Shorts',
  body: 'Shorts cut from your long video, posted one a day at the time you choose.',
})}

${faqBlock(BEST_TIME_FAQ)}

${sources([
  '<a href="https://support.google.com/youtube/answer/9314416" rel="noopener">YouTube Help: Understand your YouTube audience</a> ("When your viewers are on YouTube", last 28 days, all devices).',
  'Commonly cited posting windows come from social-media scheduling blogs that aggregate other channels\' data; YouTube publishes no best time to post.',
  `Schedule a week (one clip a day at a chosen time and time zone) is <code>ScheduleWeekModal.jsx</code>; Autopilot's rules are in <code>cloud/autopilot.py</code>.`,
])}
`,
    faq: BEST_TIME_FAQ,
    extraNodes: [
      howToSteps(path, 'How to find the best time to post YouTube Shorts for your channel',
        'Use YouTube Analytics to find when your viewers are online, test two or three time slots and post on a consistent schedule.', [
          ['Open the audience chart', 'In YouTube Studio, open Analytics, then the Audience tab, and find "When your viewers are on YouTube" (last 28 days).'],
          ['Pick two or three slots', 'Choose times shortly before your viewers\' busiest periods, in their time zone. With no chart, start with early afternoon and evening in your main viewers\' time zone.'],
          ['Rotate the slots for three to four weeks', 'Post similar Shorts at each slot, several per slot, keeping the rest of your routine steady.'],
          ['Compare at the same age', 'Record views and retention for each Short at 48 hours and 7 days, then compare the median per slot.'],
          ['Schedule at the winning time', 'Schedule Shorts at the slot that performs best, keep a steady rhythm and test again every few months.'],
        ], { totalTime: 'P28D' }),
    ],
    related: ['/platforms/youtube-shorts', '/auto-clip', '/youtube-automation'],
  })
}

export function guidePages() {
  return [
    freeCompared(),
    howToClip(),
    reelDimensions(),
    shortsAspectRatio(),
    facebookReel(),
    makeShorts(),
    bestTimeShorts(),
  ]
}
