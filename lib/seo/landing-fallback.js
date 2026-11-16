/* Crawler-visible homepage content, injected into #root at build time.
 *
 * The app is a client-rendered SPA, which means the HTML served for / contains
 * an empty <div id="root"> and nothing else. Googlebot renders JavaScript and so
 * sees the real landing page; GPTBot, ClaudeBot and PerplexityBot do not, and
 * measure the homepage as zero characters of text. That is why the site ranks in
 * Google and is absent from AI answers.
 *
 * React's createRoot().render() replaces the contents of #root on mount, so this
 * block is what a non-executing client reads and what a browser shows for the
 * few hundred milliseconds before hydration. It is neither hidden nor cloaked:
 * it is the same content the rendered page shows, in the same order, and it is
 * styled well enough that seeing it briefly is not jarring.
 *
 * Keep it in sync with Landing.jsx when the substance of the page changes. It is
 * duplicated on purpose: a build-time React SSR pass would remove the
 * duplication but would also put hydration on the critical path of a production
 * app that currently has none.
 */

import { EDITIONS, CANONICAL_ANSWERS } from './data.js'
import { renderNav, NAV_CSS, NAV_SCRIPT } from './nav.js'

const S = {
  wrap: 'max-width:72rem;margin:0 auto;padding:0 1.5rem',
  h1: 'font-family:\'Space Grotesk\',ui-sans-serif,system-ui,sans-serif;font-weight:400;font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.06;letter-spacing:-.03em;color:oklch(96% 0.006 262);margin:0 0 1.25rem;text-transform:lowercase',
  h2: 'font-family:\'Space Grotesk\',ui-sans-serif,system-ui,sans-serif;font-weight:400;font-size:clamp(1.5rem,2.6vw,2rem);line-height:1.15;letter-spacing:-.02em;color:oklch(96% 0.006 262);margin:0 0 1rem;text-transform:lowercase',
  h3: 'font-size:1rem;font-weight:600;color:oklch(96% 0.006 262);margin:0 0 .35rem',
  p: 'margin:0 0 1rem;color:oklch(86% 0.01 262);line-height:1.65',
  muted: 'margin:0 0 1rem;color:oklch(64% 0.012 262);line-height:1.65',
  eyebrow:
    'font-family:"JetBrains Mono",ui-monospace,monospace;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:oklch(64% 0.19 258);margin:0 0 1rem',
  section: 'padding:3.5rem 0;border-bottom:1px solid oklch(96% 0.006 262 / .08)',
  grid: 'display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))',
  card:
    'border:1px solid oklch(96% 0.006 262 / .08);border-radius:10px;padding:1.1rem 1.25rem;background:oklch(15.5% 0.022 258)',
  a: 'color:oklch(86% 0.01 262);text-underline-offset:3px',
}

const FEATURES = [
  ['Highlight Finder', 'Google Gemini 3.1 Flash-Lite grades the transcript and scene information to surface the 3 to 15 strongest moments, so you never have to scrub through footage by hand.'],
  ['Smart Vertical Reframe', 'Two reframing modes use MediaPipe face tracking with a YOLOv8 fallback, damped so the shot stays steady rather than swinging around.'],
  ['Word-by-word captions', 'faster-whisper time-stamps each individual word, and FFmpeg then burns those captions into the picture.'],
  ['Voice Dubbing in 30+ Languages', 'Bring your own ElevenLabs key, hosted or self-hosted: the audio is translated while keeping the speaker\'s voice, then re-transcribed so the captions stay in step.'],
  ['Opening Hook Cards', 'AI-written titles sit over the opening seconds — the moment a short-form viewer decides whether to keep watching.'],
  ['Smart Video Effects', 'Gemini builds FFmpeg filter chains for colour grading, transitions and general visual clean-up.'],
  ['Upload From Your Device', 'Podcasts, webinars, livestreams, interviews and vlogs, in full resolution, from a local file or a YouTube link.'],
  ['Run It Yourself, Keep It Private', 'Deploy with Docker on hardware you control and the original video never leaves your own infrastructure.'],
  ['Free YouTube Toolkit', 'An AI thumbnail generator, 10 viral title ideas and descriptions written for you with chapter timestamps.'],
  ['Publish Straight to Socials', 'Send clips to TikTok, Instagram Reels and YouTube Shorts directly from the dashboard.'],
  ['Connect AI Agents (MCP, API, CLI)', 'Hook Claude, ChatGPT or n8n up to an always-on endpoint (mcp.clippingai.local/mcp) and automate the whole clipping flow, with a REST API, per-user keys, completion webhooks and a zero-dependency CLI (pip install openshorts). Guide at /mcp.'],
  ['AI Ad Video Maker', 'The AI drafts a script and produces a lip-synced avatar video for any product or business, from $0.65 per video.'],
  ['AI Actors With Lip-Sync', 'Choose an AI actor or supply a photo to get a talking-head video whose lip movement matches the speech.'],
]

