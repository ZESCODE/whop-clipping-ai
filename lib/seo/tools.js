/* The free tools (/tools) and the two automation pages built around
 * Autopilot (/auto-clip, /youtube-automation).
 *
 * Tool pages carry `tool: { entry, html }`. The html is the tool's real form,
 * rendered straight into the static document right under the H1, so it is in
 * the raw HTML a crawler reads and it is the first thing a visitor sees; the
 * entry (dashboard/tools/*.js, built by Vite) only wires it up.
 *
 * House rules that apply to every line here (seo-work REGLAS.md): nothing
 * invented, every number dated and sourced, no em dashes, no filler copy.
 */

import { SITE } from './data.js'
import { esc } from './render.js'

const PUBLISHED = '2026-09-23'

const faqBlock = (faq) =>
  `<h2>Questions creators ask</h2><dl class="faq">${faq
    .map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`)
    .join('')}</dl>`

const sources = (items) =>
  `<h2>Where the facts come from</h2><ul class="sources">${items.map((s) => `<li>${s}</li>`).join('')}</ul>`

const webApp = (path, name, description, category = 'MultimediaApplication') => ({
  '@type': 'WebApplication',
  '@id': `${SITE.url}${path}#app`,
  name,
  description,
  url: `${SITE.url}${path}`,
  applicationCategory: category,
  operatingSystem: 'Any device (browser based)',
  browserRequirements: 'JavaScript must be enabled',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@id': `${SITE.url}/#organization` },
})

/* ------------------------------------------------------------------------ */
/* /tools                                                                    */
/* ------------------------------------------------------------------------ */

export const TOOLS = [
  {
    path: '/youtube-transcript-generator',
    name: 'YouTube transcript extractor',
    blurb: 'Drop in a link and pull the transcript with time marks. Copy the text or save TXT and SRT.',
  },
  {
    path: '/tools/tiktok-transcript-generator',
    name: 'TikTok transcript extractor',
    blurb: 'Paste a TikTok link and turn its captions into text. Copy it or save TXT and SRT.',
  },
  {
    path: '/youtube-tag-generator',
    name: 'YouTube tags, titles and descriptions',
    blurb: 'Tell us about your video in a few lines and get tags, 10 title ideas, or a full description.',
  },
  {
    path: '/video-aspect-ratio-converter',
    name: '9:16 video converter',
    blurb: 'Flip a 16:9 clip to vertical with a soft blur, a tight crop, or bars. It all happens in your browser.',
  },
]

/* The clip tool pages (clip-tools.js, pages.js) and the how-to guide, listed on
 * the hub so every one of them is a described link from /tools. */
const CLIP_MAKERS = [
  { path: '/platforms/youtube', name: 'YouTube clip maker', blurb: 'Paste a YouTube link and get vertical clips with captions and hooks.' },
  { path: '/platforms/youtube-shorts', name: 'YouTube Shorts maker', blurb: 'Turn long videos into Shorts: set length, hooks, captions and post to your channel.' },
  { path: '/platforms/tiktok', name: 'TikTok clip maker', blurb: 'Chop a long video into TikToks and send them over as drafts.' },
  { path: '/platforms/instagram-reels', name: 'AI reels maker', blurb: 'Make Instagram Reels from a long video and publish them directly to Instagram.' },
  { path: '/platforms/twitch', name: 'Twitch clip maker', blurb: 'Cut Twitch VODs into bite-size parts while keeping the facecam in view.' },
  { path: '/platforms/kick', name: 'Kick clip maker', blurb: 'Clip from Kick VOD and clip links, with layouts for IRL and facecam.' },
  { path: '/podcast-to-shorts', name: 'Podcast clip maker', blurb: 'Podcast clips that keep both speakers in frame.' },
  { path: '/use-cases/sermons', name: 'Sermon clip maker', blurb: 'Pull just the sermon from a service while the camera follows the preacher.' },
  { path: '/auto-reframe', name: 'Auto reframe', blurb: '16:9 to 9:16 by following the speaker, stacking two people, or keeping the screen.' },
  { path: '/how-to/clip-a-youtube-video', name: 'How to clip a YouTube video', blurb: 'A walkthrough: the Clip button, YouTube Studio, ffmpeg, or AI-cut Shorts.' },
]

const toolsHub = () => ({
  path: '/tools',
  title: 'Free Tools for YouTube and Short-Form Video | Clipping AI',
  description:
    'Free YouTube tools with no registration: pull transcripts, generate tags, titles and descriptions, and convert video to 9:16 right in your browser.',
  h1: 'Free tools for YouTube and short-form video',
  lede: 'A handful of one-job tools, free and no account needed. They are built by the same crew behind the Clipping AI clip studio.',
  breadcrumb: [{ name: 'Free tools' }],
  published: PUBLISHED,
  updated: PUBLISHED,
  cta: false,
  relatedTitle: 'More from Clipping AI',
  related: ['/auto-clip', '/youtube-automation', '/free-ai-clip-generator'],
  body: `
<div class="tools-grid">
${TOOLS.map((t) => `<a href="${t.path}"><strong>${esc(t.name)}</strong><span>${esc(t.blurb)}</span></a>`).join('\n')}
</div>

<h2>What each tool does, and where it stops</h2>
<p><a href="/youtube-transcript-generator">The transcript extractor</a> pulls the
captions a video already carries on YouTube, whether the creator uploaded them or
YouTube auto-generated them. It does not run its own speech recognition, so a video
with no captions simply says "no captions" instead of inventing words.</p>
<p><a href="/youtube-tag-generator">The tags, titles and descriptions tool</a>
writes from a short brief you type, powered by Google Gemini. It stays inside YouTube's
documented limits: titles up to 100 characters, descriptions up to 5,000, and tags up
to 500 characters in total.</p>
<p><a href="/video-aspect-ratio-converter">The 9:16 converter</a> runs on your
device. Your video is never uploaded, so there is no queue and no daily cap. It keeps
the full frame over a blurred copy, crops to fill, or adds black bars. It does not
track faces: that is the job of the clip studio.</p>

<h2>Clip makers for every platform</h2>
<p>When you need a long video sliced into several vertical clips instead of a single
transcript or one converted file, these pages show how the clip studio handles each
kind of source and destination.</p>
<div class="cluster">
${CLIP_MAKERS.map((t) => `<a href="${t.path}"><strong>${esc(t.name)}</strong><span>${esc(t.blurb)}</span></a>`).join('\n')}
</div>

<h2>Where the full product kicks in</h2>
<p>If you need more than one transcript or one converted file, if you want a long video
chopped into vertical clips with subtitles and the speaker kept in frame, that is
<a href="/free-ai-clip-generator">the AI clip studio</a>: 20 free
minutes a month on Clipping AI Cloud, or unlimited when you self-host the MIT
licensed code. To get every new upload on your channel clipped without lifting a
finger, see <a href="/auto-clip">auto clip with Autopilot</a>.</p>
`,
  faq: [],
})