const STEPS = [
  ['Add a long video', 'Anything you own: a podcast, webinar, livestream, interview, or a YouTube link.'],
  ['Let the AI pick the highlights', 'Gemini 3.1 Flash-Lite returns 3 to 15 candidate clips, each 15 to 60 seconds long.'],
  ['Reframe to vertical 9:16', 'Face tracking holds the subject in the centre so the camera does not swing about.'],
  ['Add captions, hooks and effects', 'Word-by-word subtitles, an AI hook card, optional effects and dubbing into 30+ languages using your own ElevenLabs key.'],
  ['Download or share immediately', 'Export the finished clips, or publish straight to TikTok, Instagram Reels and YouTube Shorts.'],
]

// The first seven follow the order of the faqs array in Landing.jsx; the new
// buyer questions (watermark, card, clip count, rights) are also in the
// FAQPage JSON-LD in index.html, with the same answers.
const FAQ = [
  [
    'Is Clipping AI genuinely free?',
    'Self-hosting costs nothing under the MIT licence, with no watermark and no cap; Clipping AI Cloud offers a free tier (your first video up to 60 minutes, then 20 minutes a month, watermarked) plus paid plans from $12/month.' +
      ' Running it yourself spends your own hardware and time: on a typical CPU an 8-minute video takes 5 to 8 minutes to process, and you bring your own Google Gemini key, whose free tier covers 1,500 requests a day. On Clipping AI Cloud an NVIDIA GPU cuts that same video in about 50 seconds, the Gemini key is bundled, auto-posting to TikTok, Instagram and YouTube is already set up, and your clips stay retrievable from any browser.',
  ],
  [
    'Will my clips carry a watermark?',
    'Only on the free Cloud plan. Clips produced on the free plan of Clipping AI Cloud have a small watermark; every paid plan, from $12/month, is free of it, and upgrading clears the mark from clips you already made. The self-hosted edition, free under MIT, never adds one.',
  ],
  [
    'Do I need a card to get started?',
    'No. The free plan of Clipping AI Cloud needs no card: your first video is clipped free up to 60 minutes, then you receive 20 free minutes every month, with a watermark. A card is only requested if you pick a paid plan, from $12/month.',
  ],
  [
    'How many clips will one video produce?',
    'Between 3 and 15, each 15 to 60 seconds long. The AI grades every moment and keeps the ones that work as standalone clips, so the count depends on the source rather than a set quota.',
  ],
  [
    'Can I clip someone else\'s YouTube video?',
    'Only if you own it or have the rights or permission to use it. Before a video is processed, Clipping AI asks you to confirm you own the content or hold the rights to it, and you are accountable for what you submit. Fair use depends on the country and on how the clip is used, so it is never guaranteed; reuploading someone else\'s video without permission is copyright infringement, and platforms remove it and strike the account. Clip your own videos, channels you manage, or footage you have licensed.',
  ],
  ['What is Clipping AI and how does it work?', CANONICAL_ANSWERS.whatIsIt + ' ' + CANONICAL_ANSWERS.howItWorks],
  [
    'How does Clipping AI stack up against Opus Clip?',
    'Both use AI to pick out strong moments and reframe them vertically. Clipping AI is MIT-licensed and can be self-hosted, so the source video never leaves your machine, and it adds voice dubbing into 30+ languages (with your own ElevenLabs key) plus an AI Ad Video Maker with lip-synced actors. Opus Clip is closed source and cloud only, starting at $15/month as of October 2026, and it ships a larger caption-style library. Clipping AI Cloud starts at $12/month, and self-hosting is free. Full comparison at /alternatives/opus-clip.',
  ],
  [
    'How does the vertical reframing actually work?',
    'TRACK mode follows a single subject with MediaPipe face detection and a YOLOv8 fallback, damped so the crop stays put inside a safe zone instead of chasing every head movement. GENERAL mode handles group shots and landscapes by preserving the full width over a blurred backdrop. A speaker tracker stops the crop from flipping between people and holds position through brief occlusions.',
  ],
  [
    'Can Clipping AI translate and dub videos?',
    'Yes, with your own ElevenLabs API key, into more than 30 languages, preserving the original speaker\'s voice characteristics. After dubbing, the audio is re-transcribed so the burned-in captions come out in the target language rather than the original.',
  ],
  [
    'What does the AI Ad Video Maker do?',
    'It creates marketing videos with AI actors for any product or business. You describe the business or paste a website URL, and the AI writes a script, generates a lip-synced actor with voiceover, adds b-roll and captions, with the hook spoken in the first seconds. Low Cost mode is about $0.65 per video and Premium is about $2.00. It works for restaurants, e-commerce, coaching, local businesses and apps, not only software.',
  ],
  [
    'Can I drive Clipping AI from Claude, ChatGPT or n8n?',
    'Yes. Clipping AI has a native MCP server at mcp.clippingai.local/mcp plus a REST API with per-user keys and completion webhooks, so an agent can submit a video URL, wait for processing, list the clips and publish them. The hosted endpoint is always on, with the API key created in your account page; the self-hosted edition serves the same /mcp endpoint while your machine is running. A zero-dependency CLI is on PyPI as openshorts. Full guide at /mcp.',
  ],
  [
    'What hardware do I need to self-host?',
    'Any machine with Docker, realistically 8GB of RAM and a modern multi-core CPU. An NVIDIA GPU is optional and cuts processing time by roughly an order of magnitude. Docker Compose pulls Python 3.11, FFmpeg, YOLOv8, MediaPipe, faster-whisper and the React dashboard. Linux, macOS and Windows via WSL2 are supported.',
  ],
]

/* The hero's paste box, usable before React has mounted (slow devices) and
 * visible to crawlers that never run the bundle. On submit it does exactly what
 * Landing.jsx's handleHeroSubmit + main.jsx's handleLaunchApp do: park the link
 * in os_pending_url (MediaInput preloads it), skip the landing next time and
 * open #app. main.jsx resolves its first view from the hash, so a submit made
 * before hydration lands in the app; after hydration this markup is gone and
 * Landing.jsx's own form takes over (it starts from whatever was typed here).
 * The site sends no CSP header and index.html already runs inline scripts. */
const HERO_FORM = `<form id="seo-hero-form" action="/#app" method="get" style="display:flex;flex-wrap:wrap;gap:.6rem;max-width:44rem;margin:0 0 1rem">
    <label for="seo-hero-url" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Video URL</label>
    <input id="seo-hero-url" type="url" name="url" placeholder="Paste a YouTube link" autocomplete="off" style="flex:1 1 18rem;min-width:0;padding:.8rem 1rem;border-radius:10px;border:1px solid oklch(96% 0.006 262 / .16);background:oklch(15.5% 0.022 258);color:oklch(96% 0.006 262);font:inherit;font-size:1rem">
    <button type="submit" style="padding:.8rem 1.3rem;border-radius:10px;border:0;background:oklch(64% 0.19 258);color:oklch(12% 0.02 258);font:inherit;font-weight:600;cursor:pointer">Make free clips &rarr;</button>
  </form>
  <script>(function(){var f=document.getElementById('seo-hero-form');if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var u=(f.elements.url.value||'').trim();try{if(u)localStorage.setItem('os_pending_url',u);localStorage.setItem('clippingai_skip_landing','1')}catch(_){}location.hash='#app'})})()</script>`

/* Per-platform links, the same ones and in the same order as WORKS_WITH,
 * PLATFORMS and SWITCHING in Landing.jsx. */
const WORKS_WITH = [
  ['/platforms/youtube', 'YouTube'],
  ['/platforms/twitch', 'Twitch'],
  ['/platforms/kick', 'Kick'],
  ['/platforms/tiktok', 'TikTok'],
  ['/podcast-to-shorts', 'podcasts'],
]