/* ------------------------------------------------------------------------ */
/* /youtube-transcript-generator and /tools/tiktok-transcript-generator       */
/* ------------------------------------------------------------------------ */
/* Both pages mount the same widget (dashboard/tools/transcript.js). The form's
 * data-platform picks the endpoint for a bare id; a pasted link picks its own,
 * so a TikTok link on the YouTube page (or the reverse) still works.
 *
 * Every claim about behaviour below is read off free_tools.py: per-network
 * limits (LIMITS), the 24 h cache, the track order (choose_track), machine
 * translations never offered, and the "no captions" / "unavailable" verdicts.
 * Change the copy if that code changes. */

const TRANSCRIPT_UPDATED = '2026-10-29'

const transcriptForm = ({ platform, label, placeholder, hint }) => `
<section class="tool" id="tool" aria-label="${esc(label)}">
  <form id="yt-form" class="tool-row" autocomplete="off" data-platform="${platform}">
    <label for="yt-url" class="sr">${esc(platform === 'tiktok' ? 'TikTok video link' : 'YouTube video link')}</label>
    <input id="yt-url" name="url" type="url" inputmode="url" required
      placeholder="${esc(placeholder)}">
    <button type="submit" class="btn-primary">Pull transcript</button>
  </form>
  <p class="tool-hint">${hint}</p>
  <div id="yt-status" class="tool-status" role="status" aria-live="polite" hidden></div>
  <div id="yt-result" hidden>
    <div class="tool-meta"><strong id="yt-title"></strong><span id="yt-sub"></span></div>
    <div class="tool-actions">
      <select id="yt-lang" aria-label="Caption language"></select>
      <label><input type="checkbox" id="yt-ts" checked> show timestamps</label>
      <button type="button" id="yt-copy">Copy text</button>
      <button type="button" id="yt-txt">Save TXT</button>
      <button type="button" id="yt-srt">Save SRT</button>
    </div>
    <div id="yt-text" class="transcript" tabindex="0" aria-label="Transcript text"></div>
    <div class="cta-inline">
      <p>${platform === 'tiktok'
    ? 'Got the full video this TikTok came from? Clipping AI slices it into 3 to 15 vertical clips with captions. 20 free minutes a month.'
    : 'Want the standout moments of this video as vertical clips with captions? Clipping AI cuts it into 3 to 15 shorts. 20 free minutes a month.'}</p>
      <button type="button" id="yt-clip" class="btn-primary">${platform === 'tiktok' ? 'Clip a long video' : 'Make clips from this video'}</button>
    </div>
  </div>
</section>`

const transcriptTool = transcriptForm({
  platform: 'youtube',
  label: 'YouTube transcript extractor',
  placeholder: 'https://www.youtube.com/watch?v=...',
  hint: 'Free, no account. Works on any public video that has captions, including YouTube\'s auto-generated ones. Watch, youtu.be, Shorts and live links all work. Copy the text or save it as TXT or SRT, with or without time marks.',
})

const tiktokTool = transcriptForm({
  platform: 'tiktok',
  label: 'TikTok transcript extractor',
  placeholder: 'https://www.tiktok.com/@user/video/...',
  hint: 'Free, no account. Paste a TikTok video link or an in-app share link (vm.tiktok.com). Works whenever TikTok displays captions. Copy the text or save it as TXT or SRT.',
})

const exampleList = (items, urlOf) => `<ul>
${items.map(([id, label, note]) => `<li><button type="button" class="btn-ghost" data-example-url="${esc(urlOf(id))}">Try it</button> ${esc(label)}. ${esc(note)}</li>`).join('\n')}
</ul>`

const EXAMPLES = [
  ['arj7oStGLkU', 'Tim Urban, "Inside the Mind of a Master Procrastinator" (TED, 14 min)',
    '315 caption lines from the English track TED uploaded; the menu offers 50 tracks.'],
  ['UF8uR6Z6KLc', 'Steve Jobs, 2005 Stanford commencement address (15 min)',
    '244 caption lines; 9 tracks in the menu.'],
  ['8S0FDjFBj8o', 'Will Stephen, "How to sound smart in your TEDx Talk" (6 min)',
    '128 caption lines, a good short test.'],
]

const howToNode = (path, name, steps) => ({
  '@type': 'HowTo',
  '@id': `${SITE.url}${path}#howto`,
  name,
  totalTime: 'PT1M',
  tool: [{ '@type': 'HowToTool', name: 'A web browser' }],
  step: steps.map(([stepName, text], i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: stepName,
    text,
    url: `${SITE.url}${path}#tool`,
  })),
})

const YT_STEPS = [
  ['Copy the video link', 'On YouTube, hit Share under the video and grab the link, or copy the address bar. Watch, youtu.be, Shorts and live links all work.'],
  ['Paste it and click Pull transcript', 'Paste the link into the box at the top of this page and click Pull transcript. The text shows up in a second or two.'],
  ['Pick the caption language', 'If the video has captions in several languages, choose the one you want from the menu above the transcript.'],
  ['Choose time marks or plain text', 'Toggle timestamps on or off. With them, every line starts with the moment it was spoken; without them you get one clean block of text.'],
  ['Copy or save', 'Click Copy text, Save TXT for a plain file, or Save SRT for a subtitle file you can load into a video editor or YouTube Studio.'],
]

const YT_FAQ = [
  {
    q: 'How do I pull the transcript of a YouTube video?',
    a: 'Copy the video link, paste it into the box on this page and hit Pull transcript. You get the full text with time marks that you can copy or save as TXT or SRT. On YouTube itself, open the description and click Show transcript, which displays the text in a panel but offers no download button.',
  },
  {
    q: 'How do I turn a YouTube video into text?',
    a: 'Paste the link above, turn off timestamps and hit Copy text or Save TXT: you get YouTube to text as one flowing block, built from the video\'s own captions. Keep timestamps on if you want each line to point back to its moment. It works for any public video with captions, including auto-generated ones.',
  },
  {
    q: 'Is this YouTube transcript extractor free?',
    a: 'Yes. No account, no payment, no registration. To keep it quick for everyone it allows 10 transcripts per 10 minutes and 60 per day from the same network, and the whole tool has a shared daily cap that resets at midnight UTC.',
  },
  {
    q: 'Can I get a YouTube transcript with time marks?',
    a: 'Yes. Timestamps are on by default and each one jumps to that moment of the video. Turn them off for plain text in a single block. Copy text and TXT follow the checkbox; the SRT file always carries start and end times.',
  },
  {
    q: 'Can I save a YouTube transcript as a text file or SRT?',
    a: 'Yes. Save TXT keeps the text exactly as shown, with or without time marks. Save SRT produces a subtitle file with one numbered cue per caption line, which Premiere Pro, DaVinci Resolve, CapCut and YouTube Studio can import.',
  },
  {
    q: 'Does it work on videos with only auto-generated captions?',
    a: 'Yes. When the creator has not uploaded subtitles, the tool returns YouTube\'s automatic captions in the spoken language and marks them as auto-generated. They come from speech recognition, so expect misspelled names and, on older videos, little punctuation.',
  },
  {
    q: 'Why does it say a video has no captions?',
    a: 'Because YouTube has none for it: no uploaded subtitles and no automatic track. That happens with music, with brand-new uploads YouTube has not processed yet, and when a channel switches auto-captions off. The tool never guesses words it cannot read.',
  },
  {
    q: 'Can I get the transcript of a YouTube Short or a live stream?',
    a: 'Yes, paste the Shorts or live link as-is. A Short with speech usually has an automatic track like any other video. A live stream gets captions once it ends and YouTube processes it; a stream still running or a premiere that has not aired cannot be read.',
  },
  {
    q: 'Which languages does it support?',
    a: 'Every language YouTube has a genuine caption track for. The menu lists tracks uploaded by the creator plus YouTube\'s automatic track in the spoken language. YouTube\'s machine translations of that track are left out, because they are not what was actually said.',
  },
  {
    q: 'Can I translate a YouTube transcript?',
    a: 'If the creator uploaded subtitles in other languages, pick one from the menu: those are human translations. Otherwise save the TXT or SRT and run it through a translation tool; an SRT keeps its timing, so the translated file still works as subtitles.',
  },
  {
    q: 'Does it work on private, members-only or age-restricted videos?',
    a: 'No. The tool only reads what YouTube shows to anyone who is not signed in. Private, members-only, age-restricted and removed videos get a message saying their captions cannot be read.',
  },
  {
    q: 'Can I get a transcript from TikTok or other sites?',
    a: 'TikTok, yes: paste a TikTok link here or use the TikTok transcript extractor, which reads the captions TikTok displays on the video. Vimeo, Instagram and other sites are not supported.',
  },
  {
    q: 'Do you store the transcripts or the links I paste?',
    a: 'The server holds each result in memory for up to 24 hours so the same video is not fetched from YouTube twice, and nothing is tied to you because there is no account. Analytics record that the tool was used and whether it worked, not which video.',
  },
]