const PLATFORMS = [
  ['YouTube clips', 'Drop in a YouTube link and receive vertical cuts, Shorts for your own channel, or the entire video reworked into 9:16 segments.',
    [['/platforms/youtube', 'YouTube clip maker'], ['/platforms/youtube-shorts', 'YouTube Shorts maker'], ['/youtube-to-shorts-converter', 'YouTube to Shorts converter']]],
  ['TikTok &amp; Reels', 'Those same cuts, captioned and given a hook, published to TikTok and Instagram Reels straight from the dashboard.',
    [['/platforms/tiktok', 'TikTok clip maker'], ['/platforms/instagram-reels', 'AI reel generator']]],
  ['Streams', 'Multi-hour Twitch and Kick VODs chopped into sections, keeping the facecam in view and coping with quiet gameplay.',
    [['/platforms/twitch', 'Twitch clip maker'], ['/platforms/kick', 'Kick clip maker'], ['/gta-5-clips', 'GTA 5 clips'], ['/gta-6-clips', 'GTA 6 clips'], ['/wow-forever-clips', 'WoW Forever clips']]],
  ['Podcasts &amp; talks', 'Both hosts stay in shot, a single sermon can be pulled from a whole service, and a speaker moving around a stage stays tracked.',
    [['/podcast-to-shorts', 'Podcast clip maker'], ['/use-cases/sermons', 'Sermon clip maker'], ['/auto-reframe', 'Auto reframe']]],
]

const SWITCHING = [
  ['/alternatives/opus-clip', 'vs Opus Clip'],
  ['/alternatives/klap', 'vs Klap'],
  ['/alternatives/vizard', 'vs Vizard'],
  ['/alternatives/submagic', 'vs Submagic'],
  ['/free-ai-clipping-tools-compared', 'Free plans compared'],
  ['/alternatives', 'All alternatives'],
]

const link = ([href, label]) => `<a style="${S.a}" href="${href}">${label}</a>`

const platformCard = ([title, body, links]) =>
  `<div style="${S.card}"><h3 style="${S.h3}">${title}</h3><p style="margin:0 0 .6rem;color:oklch(64% 0.012 262);font-size:.9rem;line-height:1.6">${body}</p><p style="margin:0;font-size:.9rem;line-height:1.8">${links.map(([h, l]) => link([h, `${l} &rarr;`])).join('<br>')}</p></div>`

const card = (title, body) =>
  `<div style="${S.card}"><h3 style="${S.h3}">${title}</h3><p style="margin:0;color:oklch(64% 0.012 262);font-size:.9rem;line-height:1.6">${body}</p></div>`