const transcriptPage = () => ({
  path: '/youtube-transcript-generator',
  title: 'YouTube Transcript Maker: Free, TXT & SRT | Clipping AI',
  description:
    'Pull the transcript of any YouTube video for free: paste the link, copy the text with or without time marks, or save it as TXT or SRT. No account, any language.',
  h1: 'YouTube transcript extractor: free, with time marks, TXT or SRT',
  lede: 'Paste a YouTube link and pull the full transcript in a couple of seconds, every line time-stamped. Copy it or save a TXT or SRT file. <strong>Free, no account, no registration.</strong>',
  breadcrumb: [{ name: 'Free tools', path: '/tools' }, { name: 'YouTube transcript extractor' }],
  published: PUBLISHED,
  updated: TRANSCRIPT_UPDATED,
  cta: false,
  tool: { entry: 'tool-transcript', html: transcriptTool },
  relatedTitle: 'Other free tools',
  related: ['/tools/tiktok-transcript-generator', '/youtube-tag-generator', '/video-aspect-ratio-converter'],
  body: `
<h2>How to pull the transcript of a YouTube video</h2>
<ol>
${YT_STEPS.map(([name, text]) => `<li><strong>${esc(name)}.</strong> ${esc(text)}</li>`).join('\n')}
</ol>
<p>The tool reads the captions the video already carries on YouTube. It does not
download the video or run its own speech recognition, which is why
a YouTube video transcript comes back in about the time a page takes to load. Above the text you
will see the video title, the channel, the length, the word count and where the words
came from: captions the creator uploaded, or YouTube's auto-generated ones.</p>

<h2>Give it a spin with a real video</h2>
<p>These were checked on 23 September 2026. Click one to give it a go:</p>
${exampleList(EXAMPLES, (id) => `https://www.youtube.com/watch?v=${id}`)}

<h2>Reading the transcript on YouTube itself</h2>
<p>YouTube has its own transcript viewer, and for following along with a video it
does the job. Where it struggles is getting the text out: there is no copy or
download button, and selecting the panel by hand drags in the time marks line by
line. The steps below describe YouTube's layout as of October 2026; YouTube does
shuffle these controls from time to time.</p>
<p><strong>On a computer.</strong> Open the video and click the description
under it (the "...more" link) to expand it. Near the end of the description
you will find a Transcript section with a <strong>Show transcript</strong> button.
The transcript opens in a panel beside the video, each line with its time.
Clicking a line jumps to that moment, and the panel can hide the time marks
and switch language when more than one track exists.</p>
<p><strong>On the phone app.</strong> Tap the title or description under the
video, scroll down and tap <strong>Show transcript</strong>. The text scrolls along
with the video. Copying from the app is fiddly, so on a phone this page is the
faster route to text you can paste somewhere else.</p>
<p>If you do not see Show transcript at all, the video almost always has no
captions, and this tool will tell you the same thing.</p>

<h2>With time marks or as plain text</h2>
<p>Keep the time marks when the timing matters: quoting someone with the moment as
your citation, writing chapters, checking a fact against the video, or handing
the text to an AI model and asking it to point to where something was said. Every
timestamp here links to that second of the video, and copied or saved
text keeps them as <code>[12:34]</code> at the start of each line.</p>
<p>Turn timestamps off when you want prose, the plain YouTube to text version: a
blog draft, notes, a translation, or a search. Without time marks the caption lines are joined into one block, which
reads far better than line-by-line fragments, because YouTube splits captions
for the screen, not at the end of sentences.</p>

<h2>SRT: your transcript as a subtitle file</h2>
<p>SRT is the plain-text subtitle format almost every editor and platform
accepts. Each cue is a number, a start and end time down to the millisecond, and
the line of text. Save SRT gives you one cue per caption line of the video,
ready to import into Premiere Pro, DaVinci Resolve, CapCut or back into YouTube
Studio for a re-upload or a second channel.</p>
<p>Two details are handled for you. YouTube's automatic captions roll: each line
stays on screen until the next one finishes, so raw cues overlap. The export
trims every cue to end where the next begins, so lines do not stack up on top of
one another, and a caption that would only flash by gets at least half a second
on screen.</p>
<p>An SRT made from captions is only as good as the captions themselves. Uploaded subtitles
are usually clean; automatic ones carry the recognizer's mistakes. If you are
subtitling a clip for publishing, give it one read-through.</p>

<h2>Languages, auto-captions and translations</h2>
<p>A YouTube video can carry several caption tracks. The tool selects one in this
order: subtitles a person uploaded in the spoken language; then
YouTube's automatic track in that language; then any uploaded track, English
first; then any automatic track. When more than one real track exists, a menu
above the transcript switches between them without leaving the page.</p>
<p>YouTube can also machine-translate its automatic captions into dozens of
languages on the fly. Those are left out of the menu on purpose: they are a
translation of a transcription, two layers of guesswork away from what was said.
Translations the creator uploaded are real tracks, so those are offered.</p>
<p>Auto-captions deserve a word of caution. They are speech recognition, so
names, brands and jargon come out spelled the way they sound, overlapping
speakers get merged, and on older videos there is little or no punctuation. For
a quote you will publish, check the moment in the video: that is what the
timestamp link is for.</p>

<h2>When there is no transcript to find</h2>
<p>Some videos have no captions at all: music and videos without speech, uploads
so recent that YouTube has not processed them yet, and channels that switched
auto-captions off. Private, members-only, age-restricted and removed videos
cannot be read either, and a premiere or a live stream only has captions after it
has aired and been processed. In every case the tool says so, rather than inventing
words.</p>
<p>Occasionally YouTube does not answer at all, and the tool asks you to try
again in a minute. That is about the connection, not the video: a retry usually
works, and Show transcript under the description is your fallback.</p>
<p>If you need the words from a video that has no captions, the
<a href="/free-ai-clip-generator">Clipping AI clip studio</a> runs its own
speech recognition with word-level timing and uses it to cut the video into
subtitled vertical clips. That is the full product, with a free allowance of 20
minutes a month on Clipping AI Cloud and paid tiers from $12 a month on
<a href="/pricing">the pricing table</a>, or free with no cap when you self-host
the open source code.</p>

<h2>What creators do with a YouTube transcript</h2>
<ul>
<li><strong>Notes and studying.</strong> Read a lecture or a tutorial at your own
pace, search it for the part you need, and keep the time marks to jump back.</li>
<li><strong>Quotes with a source.</strong> Copy the exact words of a talk or an
interview, with the timestamp as your citation and the link to that second.</li>
<li><strong>Blog posts, newsletters and show notes.</strong> Plain text is a
first draft for an article version of the video, or the raw material for show
notes and a description.</li>
<li><strong>Translation.</strong> Save the SRT, translate it, and you have
subtitles in another language that keep the original timing.</li>
<li><strong>Feeding an AI model.</strong> Paste the transcript into ChatGPT,
Claude or Gemini to summarise it, ask questions about it or draft chapters. Keep
the timestamps so the answer can point to the moment it came from. Our
<a href="/youtube-tag-generator">titles, descriptions and tags tool</a> works
from a short brief, and a few lines of the transcript make a good one.</li>
<li><strong>Finding the moment to clip.</strong> Skim the text for the line
worth a Short, then cut it. If you would rather let the whole video be cut into
vertical clips for you, see how Clipping AI handles
<a href="/platforms/youtube">long YouTube videos</a> and
<a href="/platforms/youtube-shorts">YouTube Shorts</a>, or paste the link into the
<a href="/youtube-to-shorts-converter">YouTube to Shorts converter</a>.</li>
<li><strong>Accessibility and editing.</strong> An SRT lines the words up with
the timeline in any editor, which is the start of burned-in captions or a
tidied-up subtitle track.</li>
</ul>

<h2>TikTok, Vimeo and other platforms</h2>
<p>TikTok links work in the box above, and there is a page just for them: the
<a href="/tools/tiktok-transcript-generator">TikTok transcript extractor</a>
reads the captions TikTok shows on a video and exports them the same way. Vimeo,
Instagram, X and other sites are not supported by this tool.</p>

<h2>Limits</h2>
<ul>
<li>One video per request. Playlists, channels and search pages are refused; a
watch link that also names a playlist reads only the video.</li>
<li>10 transcripts every 10 minutes and 60 a day from the same network, plus a
shared daily cap for the whole tool that resets at midnight UTC. A video that
was read in the last 24 hours comes from the cache and does not count.</li>
<li>Public videos only, captions that already exist only, and no machine
translations.</li>
<li>If YouTube takes longer than 45 seconds to answer, the request stops and you
can give it another go.</li>
</ul>

<h2>Your privacy</h2>
<p>There is no account, so nothing you look up is tied to you. The server holds
each result in memory for up to 24 hours so a popular video is fetched from
YouTube once, then forgets it. The transcript is laid out in your browser, and
the Copy, TXT and SRT outputs happen there too: the files never pass through our
servers. Analytics record that the tool was used, whether it worked and how long
it took, not which video you asked for.</p>

${faqBlock(YT_FAQ)}
`,
  faq: YT_FAQ,
  extraNodes: [
    webApp('/youtube-transcript-generator', 'YouTube transcript extractor',
      'Pull the transcript of a YouTube video with time marks from its existing captions. Copy it or save TXT and SRT. Free, no account.'),
    howToNode('/youtube-transcript-generator', 'How to pull the transcript of a YouTube video', YT_STEPS),
  ],
})

/* /tools/tiktok-transcript-generator. Checked against TikTok on 29-oct-2026
 * from a residential connection (see tests/test_free_tools.py for the parsing
 * and route rules; the examples below are those checks). */

const TIKTOK_EXAMPLES = [
  ['https://www.tiktok.com/@hankgreen1/video/7699685948937784590',
    'Hank Green on how the internet skews our view of people (83 s)', '45 caption lines.'],
  ['https://www.tiktok.com/@garyvee/video/7701056731048201486',
    'GaryVee on making content without AI (41 s)', '22 caption lines.'],
]

const TT_STEPS = [
  ['Copy the TikTok link', 'In the TikTok app tap Share, then Copy link. On the website, copy the address of the video page.'],
  ['Paste it and click Pull transcript', 'Paste the link into the box at the top of this page and click Pull transcript.'],
  ['Choose time marks or plain text', 'Toggle timestamps on to start each line with its time, or off for one block of text.'],
  ['Copy or save', 'Click Copy text, Save TXT for a text file, or Save SRT for a subtitle file with the original timing.'],
]

const TT_FAQ = [
  {
    q: 'How do I pull the transcript of a TikTok video?',
    a: 'Copy the video link (Share, then Copy link in the app), paste it into the box on this page and hit Pull transcript. You get the text TikTok shows as captions, with time marks, ready to copy or save as TXT or SRT.',
  },
  {
    q: 'How do I turn a TikTok into text?',
    a: 'Paste the TikTok link, turn off timestamps and hit Copy text or Save TXT: the captions come back as one block of text. Keep timestamps on to start each line with its second, or save SRT for a subtitle file.',
  },
  {
    q: 'Is the TikTok transcript extractor free?',
    a: 'Yes. No account, no payment, no registration. It allows 10 transcripts per 10 minutes and 60 per day from the same network, with a shared daily cap that resets at midnight UTC.',
  },
  {
    q: 'Why does it say a TikTok has no captions?',
    a: 'Because TikTok has none for it. TikTok generates captions for many videos with speech, but not for videos without talking or with only music, and creators can switch captions off. The tool never guesses words it cannot read.',
  },
  {
    q: 'Does it work with vm.tiktok.com share links?',
    a: 'Yes. Share links from the app (vm.tiktok.com, vt.tiktok.com and tiktok.com/t/ links) are followed to the video. A share link that has expired or points to a deleted video gets a message saying so.',
  },
  {
    q: 'Can I save a TikTok transcript as SRT?',
    a: 'Yes. Save SRT produces one cue per caption line with the timing TikTok uses, which CapCut, Premiere Pro, DaVinci Resolve and YouTube Studio can import.',
  },
  {
    q: 'Does it work on photo posts, LIVE or private videos?',
    a: 'No. Photo posts have no speech to caption, LIVE streams are not videos the tool can read, and private, friends-only, removed or region-blocked videos are not visible to it.',
  },
  {
    q: 'Can I get the transcript of a TikTok in another language?',
    a: 'The tool returns the caption tracks TikTok lists for the video, usually one in the spoken language; when there are more, a menu switches between them. For another language, save the SRT and run it through a translation tool.',
  },
  {
    q: 'Do you store the TikTok links I paste?',
    a: 'The server holds each result in memory for up to 24 hours so the same video is not fetched twice, and nothing is tied to you. Analytics record that the tool was used and whether it worked, not which video.',
  },
]

const tiktokTranscriptPage = () => ({
  path: '/tools/tiktok-transcript-generator',
  title: 'TikTok Transcript Maker: Free, TXT & SRT | Clipping AI',
  description:
    'Pull the transcript of a TikTok video for free: paste the link or a vm.tiktok.com share link, then copy the text or save it as TXT or SRT. No account needed.',
  h1: 'TikTok transcript extractor: copy or save what was said',
  lede: 'Paste a TikTok link and pull the captions as text, every line time-stamped. Copy it or save a TXT or SRT file. <strong>Free, no account, no registration.</strong>',
  breadcrumb: [{ name: 'Free tools', path: '/tools' }, { name: 'TikTok transcript extractor' }],
  published: TRANSCRIPT_UPDATED,
  updated: TRANSCRIPT_UPDATED,
  cta: false,
  tool: { entry: 'tool-transcript', html: tiktokTool },
  relatedTitle: 'Other free tools',
  related: ['/youtube-transcript-generator', '/platforms/tiktok', '/video-aspect-ratio-converter'],
  body: `
<h2>How to pull a TikTok video transcript</h2>
<ol>
${TT_STEPS.map(([name, text]) => `<li><strong>${esc(name)}.</strong> ${esc(text)}</li>`).join('\n')}
</ol>
<p>Going from TikTok to transcript takes a single paste. The tool reads the captions
TikTok already serves with the video, the same lines you see on screen when
captions are on. It does not download the video and
does not run its own speech recognition. Above the text you will see the caption
of the post, the creator, the length and the word count.</p>

<h2>Give it a spin with a real TikTok</h2>
<p>These were checked on 29 October 2026. Click one to give it a go:</p>
${exampleList(TIKTOK_EXAMPLES, (url) => url)}

<h2>Where TikTok's captions come from</h2>
<p>TikTok runs speech recognition on many videos with talking and shows the
result as captions, and creators can edit those captions or switch them off when
they post. Whatever TikTok's player has for a video is what this tool reads. So
the text is usually solid for clear speech in one voice, and weaker for music,
crowd noise, slang or several people talking at once. Names come out spelled the
way they sound.</p>
<p>The TikTok app shows captions over the video one line at a time, which is fine
for watching and fiddly for copying. Turning those lines into one block of text,
or into a subtitle file with the original timing, is the job this page does.</p>

<h2>Which links work here</h2>
<ul>
<li>Video pages: <code>tiktok.com/@creator/video/1234...</code>, with or without
the tracking parameters the app tacks on.</li>
<li>Share links from the app: <code>vm.tiktok.com/...</code>,
<code>vt.tiktok.com/...</code> and <code>tiktok.com/t/...</code>. They are
followed to the video they point to; an expired one gets a clear message.</li>
<li>Embed links and a bare video ID.</li>
</ul>
<p>Not supported: profiles, hashtags, sounds and collections (one video at a
time), photo posts and slideshows (nothing spoken to caption), LIVE, and private,
friends-only, removed or region-blocked videos.</p>

<h2>Time marks, plain text and SRT</h2>
<p>With timestamps on, every line starts with the second it was said. TikTok links
cannot jump to a moment the way YouTube links can, so here the times are plain
text rather than links. Turn timestamps off for one block of prose: the easiest
form to paste into a document, a caption or an AI model.</p>
<p>Save SRT gives you a subtitle file with one cue per caption line and
TikTok's own start and end times, overlaps trimmed. That is the useful format
when the same video is headed somewhere else: import it into CapCut or Premiere,
restyle the captions, and post the video to Reels or Shorts without retyping a
single word.</p>

<h2>What creators do with a TikTok transcript</h2>
<ul>
<li><strong>Reposting to other platforms.</strong> The SRT carries the captions
to Instagram Reels, YouTube Shorts or Facebook with the timing intact.</li>
<li><strong>Studying what works.</strong> Read the opening lines of the videos that
did well in your niche: the hook is usually in the first sentence, and it is
easier to compare written down.</li>
<li><strong>Scripts and captions.</strong> Turn a video into the post caption, a
thread, a newsletter paragraph or the script for a longer cut.</li>
<li><strong>Quoting accurately.</strong> Copy exactly what a creator said, along
with the moment it was said.</li>
<li><strong>Translation and language learning.</strong> Run the text through a
translator, or read along slowly with a creator who speaks the language you are
learning.</li>
<li><strong>Feeding an AI model.</strong> Paste a few transcripts into ChatGPT,
Claude or Gemini and ask what the openings share, or request a summary.</li>
</ul>

<h2>When there is no transcript to find</h2>
<p>If TikTok has no captions for a video, the tool says so instead of guessing:
that happens with music, with videos without speech, and when a creator switched
captions off. If TikTok does not answer, try again in a minute.</p>
<p>When you have the video file, the <a href="/free-ai-clip-generator">Clipping AI
clip studio</a> runs its own speech recognition with word-level timing and
burns the subtitles in. It works the other direction too: a long video
cut into vertical clips, which is what the
<a href="/platforms/tiktok">TikTok clip maker</a> page covers. The free tier is
20 minutes a month on Clipping AI Cloud; paid tiers start at $12 a month on
<a href="/pricing">the pricing table</a>, and the open source version is free
when you self-host it.</p>

<h2>YouTube videos work as well</h2>
<p>The same box reads YouTube links, and the
<a href="/youtube-transcript-generator">YouTube transcript extractor</a> explains
the YouTube side: caption tracks in several languages, time marks that link to
the moment, and what to do when a video has none.</p>

<h2>Limits and privacy</h2>
<p>10 transcripts every 10 minutes and 60 a day from the same network, with a
shared daily cap that resets at midnight UTC; a video read in the last 24 hours
comes from the cache and does not count. There is no account. The server holds
each result in memory for up to 24 hours and then forgets it, the text and the
files are produced in your browser, and analytics record that the tool was used,
not which video.</p>

${faqBlock(TT_FAQ)}
`,
  faq: TT_FAQ,
  extraNodes: [
    webApp('/tools/tiktok-transcript-generator', 'TikTok transcript extractor',
      'Pull the transcript of a TikTok video from the captions TikTok shows. Copy it or save TXT and SRT. Free, no account.'),
    howToNode('/tools/tiktok-transcript-generator', 'How to pull the transcript of a TikTok video', TT_STEPS),
  ],
})

/* ------------------------------------------------------------------------ */
/* /youtube-tag-generator                                                    */
/* ------------------------------------------------------------------------ */

const metadataTool = `
<section class="tool" id="tool" aria-label="YouTube tags, titles and descriptions">
  <form id="md-form">
    <fieldset class="modes">
      <legend class="sr">What should we write</legend>
      <label><input type="radio" name="mode" value="tags" checked> Tags</label>
      <label><input type="radio" name="mode" value="titles"> Titles</label>
      <label><input type="radio" name="mode" value="description"> Description</label>
    </fieldset>
    <label class="field" for="md-topic"><span>What is the video about, and who is it for? Paste time marks if you want chapters.</span>
      <textarea id="md-topic" rows="4" maxlength="2000" required
        placeholder="Example: I bake sourdough at home with no stand mixer. I show the stretch and folds, the overnight proof in the fridge, and how to tell when the loaf is ready."></textarea>
    </label>
    <label class="field" for="md-keyword"><span>Main keyword (optional)</span>
      <input id="md-keyword" type="text" maxlength="80" placeholder="sourdough bread">
    </label>
    <button type="submit" id="md-go" class="btn-primary">Write tags</button>
  </form>
  <div id="md-status" class="tool-status" role="status" aria-live="polite" hidden></div>
  <div id="md-out" class="out" hidden></div>
  <div id="md-cta" class="cta-inline" hidden>
    <p>Finished the long video? Clipping AI cuts it into vertical Shorts with captions, and its YouTube Studio writes titles straight from the video.</p>
    <a id="md-cta-btn" class="btn-primary" href="${SITE.url}/">Clip this video</a>
  </div>
</section>`

const SAMPLE_TAGS = ['procrastination', 'Tim Urban', 'TED talk', 'instant gratification monkey', 'panic monster',
  'why we procrastinate', 'Tim Urban TED talk', 'procrastination TED talk', 'long term goals', 'no deadline',
  'procrastinating', 'how to stop procrastinating', 'gratification monkey', 'Tim Urban procrastination',
  'Tim Urbin', 'procrastionation', 'psychology', 'productivity', 'TED']

const SAMPLE_TITLES = [
  'Why Procrastination Destroys Goals Without Deadlines',
  'How Procrastination Works Inside Your Brain',
  'Deadlines Actually Protect You From Procrastination',
  'The Kind of Procrastination Panic Cannot Fix',
  'Tim Urban on Procrastination',
]

const metadataPage = () => ({
  path: '/youtube-tag-generator',
  title: 'YouTube Tags, Titles and Descriptions | Clipping AI',
  description:
    'Free YouTube tool that writes tags, titles and descriptions from a short brief. Stays inside YouTube\'s limits: 100-character titles, 500 for tags.',
  h1: 'YouTube tags, titles and descriptions tool',
  lede: 'Describe your video in a few lines and get tags, 10 title ideas, or a full description. Free, no account.',
  breadcrumb: [{ name: 'Free tools', path: '/tools' }, { name: 'YouTube tags, titles and descriptions' }],
  published: PUBLISHED,
  updated: PUBLISHED,
  cta: false,
  tool: { entry: 'tool-metadata', html: metadataTool },
  relatedTitle: 'Other free tools',
  related: ['/youtube-transcript-generator', '/video-aspect-ratio-converter', '/youtube-automation'],
  body: `
<h2>How to use it</h2>
<ol>
<li>Pick <strong>Tags</strong>, <strong>Titles</strong> or <strong>Description</strong>.</li>
<li>Jot down two or three sentences about the video: what happens, who it is for, any specific details (names, tools, places). The more precise your brief, the sharper the output.</li>
<li>Add the keyword you are aiming to rank for, if you have one.</li>
<li>Click a tag to copy it, or grab them all at once and paste them into the Tags field in YouTube Studio. Titles copy with a single click; the description can be edited before you copy it.</li>
</ol>
<p>Need a brief? Paste the video into the <a href="/youtube-transcript-generator">transcript extractor</a> first and summarise from that.</p>

<h2>A real example</h2>
<p>This is unedited output from the tool on 23 September 2026, for the brief
<em>"A TED talk by Tim Urban about procrastination: the instant gratification
monkey, the panic monster, and why long-term goals with no deadline never get
done"</em> with the keyword <em>procrastination</em>.</p>
<p><strong>Tags</strong> (${SAMPLE_TAGS.join(', ').length} characters, note the two intentional misspellings):</p>
<p><code>${esc(SAMPLE_TAGS.join(', '))}</code></p>
<p><strong>Five of the ten title ideas:</strong></p>
<ul>${SAMPLE_TITLES.map((t) => `<li>${esc(t)} <span class="sources">(${t.length} characters)</span></li>`).join('')}</ul>
<p><button type="button" class="btn-ghost" data-example-topic="A TED talk by Tim Urban about procrastination: the instant gratification monkey, the panic monster, and why long-term goals with no deadline never get done." data-example-keyword="procrastination">Use this brief</button></p>

<h2>What it follows, and why</h2>
<ul>
<li><strong>Tags matter less than you think.</strong> YouTube's own help page says tags "play a minimal role in your video's discovery" and are mainly useful when your topic is commonly misspelled. So the tool includes likely misspellings of the names in your brief, while your title and description deserve more of your time.</li>
<li><strong>Length limits.</strong> Titles can run up to 100 characters and descriptions up to 5,000. The tags field takes 500 characters in total, and the tool keeps the list under that and shows the count.</li>
<li><strong>The opening lines of a description do the heavy lifting.</strong> They are what shows before "more", so the tool puts the payoff and the keyword right there.</li>
<li><strong>Three hashtags.</strong> YouTube shows up to three hashtags from the description beside the title and ignores every hashtag on a video that has more than 60.</li>
<li><strong>Nothing invented.</strong> The model is told to use only facts from your brief: no made-up numbers, guests or results, and no chapters unless you gave time marks.</li>
</ul>

${faqBlock([
  {
    q: 'Is this YouTube tags and titles tool free?',
    a: 'Yes, with no account. Each click is one call to Google Gemini on our end, so it allows 12 generations per 10 minutes and 50 a day from the same network.',
  },
  {
    q: 'Do YouTube tags still help with SEO?',
    a: 'A little. YouTube says tags play a minimal role in discovery and are most useful for commonly misspelled topics. Your title, thumbnail and description carry more weight.',
  },
  {
    q: 'How long should a YouTube title be?',
    a: 'YouTube allows 100 characters. Search results and phones cut long titles, so the tool aims for about 60 and puts the main point first.',
  },
  {
    q: 'Which AI writes the titles and descriptions?',
    a: 'Google Gemini, the same model family Clipping AI uses to pick clips and write titles inside its YouTube Studio.',
  },
  {
    q: 'Does it work in other languages?',
    a: 'Yes. Write the brief in your language and the output comes back in that same language.',
  },
])}

${sources([
  '<a href="https://support.google.com/youtube/answer/146402" rel="noopener">YouTube Help: Add tags to your videos</a> (tags play a minimal role; useful for misspellings), checked 23 September 2026.',
  '<a href="https://support.google.com/youtube/answer/57404" rel="noopener">YouTube Help: Edit video settings</a> (100-character titles, 5,000-character descriptions), checked 23 September 2026.',
  '<a href="https://developers.google.com/youtube/v3/docs/videos" rel="noopener">YouTube Data API: videos resource</a> (tags up to 500 characters), checked 23 September 2026.',
  '<a href="https://support.google.com/youtube/answer/6390658" rel="noopener">YouTube Help: Use hashtags for YouTube search</a> (up to three shown by the title, more than 60 ignored), checked 23 September 2026.',
])}
`,
  faq: [
    { q: 'Is this YouTube tags and titles tool free?', a: 'Yes, with no account. It allows 12 generations per 10 minutes and 50 a day from the same network.' },
    { q: 'Do YouTube tags still help with SEO?', a: 'A little. YouTube says tags play a minimal role in discovery and are most useful for commonly misspelled topics.' },
    { q: 'How long should a YouTube title be?', a: 'YouTube allows 100 characters. The tool aims for about 60 and puts the main point first.' },
    { q: 'Which AI writes the titles and descriptions?', a: 'Google Gemini.' },
  ],
  extraNodes: [
    webApp('/youtube-tag-generator', 'YouTube tags, titles and descriptions',
      'Generate YouTube tags, title ideas and a description from a short brief, within YouTube\'s length limits.', 'UtilitiesApplication'),
  ],
})

/* ------------------------------------------------------------------------ */
/* /video-aspect-ratio-converter                                             */
/* ------------------------------------------------------------------------ */

const verticalTool = `
<section class="tool" id="tool" aria-label="9:16 video converter">
  <label class="drop" id="vc-drop" for="vc-file">
    <strong>Pick a video or drop it here</strong>
    <small id="vc-name">MP4, MOV or WebM. Up to 5 minutes get converted. Your file stays on your device.</small>
    <input id="vc-file" type="file" accept="video/*,.mp4,.mov,.m4v,.webm,.mkv" class="sr">
  </label>
  <div class="opts">
    <fieldset>
      <legend>Fill the vertical frame with</legend>
      <div class="modes">
        <label><input type="radio" name="vc-fit" value="blur" checked> Blurred background</label>
        <label><input type="radio" name="vc-fit" value="crop"> Crop to fill</label>
        <label><input type="radio" name="vc-fit" value="bars"> Black bars</label>
      </div>
      <label class="field" id="vc-pos-wrap" for="vc-pos"><span>Crop position (slide left or right)</span>
        <input id="vc-pos" type="range" min="0" max="100" value="50">
      </label>
    </fieldset>
    <fieldset>
      <legend>Output size</legend>
      <div class="modes">
        <label><input type="radio" name="vc-size" value="1080" checked> 1080x1920</label>
        <label><input type="radio" name="vc-size" value="720"> 720x1280</label>
      </div>
    </fieldset>
  </div>
  <button type="button" id="vc-go" class="btn-primary" disabled>Make it 9:16</button>
  <div id="vc-progress" class="progress" hidden><span></span></div>
  <div id="vc-status" class="tool-status" role="status" aria-live="polite" hidden></div>
  <div id="vc-result" class="vc-result" hidden>
    <video id="vc-preview" controls playsinline muted></video>
    <div>
      <p id="vc-info" class="tool-hint"></p>
      <p><button type="button" id="vc-download" class="btn-primary">Save video</button></p>
      <div class="cta-inline">
        <p>Is someone talking? Clipping AI reframes with face tracking so the speaker stays in shot, then cuts the long video into clips with captions.</p>
        <a id="vc-cta-btn" class="btn-primary" href="${SITE.url}/">Try the clip studio</a>
      </div>
    </div>
  </div>
</section>`

const verticalPage = () => ({
  path: '/video-aspect-ratio-converter',
  title: 'Video Aspect Ratio Converter (16:9 to 9:16) | Clipping AI',
  description:
    'Turn a video into 9:16 for TikTok, Reels and Shorts right in your browser: blur, crop or bars. Free, no upload, no watermark.',
  h1: 'Video aspect ratio converter: 16:9 to 9:16 in your browser',
  lede: 'Turn a horizontal video into a vertical 9:16 clip for TikTok, Instagram Reels and YouTube Shorts. It all runs on your device, so nothing gets uploaded.',
  breadcrumb: [{ name: 'Free tools', path: '/tools' }, { name: '9:16 video converter' }],
  published: PUBLISHED,
  updated: PUBLISHED,
  cta: false,
  tool: { entry: 'tool-vertical', html: verticalTool },
  relatedTitle: 'Other free tools',
  related: ['/youtube-transcript-generator', '/youtube-tag-generator', '/youtube-to-shorts-converter'],
  body: `
<h2>Three ways to fill a vertical frame</h2>
<p>A 16:9 video is 1.78 times wider than it is tall; a 9:16 frame is 0.56. Something
has to give, and each option trades off something different:</p>
<ul>
<li><strong>Blurred background</strong> keeps the whole picture, centred, over a
blurred and darkened copy of itself. Nothing gets cut off, but the video only
fills about a third of the screen height. Great for screen recordings, slides and
wide shots.</li>
<li><strong>Crop to fill</strong> uses the full screen and keeps a vertical
slice of the frame, which you can slide left or right. It trims away about two
thirds of the width, so it only works when the subject stays put.</li>
<li><strong>Black bars</strong> is the plain letterbox: the whole picture, with
the rest of the screen left black.</li>
</ul>
<p>The output is 1080x1920 or 720x1280, as MP4 (H.264) in Chrome, Edge and
Safari, or WebM in browsers that cannot encode H.264. Audio stays in.</p>

<h2>Why it all runs in your browser</h2>
<p>Your browser already has a hardware video encoder, and the WebCodecs API lets
a page tap into it. So the file is read, re-framed and encoded on your machine and
never uploaded: no queue, no watermark, no account. The limits are there to keep
your browser tab stable: the first 5 minutes of the video and files up to
2 GB. Leave the tab open while it works.</p>

<h2>When a fixed crop is not enough</h2>
<p>A fixed crop cannot follow a person who moves, and it cannot show two people
talking at once. That is where the
<a href="/youtube-to-shorts-converter">Clipping AI YouTube to Shorts converter</a>
comes in: it tracks faces with MediaPipe so the speaker stays in shot, can stack
two people talking in a split screen, and cuts the long video into 3 to 15 clips
with captions.</p>


${faqBlock([
  {
    q: 'How do I convert a video to 9:16 for free?',
    a: 'Choose the file above, pick a blurred background, crop or black bars, and hit the convert button. The video is processed in your browser and you download a 1080x1920 or 720x1280 file. No registration and no watermark.',
  },
  {
    q: 'Is my video uploaded anywhere?',
    a: 'No. The conversion runs on your device with your browser\'s own video encoder. The file never leaves your computer or phone.',
  },
  {
    q: 'Why is there a 5 minute limit?',
    a: 'The finished video is held in the browser\'s memory until you download it, and long 1080p videos can exhaust a tab. Short-form platforms rarely take more than a few minutes anyway.',
  },
  {
    q: 'Which browsers work?',
    a: 'Current versions of Chrome, Edge, Safari and Firefox. The tool needs the WebCodecs API; a browser without it shows a message instead of failing silently.',
  },
])}

${sources([
  '<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API" rel="noopener">MDN: WebCodecs API</a>, the browser encoder this tool uses.',
  `<a href="https://github.com/Vanilagy/mediabunny" rel="noopener">Mediabunny</a>, the open source library that reads and writes the video files. Face tracking in the clip studio: the project source at <a href="${SITE.repo}" rel="noopener">github.com/mutonby/openshorts</a>.`,
])}
`,
  faq: [
    { q: 'How do I convert a video to 9:16 for free?', a: 'Choose the file, pick a blur, crop or bars, and hit the convert button. It runs in your browser with no registration and no watermark.' },
    { q: 'Is my video uploaded anywhere?', a: 'No. The conversion runs on your device with your browser\'s own video encoder.' },
    { q: 'Why is there a 5 minute limit?', a: 'The finished video is held in the browser\'s memory until you download it, and long 1080p videos can exhaust a tab.' },
    { q: 'Which browsers work?', a: 'Current versions of Chrome, Edge, Safari and Firefox. The tool needs the WebCodecs API.' },
  ],
  extraNodes: [
    webApp('/video-aspect-ratio-converter', '9:16 video converter',
      'Turn a horizontal video into vertical 9:16 in the browser with a blurred background, a crop or black bars.'),
  ],
})

export function toolPages() {
  return [toolsHub(), transcriptPage(), tiktokTranscriptPage(), metadataPage(), verticalPage()]
}