export const LANDING_FALLBACK = `<div id="seo-content" style="background:oklch(12% 0.02 258);color:oklch(86% 0.01 262);font-family:'Inter',ui-sans-serif,system-ui,sans-serif;line-height:1.65">
<style>${NAV_CSS}</style>
${renderNav()}
${NAV_SCRIPT}

<section style="${S.section};padding-top:4rem"><div style="${S.wrap}">
  <p style="${S.eyebrow}">Open source AI clip studio &middot; free to use</p>
  <h1 style="${S.h1}">AI clip studio: long video in, scroll-ready shorts out</h1>
  <p style="${S.p};max-width:44rem;font-size:1.05rem">Paste a YouTube link or upload a podcast, stream or interview. The AI chooses the 3 to 15 moments worth sharing, reframes the picture to 9:16 around whoever is talking, and burns in the captions — ready for TikTok, Reels and Shorts within minutes. Would rather host it yourself? It is <a href="/free-ai-clip-generator" style="${S.a}">free and open source</a>. Claude, ChatGPT and n8n can run it too, through <a href="/mcp" style="${S.a}">MCP</a>.</p>
  ${HERO_FORM}
  <p style="${S.muted};max-width:44rem">45,000+ accounts created &middot; 32,900+ videos clipped &middot; 8,300+ hours of video processed &middot; 7.5k GitHub stars.</p>
  <p style="${S.muted};max-width:44rem"><strong style="color:oklch(75% 0.11 150)">No card needed.</strong> Your first video is free up to 60 minutes, then 20 free minutes every month. Paid plans from $12/month without a watermark. Would rather run it yourself? <a style="${S.a}" href="https://github.com/mutonby/openshorts" rel="noopener">Self-host free on GitHub</a>.</p>
  <p style="${S.muted};max-width:44rem">Accepts links from ${WORKS_WITH.map(link).join(' &middot; ')}.</p>
</div></section>

<section id="platforms" style="${S.section}"><div style="${S.wrap}">
  <h2 style="${S.h2}">Built for every platform: YouTube, TikTok, streams and podcasts</h2>
  <p style="${S.muted};max-width:48rem">One clip maker, adjusted to where the footage originates and where the finished cuts are headed.</p>
  <div style="${S.grid}">${PLATFORMS.map(platformCard).join('')}</div>
  <p style="${S.p};margin-top:1.25rem">${link(['/platforms', 'Every platform and its specs &rarr;'])}</p>
</div></section>

<section style="${S.section}"><div style="${S.wrap}">
  <h2 style="${S.h2}">what clipping ai does</h2>
  <p style="${S.p};max-width:48rem">${CANONICAL_ANSWERS.whatIsIt}</p>
  <p style="${S.p};max-width:48rem">${CANONICAL_ANSWERS.howItWorks}</p>
</div></section>

<section id="pricing" style="${S.section}"><div style="${S.wrap}">
  <h2 style="${S.h2}">Free or paid: what you actually receive</h2>
  <div style="${S.grid};max-width:56rem">
    ${card('Clipping AI self-hosted &middot; $0', EDITIONS.selfHosted.summary)}
    ${card('Clipping AI Cloud &middot; free tier, then from $12/month', EDITIONS.cloud.summary)}
  </div>
</div></section>

<section id="features" style="${S.section}"><div style="${S.wrap}">
  <h2 style="${S.h2}">AI tools that surface the moments worth sharing</h2>
  <div style="${S.grid}">${FEATURES.map(([t, b]) => card(t, b)).join('')}</div>
</div></section>

<section id="how-it-works" style="${S.section}"><div style="${S.wrap}">
  <h2 style="${S.h2}">Turning a long video into Shorts with AI (5 steps)</h2>
  <ol style="max-width:48rem;padding-left:1.25rem;margin:0">
    ${STEPS.map(([t, b]) => `<li style="margin-bottom:.75rem"><strong style="color:oklch(96% 0.006 262)">${t}.</strong> <span style="color:oklch(64% 0.012 262)">${b}</span></li>`).join('')}
  </ol>
</div></section>

<section id="comparison" style="${S.section}"><div style="${S.wrap}">
  <h2 style="${S.h2}">How Clipping AI compares with Opus Clip, Klap and Vizard</h2>
  <p style="${S.muted};max-width:48rem">Starting prices checked 5 October 2026. Clipping AI is $0 when self-hosted, or $12/month hosted with no watermark, billed monthly. 2short.ai starts at $9.90/month, Submagic at $12, Klap at $14 and Vizard at $14.50 a month on yearly billing, Opus Clip at $15/month and Quso (formerly Vidyo.ai) at $19/month yearly. Clipping AI is the only option that is both open source and self-hostable.</p>
  <h3 style="${S.h3};margin-top:1.5rem">Moving over from another tool?</h3>
  <p style="${S.muted}">${SWITCHING.map(link).join(' &middot; ')}</p>
  <p style="${S.muted}">
    <a style="${S.a}" href="/alternatives/opus-clip">Opus Clip alternative</a> &middot;
    <a style="${S.a}" href="/alternatives/klap">Klap alternative</a> &middot;
    <a style="${S.a}" href="/alternatives/vizard">Vizard alternative</a> &middot;
    <a style="${S.a}" href="/alternatives/submagic">Submagic alternative</a> &middot;
    <a style="${S.a}" href="/free-ai-clip-generator">Free AI clip generator</a> &middot;
    <a style="${S.a}" href="/tools">Free tools</a> &middot;
    <a style="${S.a}" href="/youtube-transcript-generator">YouTube transcript generator</a> &middot;
    <a style="${S.a}" href="/youtube-tag-generator">YouTube tag generator</a> &middot;
    <a style="${S.a}" href="/video-aspect-ratio-converter">Video to 9:16 converter</a> &middot;
    <a style="${S.a}" href="/auto-clip">Auto clip</a> &middot;
    <a style="${S.a}" href="/youtube-automation">YouTube automation</a> &middot;
    <a style="${S.a}" href="/platforms">All platforms</a> &middot;
    <a style="${S.a}" href="/use-cases">Use cases</a> &middot;
    <a style="${S.a}" href="/how-to">Guides</a> &middot;
    <a style="${S.a}" href="/platforms/youtube">YouTube clip maker</a> &middot;
    <a style="${S.a}" href="/platforms/youtube-shorts">YouTube Shorts maker</a> &middot;
    <a style="${S.a}" href="/platforms/tiktok">TikTok clip maker</a> &middot;
    <a style="${S.a}" href="/platforms/instagram-reels">AI reel generator</a> &middot;
    <a style="${S.a}" href="/platforms/twitch">Twitch clip maker</a> &middot;
    <a style="${S.a}" href="/platforms/kick">Kick clip maker</a> &middot;
    <a style="${S.a}" href="/auto-reframe">Auto reframe</a> &middot;
    <a style="${S.a}" href="/use-cases/sermons">Sermon clip maker</a> &middot;
    <a style="${S.a}" href="/how-to/clip-a-youtube-video">How to clip a YouTube video</a> &middot;
    <a style="${S.a}" href="/pricing">Pricing</a> &middot;
    <a style="${S.a}" href="/open-source-video-clipper">Open source video clipper</a> &middot;
    <a style="${S.a}" href="/self-hosted-ai-clip-maker">Self-hosted AI clip maker</a> &middot;
    <a style="${S.a}" href="/open-source-ai-video-generator">Open source AI video generator</a> &middot;
    <a style="${S.a}" href="/podcast-to-shorts">Podcast clips</a> &middot;
    <a style="${S.a}" href="/youtube-to-shorts-converter">YouTube to Shorts converter</a> &middot;
    <a style="${S.a}" href="/how-clipping-ai-works">How it works</a> &middot;
    <a style="${S.a}" href="/alternatives">All alternatives compared</a> &middot;
    <a style="${S.a}" href="/free-ai-clipping-tools-compared">Free AI clipping tools compared</a> &middot;
    <a style="${S.a}" href="/alternativas">Alternativas (ES)</a> &middot;
    <a style="${S.a}" href="/opus-clip-pricing">Opus Clip pricing</a> &middot;
    <a style="${S.a}" href="/opus-ai">Opus AI</a> &middot;
    <a style="${S.a}" href="/vizard-ai">Vizard AI</a> &middot;
    <a style="${S.a}" href="/vizard-ai-video-to-text">Vizard AI video to text</a> &middot;
    <a style="${S.a}" href="/alternatives/vidyo-ai">Vidyo.ai (Quso) alternative</a> &middot;
    <a style="${S.a}" href="/alternatives/2short">2short AI alternative</a> &middot;
    <a style="${S.a}" href="/alternatives/sendshort">SendShort alternative</a> &middot;
    <a style="${S.a}" href="/submagic-reviews">Submagic review</a> &middot;
    <a style="${S.a}" href="/mcp">MCP server &amp; API</a> &middot;
    <a style="${S.a}" href="/automate-shorts-api">Automate shorts via API</a> &middot;
    <a style="${S.a}" href="/n8n-youtube-shorts-automation">n8n template: channel on autopilot</a>
  </p>
</div></section>

<section id="faq" style="${S.section}"><div style="${S.wrap}">
  <h2 style="${S.h2}">FAQ: free AI clipping, watermarks and usage limits</h2>
  <dl style="max-width:48rem;margin:0">
    ${FAQ.map(([q, a]) => `<dt style="${S.h3};margin-top:1.5rem">${q}</dt><dd style="margin:.4rem 0 0;color:oklch(64% 0.012 262)">${a}</dd>`).join('')}
  </dl>
</div></section>

<section style="${S.section};border-bottom:none"><div style="${S.wrap}">
  <h2 style="${S.h2}">Open source: run the very same pipeline on your own machine</h2>
  <p style="${S.p};max-width:48rem">${EDITIONS.selfHosted.summary} You will need Docker and, realistically, 8GB of RAM; an NVIDIA GPU is optional and reduces processing time by roughly an order of magnitude. <a style="${S.a}" href="https://github.com/mutonby/openshorts" rel="noopener">Source code and setup on GitHub</a>.</p>
</div></section>

</div>`
