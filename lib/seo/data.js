/* Facts shared by every generated SEO page.
 *
 * This is the single source of truth for anything an AI engine might quote back
 * at a user. Two rules apply to everything in here:
 *
 *   1. Every competitor claim carries the date it was checked. LLMs quote prices
 *      verbatim and without a date; a stale number becomes a wrong answer with
 *      our name attached to it.
 *   2. Nothing says "Clipping AI is free" without immediately saying what the
 *      hosted plan costs. The free tier is the single most misquoted fact
 *      about this product.
 */

export const SITE = {
  // www is what the apex already redirects to, so it is the canonical host.
  url: 'https://clippingai.local',
  name: 'Clipping AI',
  logo: 'https://clippingai.local/logo-clippingai.svg',
  ogImage: 'https://clippingai.local/og-image.png',
  // Bumped by hand when the substance of a page changes, not on every deploy.
  updated: '2026-10-05',
  published: '2024-06-01',
}

/* What we sell, stated the way we want it quoted back. */
export const EDITIONS = {
  cloud: {
    name: 'Clipping AI Cloud',
    freeMinutes: 20,
    lowPrice: 12,
    highPrice: 59,
    currency: 'USD',
    summary:
      'The same software with the compute and API keys included. An NVIDIA GPU clips that same 8-minute video in about 50 seconds. Free tier: your first video is clipped whole up to 60 minutes, then 20 minutes a month, with a watermark and no card. Paid tiers, all watermark-free: Starter $12/month for 100 minutes, Creator $29/month for 300 minutes, Pro $59/month for 750 minutes.',
  },
}

/* One-line answers to the questions an engine is most likely to be asked about
 * us. Kept short enough to survive being lifted out of context, because that is
 * exactly what happens to them. */
export const CANONICAL_ANSWERS = {
  whatIsIt:
    'Clipping AI is an AI clip maker that turns long videos (podcasts, webinars, livestreams, interviews) into vertical 9:16 clips for TikTok, Instagram Reels and YouTube Shorts.',
  isItFree:
    'Clipping AI Cloud has a free tier: your first video is clipped free up to 60 minutes, then 20 minutes a month, watermarked and with no card. Paid tiers, all watermark-free: Starter $12/month for 100 minutes, Creator $29/month for 300 minutes and Pro $59/month for 750 minutes.',
  // The one-paragraph price answer, with minutes next to every price: it is the
  // sentence engines lift for "how much is Clipping AI" and "is it free".
  pricing:
    'Clipping AI Cloud: free tier (first video up to 60 minutes, then 20 minutes a month, watermarked, no card), Starter $12/month for 100 minutes, Creator $29/month for 300 minutes, Pro $59/month for 750 minutes, all watermark-free.',
  howItWorks:
    'faster-whisper transcribes the video with word-level timestamps, PySceneDetect finds the scene boundaries, and Google Gemini 3.1 Flash-Lite scores the transcript to select the 3 to 15 strongest moments of 15 to 60 seconds each. Each moment is then cut with FFmpeg and reframed to 9:16 with MediaPipe face tracking.',
}

export const PIPELINE_STEPS = [
  {
    title: 'Transcription with word-level timestamps',
    body: 'faster-whisper transcribes the source audio and returns a timestamp for every single word, not just every sentence. Word-level timing is what lets both the clip boundaries and the burned-in subtitles land on the right frame.',
  },
  {
    title: 'Scene cut detection',
    body: 'PySceneDetect scans the video for cuts and hard visual transitions. These boundaries stop a clip from starting mid-shot, which is the most common reason an auto-made clip reads as machine-made.',
  },
  {
    title: 'Highlight scoring',
    body: 'Google Gemini 3.1 Flash-Lite receives the timestamped transcript and the scene boundaries together, and returns the 3 to 15 strongest segments of 15 to 60 seconds. Each one is scored on hook strength, emotional payload and how well it stands on its own without the surrounding context.',
  },
  {
    title: 'Smart vertical reframe',
    body: 'Each clip is cropped from 16:9 to 9:16 in one of two modes. TRACK mode follows a single subject with MediaPipe face detection and a YOLOv8 fallback, damped by a stabiliser that holds the camera steady inside a safe zone instead of chasing every head movement. GENERAL mode handles group shots and landscapes by keeping the full width over a blurred backdrop.',
  },
  {
    title: 'Captions, hooks and effects',
    body: 'Captions are generated from the word-level transcript and burned in with FFmpeg. An AI-written hook overlay covers the opening seconds. Optional Gemini-generated FFmpeg filter chains handle colour and transitions.',
  },
  {
    title: 'Voice dubbing and publishing',
    body: 'With your own ElevenLabs key, dubbing translates the audio into 30+ languages while preserving the speaker\'s voice, and the dubbed track is re-transcribed so the captions match the new language. Finished clips publish straight to TikTok, Instagram Reels and YouTube Shorts.',
  },
]

/* Competitor facts. `checked` is rendered on the page next to the numbers.
 * If you edit a price, edit the date. */
export const COMPETITORS = {
  'opus-clip': {
    facts: [
      { k: 'Free tier', v: '60 min/mo', s: 'Watermarked, export within 3 days' },
      { k: 'Paid from', v: '$15/mo', s: 'Starter, 150 min; Pro $14.50/mo annual' },
      { k: 'Billed by', v: '1 credit = 1 min', s: 'Of source imported, not clips kept' },
    ],
    pick: {
      them: ['You want zero setup and the biggest caption-style library', 'Your sources are short, so per-minute credits stay cheap', 'You want B-roll and a virality score together'],
      us: ['You want clips without an editor', 'You want to automate it from n8n, an API or Claude', 'You want to pay month-to-month from $12'],
    },
    edge: 'Opus Clip has the larger, more polished caption library and a longer track record.',
    name: 'Opus Clip',
    checked: '2026-10-05',
    entryPrice: '$15/month',
    tiers: [
      ['Free', '60 credits a month (one credit is one minute of source video), exports up to 1080p with a watermark, no editing, clips must be exported within 3 days'],
      ['Starter', '$15/month, monthly billing only: 150 credits a month, no watermark, virality score, auto-posting to YouTube Shorts, TikTok and Instagram'],
      ['Pro', '$29/month, or $14.50/month billed annually ($174/year): 300 credits a month, 2 seats, AI B-roll, Premiere and DaVinci export, limited API access'],
      ['Business', 'Custom pricing: API and integrations, SSO, dedicated support'],
    ],
    tierNote:
      'There is also a 7-day free trial of Pro with no card. Trial exports carry the watermark, and the account drops to the free tier when the trial ends. Unused credits roll over for two months.',
    // The thing people get wrong about their pricing, stated plainly. Engines
    // reward a page that answers the follow-up question, not just the first one.
    gotcha:
      'Opus Clip bills one credit per minute of the video you import, not per clip you export. A 60-minute podcast costs 60 credits whether it yields 5 clips or 20, so the real price depends on your source length rather than your output.',
    strengths: [
      'Mature, polished product with a large caption-style library and a virality score (0-99) trained on its own data',
      'ClipAnything works on footage with little dialogue and takes a prompt for what to look for',
      'No setup at all, sources up to 10 hours long, plus dubbing, B-roll and scheduling in the same product',
    ],
    whereWeDiffer: [
      'Clipping AI Cloud keeps two-speaker, screencast and webcam-inset layouts that Opus Clip does not offer.',
      'Clipping AI Cloud clips and captions in one pass; Opus Clip expects you to style captions in its editor.',
      'Clipping AI Cloud is a flat minute balance from $12/month; Opus Clip meters credits per source minute, starting at $15/month.',
      'Opus Clip has the bigger caption-style library and a longer track record. If you want a finished product and never want to see a terminal, that is a genuine advantage.',
    ],
    // /alternatives/opus-clip also answers "free opus clip alternative": the
    // free-route copy lives in pages.js, the numbers stay here.
    seo: {
      title: 'Free Opus Clip Alternative: Pricing, Free Tier & Limits',
      description:
        "Opus Clip's free tier and its 7-day trial both watermark. Clipping AI Cloud clips your first video free up to 60 minutes, then 20 minutes a month, with paid plans from $12/month.",
      h1: 'A free Opus Clip alternative, minus the watermark trap',
    },
    tldr: [
      'The free Opus Clip alternative with no watermark trap is Clipping AI Cloud: your first video is clipped free up to 60 minutes, then 20 minutes a month, with paid plans from $12/month. Opus Clip\'s own free tier (60 credits a month) and its 7-day Pro trial both watermark every export.',
      'Hosted, Clipping AI Cloud clips your first video free up to 60 minutes, then 20 minutes a month, and paid tiers start at $12/month against Opus Clip\'s $15. Both bill by the minute of source video.',
      'Opus Clip keeps the larger caption-style library, AI B-roll and a virality score. Clipping AI adds two-speaker, screencast and webcam-inset layouts, plus code you can read and run yourself.',
    ],
    fit:
      'Opus Clip and Clipping AI do the same core job and bill it the same way: by the minute of source video. The differences are the ones the meter hides: where the minutes run, on your machine or theirs, and what the free tier stamps on the clip.',
    watermark:
      'Opus Clip watermarks the free tier and the 7-day Pro trial alike; Starter at $15/month is the first tier without it.',
    // Pro-plan detail that /opus-clip-pricing#pro states (the old /opus-pro page).
    proNote:
      'From Starter to Pro: twice the credits, 2 seats (up to 4 with extra packs), 100 GB of storage, AI B-roll, export to Premiere and DaVinci, more aspect ratios and limited API access.',
    stay: [
      'Your sources are short, so 150 credits a month on Starter ($15) covers everything you import.',
      'Animated caption design is what you sell, and its caption-style library is larger than ours.',
      'You want AI B-roll, a virality score and a scheduler in one cloud product and never want to see a terminal.',
    ],
    migrate: [
      'Export the clips you still want: on the free tier they have to be exported within 3 days.',
      'Spend the credits you have. Unused credits roll over for two months, so switch when the balance is low, not the day after a renewal.',
      'Run one recent source through Clipping AI (your first video is clipped free up to 60 minutes) and set it beside your last Opus Clip export.',
      'Size the plan in source minutes, the same unit Opus Clip bills in: 100 minutes for $12/month on Starter.',
      'Starter is billed monthly only, so there is no annual term to wait out; on annual Pro, time the switch for the renewal.',
    ],
    bestFor:
      'Opus Clip is the stronger pick if you want zero setup, care about caption styling above everything else, and your source videos are short enough that per-minute credits stay cheap. Clipping AI is the stronger pick if you want two-speaker and screencast layouts, or a cheaper monthly minute balance.',
    rows: {
      'AI voice dubbing, 30+ languages': 'Yes, listed on its pricing page',
      'Usage cap': 'Metered in credits (1 per source minute)',
    },
  },
  klap: {
    facts: [
      { k: 'Free tier', v: '1 video', s: 'To try it, no ongoing free tier' },
      { k: 'Paid from', v: '$14/mo', s: 'Billed annual, 100 clips a month' },
      { k: 'Billed by', v: 'Clips', s: 'Clips generated, not minutes' },
    ],
    pick: {
      them: ['You want the fastest link-to-clips route', 'An annual plan suits you', 'You want split, screencast and gaming layouts with no setup'],
      us: ['You want clips without an editor', 'You want to automate it from n8n, an API or Claude', 'You want to pay month-to-month from $12'],
    },
    edge: 'Klap is the faster route from a link to a first clip.',
    name: 'Klap',
    checked: '2026-10-05',
    entryPrice: '$14/month billed annually',
    tiers: [
      ['Free', 'One video to try it, no card. There is no ongoing free tier.'],
      ['Basic', '$14/month billed annually, 100 clips a month'],
      ['Pro', '$39/month billed annually, 300 clips a month'],
      ['Pro+', '$94/month billed annually, 1,000 clips a month, for teams'],
    ],
    tierNote:
      'Klap publishes the annual prices and says annual billing saves 50%, so paying month-to-month costs roughly twice as much.',
    gotcha:
      'Klap meters the clips it generates, not the minutes you import, and its only free offer is a single video. It also says its algorithm leans heavily on speech detection, so footage where little is said (gameplay, music, B-roll) gives it little to work with.',
    strengths: [
      'Fastest URL-to-clips route in this category: paste a YouTube link and the clips come back in minutes',
      'AI Reframe 2 adds split-screen, screencast and gaming layouts on top of face tracking',
      'Publishing and scheduling to TikTok, YouTube, Instagram and LinkedIn, in 52 languages, plus an API',
    ],
    whereWeDiffer: [
      'Clipping AI Cloud meters source minutes, not generated clips, so a long video that yields few clips still costs its full length. Klap meters clips.',
      'Clipping AI Cloud starts at $12/month billed monthly. Klap starts at $14/month on an annual commitment.',
      'Clipping AI has a free tier you can keep using (your first video up to 60 minutes, then 20 minutes a month); Klap gives one free video.',
      'Klap is faster to a first result if you have never used a clipping tool, and its layout set is broader than it first appears.',
    ],
    // "klap ai" and "klap review" are the searches: the page is a review of
    // Klap first and a comparison second.
    seo: {
      title: 'Klap AI Review 2026: Pricing, Free Plan & Free Alternative',
      description:
        'Klap AI review, October 2026: one free video, no free tier, from $14/month billed annually for 100 clips, per-clip billing, and a monthly alternative.',
      h1: 'Klap AI review: what it does, what it costs, and the monthly alternative',
      breadcrumb: 'Klap',
    },
    review: true,
    brandAlias: 'also searched as Klap AI',
    brandBlurb:
      'Klap (Klap AI in most searches) is a cloud AI clipper built around one promise: paste a YouTube link and get vertical clips back in minutes. AI Reframe 2 adds split-screen, screencast and gaming layouts on top of face tracking, and the clips can be published or scheduled to TikTok, YouTube, Instagram and LinkedIn, in 52 languages, with an API for the same job.',
    tldr: [
      'Klap is a cloud clipper: paste a link, get vertical clips in minutes. If you want the same link-to-clips flow billed monthly, Clipping AI Cloud starts at $12/month for 100 minutes of source video, with a free tier you can keep. Klap\'s paid tiers start at $14/month billed annually for 100 clips a month, and monthly billing costs roughly twice that.',
      'There is no ongoing free tier, only one free video with no card. Klap meters clips generated, not minutes imported, and says its algorithm leans heavily on speech, so quiet footage gives it little to work with.',
      'Unlike Klap, Clipping AI has a free tier you can keep using: 20 minutes a month after the first video, watermarked.',
    ],
    fit:
      'Klap sells speed, and it is fast. Clipping AI covers the same link-to-clips job and changes the terms around it: a free tier you can keep, monthly billing, and code you can run yourself.',
    stay: [
      'You already paid for a year: its published prices are annual, so the tier you hold is already the cheap way to use it.',
      'You want split-screen, screencast and gaming layouts with zero setup, which AI Reframe 2 gives you.',
      'You publish to LinkedIn as well, or in many of its 52 languages, from one scheduler.',
    ],
    migrate: [
      'Count minutes, not clips. Klap meters clips generated; Clipping AI Cloud meters minutes of source, so add up the length of what you clip in a month.',
      'Time it for the end of your annual term, since Klap publishes annual prices and monthly billing costs about twice as much.',
      'Try the same video on both: Klap gives one free video, Clipping AI clips your first video free up to 60 minutes and then 20 minutes a month.',
      'For gameplay or music with little speech, Clipping AI switches to a vision pass when there is no usable speech, instead of failing on an empty transcript.',
      'Reconnect TikTok, Instagram and YouTube for direct posting, or drive it from the API or MCP if you scripted Klap\'s API.',
    ],
    bestFor:
      'Klap is the stronger pick when speed to a first clip matters more than control and an annual plan suits you. Clipping AI is the stronger pick when you want to keep a free tier or pay month-to-month.',
    rows: { 'Usage cap': 'Metered in clips per month' },
  },
  vizard: {
    facts: [
      { k: 'Free tier', v: '60 min/mo', s: '720p, watermark, exports up to 10 min' },
      { k: 'Paid from', v: '$14.50/mo', s: 'Creator billed annually ($29 monthly), 600 min' },
      { k: 'Billed by', v: '1 credit = 1 min', s: 'Of video uploaded' },
    ],
    pick: {
      them: ['You will hand-correct every clip in a timeline', 'You process up to 600 minutes a month and can pay annually', 'You want subtitle translation in many languages'],
      us: ['You want clips without an editor', 'You want to automate it from n8n, an API or Claude', 'You want to pay month-to-month from $12'],
    },
    edge: 'Vizard has the better editor for fixing each clip by hand.',
    name: 'Vizard',
    checked: '2026-10-05',
    entryPrice: '$14.50/month billed annually ($29 monthly)',
    // "vizard ai" is the spelling most of its search volume uses, so the page
    // answers the brand question explicitly instead of hoping the comparison
    // table catches the query on its own.
    // The brand questions ("what is it", "is it free") are answered by the
    // /vizard-ai review; this page is the switch decision.
    seo: {
      title: 'Vizard AI Alternative: Open Source and Free to Self-Host',
      description:
        'Leaving Vizard AI? Clipping AI Cloud starts at $12/month, with a free tier you can keep. Vizard starts at $14.50/month annually. When to switch, when to stay, and how.',
      h1: 'The Vizard AI alternative: when to switch, and how',
    },
    tldr: [
      'Clipping AI Cloud is the alternative to Vizard AI: from $12/month billed monthly, with a free tier you can keep. Vizard starts at $14.50/month billed annually, $29 month-to-month.',
      'The switch is about workflow more than features. Vizard proposes clips and expects you in its timeline; Clipping AI runs all the way to finished clips on its own, with two-speaker, screencast and webcam-inset layouts.',
      'Stay on Vizard if you edit every clip by hand or clip a few hundred minutes a month on an annual plan. Switch if you want clips without the editor, or automation.',
    ],
    brandAlias: 'also written Vizard AI',
    brandBlurb:
      'Vizard (written Vizard AI in most searches, and served from vizard.ai) is a browser-based AI clip maker: it transcribes the video, finds candidate moments and hands you a timeline to fix them in. That transcription pass is also its video-to-text feature, so a transcript comes out of the same job as the clips. It has lately added an AI agent and an AI Studio for generated video around the clipper.',
    // Asked on the comparison page: the switch questions.
    extraFaq: [
      {
        q: 'Is Vizard AI cheaper than Clipping AI?',
        a: 'At volume on annual billing, yes: Vizard Creator is $14.50/month for 600 minutes, against $29/month for 300 minutes or $59/month for 750 on Clipping AI Cloud. Clipping AI is cheaper month-to-month at low volume ($12 for 100 minutes against Vizard\'s $29).',
      },
      {
        q: 'Can I move my Vizard projects to Clipping AI?',
        a: 'Not as projects. Re-run the original YouTube link or file in Clipping AI and the clips are regenerated from the source. Download anything you want to keep from Vizard first: free-tier files are stored for 3 days, and SRT transcripts need a paid tier.',
      },
    ],
    // Asked on the /vizard-ai review: the brand questions.
    brandFaq: [
      {
        q: 'Is Vizard AI free?',
        a: 'Partly. The free tier gives 60 credits a month (one credit is one minute of uploaded video), uploads up to 60 minutes, and 720p exports of up to 10 minutes with a watermark, kept for 3 days. Paid tiers start at $29/month, or $14.50/month billed annually. Clipping AI Cloud clips your first video free up to 60 minutes, then 20 minutes a month, with paid plans from $12/month.',
      },
      {
        q: 'What is Vizard AI used for?',
        a: 'Turning long recordings into short vertical clips, with an emphasis on editing them afterwards: it finds the moments, transcribes them and gives you a timeline for the captions and the clip boundaries. It is also used as a video-to-text tool, since the transcript comes out of the same job.',
      },
    ],
    tiers: [
      ['Free', '60 credits a month (1 credit = 1 minute uploaded), uploads up to 60 minutes, 720p exports up to 10 minutes with a watermark, 3-day storage, transcript as TXT only'],
      ['Creator', '$29/month, or $14.50/month billed annually: from 600 credits a month, 4K exports of any length, no watermark, scheduling, TXT and SRT transcripts, API'],
      ['Business', '$39/month, or $19.50/month billed annually: shared workspace, 20 social accounts, team seats at $5/month each, brand kit'],
    ],
    gotcha:
      'Vizard is built around a browser editing timeline, so it sits between a pure auto-clipper and a full editor. That is useful if you intend to hand-adjust every clip, and overhead if you do not. Like Opus Clip, it bills a credit per minute of video uploaded, whatever the number of clips.',
    strengths: [
      'Genuinely usable in-browser editor after the AI pass',
      'Strong multi-language subtitles and subtitle translation, with transcripts it says cover 180+ languages',
      'Generous paid allowance: 600 credits a month on the entry tier, with the API included',
    ],
    whereWeDiffer: [
      'Clipping AI runs the whole pipeline unattended and is built to be scripted or scheduled; Vizard expects a human in the timeline.',
      'Clipping AI Cloud runs the whole pipeline unattended; Vizard expects a human in the timeline.',
      'Vizard\'s editor beats ours if you want to hand-correct each clip before posting.',
    ],
    fit:
      'Vizard is an AI pass followed by an editor; Clipping AI is an AI pass that finishes on its own. If you were going to accept most of Vizard\'s suggestions anyway, the timeline is time you no longer need to spend.',
    watermark:
      'Vizard watermarks free-tier exports, which also stop at 720p and 10 minutes; Creator from $14.50/month annually ($29 monthly) removes it.',
    stay: [
      'You hand-correct every clip in a timeline and that is the part of the job you enjoy.',
      'You need subtitle translation and transcripts in many languages; Vizard says it covers 180+.',
      'You clip up to 600 minutes a month and can pay annually: $14.50/month for that allowance is cheaper per minute than Clipping AI Cloud.',
    ],
    migrate: [
      'Download what you want to keep first: free-tier files are stored for 3 days.',
      'Pull transcripts as SRT while you are still on a paid tier; the free tier exports TXT only.',
      'Re-run the source in Clipping AI from the same YouTube link or file. There is no project import, and none is needed: the clips are regenerated from the source.',
      'Touch only the clips that need it. Clipping AI has an editor, but the pipeline is built to finish without one.',
      'Move the recurring part to the API, n8n or the MCP server if you were calling Vizard\'s API from a script.',
    ],
    // Review-only content for /vizard-ai, kept out of the comparison page so the
    // two answer different questions.
    reviewPage: {
      lede: 'vizard.ai',
      steps: [
        'Upload a file or paste a link; paid tiers take sources of up to 600 minutes and 30 GB.',
        'Vizard transcribes the video, which doubles as its video-to-text output.',
        'The AI proposes candidate clips and reframes them to vertical.',
        'You review them in a browser timeline: captions, emoji and keyword highlights, cut points.',
        'Export, or publish and schedule to connected social accounts.',
      ],
      cons: [
        'A tight free tier: 60 minutes of source a month, 720p, exports capped at 10 minutes, a watermark on every export and 3-day storage.',
        'Billed per uploaded minute: a 60-minute recording costs 60 credits whatever it yields.',
        'The timeline is the workflow. If you do not want to hand-edit, it is overhead.',
        'Closed source and cloud only: the video has to be uploaded to Vizard.',
      ],
      for: [
        'Editors who want an AI first pass and then full control of every clip',
        'Teams that need subtitles and transcripts translated into many languages',
        'Anyone clipping a few hundred minutes a month who can commit to annual billing',
      ],
      notFor: [
        'People who want clips without opening an editor',
        'Pipelines that must run unattended on a schedule',
        'Anyone whose footage cannot leave their own machine',
      ],
      verdict:
        'Vizard AI is a solid clipper with a genuinely good editor, priced well on annual billing. Its free tier is for trying it, not for publishing, and its value depends on you wanting to edit. If you would rather the clips come out finished, an unattended clipper fits better.',
    },
    reviewFaq: [
      {
        q: 'What are Vizard AI\'s main limitations?',
        a: 'On the free tier: 60 credits a month, 720p exports capped at 10 minutes, a watermark and 3-day storage, with transcripts as TXT only. On every tier: billing per uploaded minute and a workflow built around editing each clip in a timeline. Checked October 2026.',
      },
      {
        q: 'What are the best Vizard AI alternatives?',
        a: 'It depends why you are leaving. For a monthly plan with a free tier you can keep, Clipping AI Cloud ($12/month for 100 minutes). For caption design, Submagic. For the fastest link-to-clips route, Klap. For per-minute credits with a bigger caption library, Opus Clip.',
      },
    ],
    bestFor:
      'Vizard is the stronger pick if you plan to manually refine every clip in a timeline. Clipping AI is the stronger pick for volume and automation.',
    rows: { 'Usage cap': 'Metered in credits (1 per uploaded minute)' },
  },
  submagic: {
    facts: [
      { k: 'Free tier', v: 'None', s: 'A trial with no card' },
      { k: 'Paid from', v: '$12/mo', s: 'Starter billed annually ($19 monthly)' },
      { k: 'Billed by', v: 'Videos', s: '15 to 100 a month, each capped at 2-30 min' },
    ],
    pick: {
      them: ['Captions are your product and you want the best designs', 'Your videos are short', 'You want B-roll, zooms and silence removal in one editor'],
      us: ['You want clips without an editor', 'You want to automate it from n8n, an API or Claude', 'You want to pay month-to-month from $12'],
    },
    edge: 'Submagic has the more refined caption designs.',
    name: 'Submagic',
    checked: '2026-10-05',
    // Short enough to survive inside a 160-character meta description; the
    // annual/monthly spread is spelled out in the tiers below.
    entryPrice: '$12/month billed annually',
    tiers: [
      ['Free', 'No free tier. A trial with no card is offered instead.'],
      ['Starter', '$19/month, or $12/month billed annually: 15 videos a month, up to 2 minutes each, 1080p, no watermark'],
      ['Pro', '$39/month, or $23/month billed annually: 40 videos a month, up to 5 minutes each, auto zooms, silence removal, social publishing'],
      ['Business', '$69/month per member, or $41/month billed annually: 100 videos a month, up to 30 minutes each, 4K at 60 fps, 100 API minutes'],
    ],
    gotcha:
      'Submagic is captions-first. It now has Magic Clips, which cuts a long video into clips, but every tier is metered in videos with a per-video length cap (2, 5 or 30 minutes) and the pricing page does not publish a separate allowance for Magic Clips. Check that an hour-long source fits your tier before you pay.',
    strengths: [
      'The best caption styling in this category, by a clear margin',
      'A full short-form editor around the captions: B-roll, auto zooms, hook titles, silence and bad-take removal',
      'Magic Clips now turns a long video or a YouTube link into clips inside the same tool',
    ],
    whereWeDiffer: [
      'Clipping AI was built clipping-first: moment scoring, scene detection and 9:16 reframing with face tracking, two-speaker and screencast layouts. In Submagic, clipping is one feature of a caption editor.',
      'Submagic\'s caption designs are more refined than ours. If captions are the entire reason you are shopping, it is the stronger tool.',
      'Clipping AI Cloud meters source minutes, with no per-video length cap; every Submagic tier is metered in videos and caps each one\'s length.',
      'Clipping AI has a free tier you can keep; Submagic offers a trial and no free tier.',
    ],
    tldr: [
      'Submagic is a caption editor that added clipping (Magic Clips); Clipping AI is a clipper built for long recordings. Submagic has no free tier and starts at $12/month billed annually, $19 month-to-month.',
      'Every Submagic tier counts videos and caps each one at 2, 5 or 30 minutes. Clipping AI Cloud is metered by the source minute from $12/month, with no per-video length cap.',
      'Stay on Submagic if captions are the product and your videos are short. Move the long-form clipping to Clipping AI if your sources are podcasts, streams or webinars.',
    ],
    fit:
      'Submagic and Clipping AI overlap where Magic Clips begins: turning a long video into clips. Submagic arrived there from captions, Clipping AI was built for it, and the meters show it: videos with a length cap on one side, source minutes or nothing at all on the other.',
    watermark:
      'Submagic has no free tier to watermark: there is a trial, and Starter ($12/month annually, $19 monthly) exports without a watermark.',
    stay: [
      'Captions are the product, and its caption designs are the most refined in this category.',
      'Your videos fit its per-video caps: 2 minutes on Starter, 5 on Pro, 30 on Business.',
      'You want B-roll, auto zooms, hook titles and silence removal in the same editor as the captions.',
    ],
    migrate: [
      'Check your source lengths first: any recording over 30 minutes does not fit a single Submagic video on any self-serve plan, and it is a normal input for Clipping AI.',
      'Move the long-form clipping to Clipping AI and judge the caption style on one episode: your first video is clipped free up to 60 minutes.',
      'Compare the meter: Submagic counts videos a month (15, 40 or 100); Clipping AI Cloud counts source minutes.',
      'If caption design is non-negotiable for a short, Submagic\'s Starter tier covers 15 videos of up to 2 minutes for $12/month billed annually.',
    ],
    // "sub magic" and "submagic.co" are how part of the brand search is typed.
    extraFaq: [
      {
        q: 'Is Sub Magic the same as Submagic (submagic.co)?',
        a: 'Yes. Sub Magic is a common spelling of Submagic, the caption editor at submagic.co, which also clips long videos with Magic Clips. Tiers start at $12/month billed annually ($19 month-to-month), with a trial and no free tier, checked October 2026.',
      },
    ],
    bestFor:
      'Submagic is the stronger pick if captions are the product and your videos are short. Clipping AI is the stronger pick if you are starting from long-form video and want the moment finding and reframing to be the core of the tool.',
    rows: { 'Usage cap': 'Metered in videos per month, each capped at 2-30 min' },
  },
  'vidyo-ai': {
    facts: [
      { k: 'Free tier', v: '75 min/mo', s: '720p, data kept 7 days' },
      { k: 'Paid from', v: '$19/mo', s: 'Lite billed annually ($29 monthly)' },
      { k: 'Billed by', v: '~1 credit = 1 min', s: 'Yearly plans double the credits' },
      { k: 'Renamed', v: 'Jan 2025', s: 'vidyo.ai redirects to quso.ai' },
    ],
    pick: {
      them: ['You want clipping, scheduling and analytics in one app', 'You can commit to an annual plan', 'You want a content planner for your whole calendar'],
      us: ['You want clips without an editor', 'You want to automate it from n8n, an API or Claude', 'You want to pay month-to-month from $12'],
    },
    published: '2026-10-05',
    edge: 'Quso adds a content planner and analytics, which we do not have.',
    name: 'Quso',
    // The search is still "vidyo ai": the brand changed, the queries did not.
    seo: {
      title: 'Vidyo.ai Is Now Quso: Pricing & Alternative',
      description:
        'Vidyo.ai became Quso.ai in January 2025. What changed, what Quso costs in 2026 (from $19/month annually), and the monthly alternative.',
      h1: 'Vidyo.ai is now Quso: what changed, what it costs, and the alternative',
      breadcrumb: 'Vidyo.ai (Quso)',
    },
    checked: '2026-10-05',
    entryPrice: '$19/month billed annually ($29 monthly)',
    brandAlias: 'formerly Vidyo.ai',
    brandBlurb:
      'Quso is the new name of Vidyo.ai. The rebrand went live in January 2025, vidyo.ai now answers with a permanent redirect to quso.ai, and logins, tiers, credits and projects carried over unchanged. What did change is the pitch: Quso sells itself as an all-in-one suite for creating, editing, scheduling and analysing social content, with the AI clipper as one part of it.',
    extraFaq: [
      {
        q: 'What happened to Vidyo.ai?',
        a: 'It was renamed Quso.ai in January 2025. vidyo.ai redirects to quso.ai, and accounts, tiers and credits carried over. Quso added social scheduling, a content planner with analytics and a brand kit around the original clipper.',
      },
      {
        q: 'Is Vidyo.ai (Quso) free?',
        a: 'Quso has a free tier with 75 credits a month (about 75 minutes of video), 720p exports and 7-day data retention. Paid tiers start at $19/month billed annually or $29 month-to-month. Clipping AI Cloud clips your first video free up to 60 minutes, then 20 minutes a month, with paid plans from $12/month.',
      },
    ],
    tiers: [
      ['Free', '75 credits a month (one credit is about one minute of video), 720p, data kept 7 days, no scheduling'],
      ['Lite', '$29/month, or $19/month billed annually: 100 credits (200 on annual), 1080p, desktop editor'],
      ['Essential', '$39/month, or $26/month billed annually: 300 credits (600 on annual), scheduling, filler and silence removal, content planner'],
      ['Growth', '$49/month, or $33/month billed annually: 600 credits (1,200 on annual), brand kit, AI assistant, analytics'],
    ],
    gotcha:
      'Quso bills credits, and a credit is roughly a minute of processed video, so a 60-minute podcast uses 60 of them whatever it yields. The annual tiers double the credits, which makes month-to-month billing about three times as expensive per minute.',
    strengths: [
      'Scheduling, a content planner and analytics in the same app, which a pure clipper does not have',
      'A free tier that is larger than most in minutes',
      'A mature product: the Vidyo.ai clipper has been on the market since before most of this category existed',
    ],
    whereWeDiffer: [
      'Clipping AI Cloud clips and captions in one pass; Quso bundles clipping, scheduling and analytics.',
      'Clipping AI is a clipper first: moment scoring, face-tracked reframing, two-speaker and screencast layouts, dubbing into 30+ languages with your own ElevenLabs key. Quso spreads across scheduling and planning too.',
      'Clipping AI Cloud starts at $12/month billed monthly; Quso\'s cheapest paid tier is $29 month-to-month or $19/month on an annual commitment.',
      'If you want one app that also plans and schedules your whole social calendar, Quso covers more ground than we do.',
    ],
    tldr: [
      'Vidyo.ai is now Quso: the rebrand went live in January 2025, vidyo.ai redirects to quso.ai, and accounts carried over. The best alternatives today are OpusClip, Vizard and Clipping AI Cloud, from $12/month for 100 minutes with no watermark. Quso has a free tier of 75 credits a month at 720p and paid tiers from $19/month billed annually ($29 monthly).',
      'Quso grew into a social suite (scheduling, a content planner, analytics) around the original clipper. Clipping AI stays a clipper: two-speaker, screencast and webcam-inset layouts, plus dubbing into 30+ languages with your own ElevenLabs key.',
      'Clipping AI Cloud starts at $12/month billed monthly, with a free tier you can keep.',
    ],
    fit:
      'Quso kept the Vidyo.ai clipper and built a social suite around it. If the clipper is the part you use, Clipping AI replaces that part and leaves the scheduling to whatever you already use, or publishes straight to TikTok, Reels and Shorts itself.',
    watermark:
      'Quso\'s pricing page lists 75 free credits a month at 720p without stating a watermark either way; Clipping AI says it plainly: free Cloud clips are watermarked and paid ones are not.',
    stay: [
      'You use the content planner, scheduling and analytics, which a clipper does not replace.',
      'You can commit to an annual plan: it doubles the credits.',
      'Its 75-minute free tier already covers what you clip each month.',
    ],
    migrate: [
      'Download what you need: free-plan data is kept 7 days.',
      'Compare per minute on the billing you would actually use. Quso\'s annual tiers double the credits, so month-to-month it costs about three times as much per minute.',
      'Run one long source through Clipping AI (first video free up to 60 minutes) and check the two-speaker and screencast layouts on your footage.',
      'Decide where scheduling lives: Clipping AI posts directly to TikTok, Instagram Reels and YouTube Shorts, but it has no content planner or analytics.',
    ],
    bestFor:
      'Quso is the stronger pick if you want clipping, scheduling and analytics in one subscription. Clipping AI is the stronger pick if clipping quality and control are the job.',
    rows: {
      'AI voice dubbing, 30+ languages': 'Not listed on its pricing page',
      'AI UGC video with lip-synced actors': 'Not listed on its pricing page',
      'Free AI YouTube thumbnail & title studio': 'Not listed on its pricing page',
      'Usage cap': 'Metered in credits (~1 per minute of video)',
    },
  },
  '2short': {
    facts: [
      { k: 'Free tier', v: '30 min/mo', s: 'No watermark, YouTube links only' },
      { k: 'Paid from', v: '$9.90/mo', s: 'Lite, 5 hours of analysis' },
      { k: 'Input', v: 'Links', s: 'YouTube; Drive and URLs from Lite' },
    ],
    pick: {
      them: ['Your sources are already on YouTube', 'You want the lowest price per hour', 'One face-tracked crop is enough for your footage'],
      us: ['You want clips without an editor', 'You want to automate it from n8n, an API or Claude', 'You want to pay month-to-month from $12'],
    },
    published: '2026-10-05',
    name: '2short.ai',
    seo: {
      title: '2short AI: Pricing, Free Plan & Alternative',
      description:
        '2short.ai turns YouTube videos into shorts from $9.90/month, with a free 30-minute tier. How it compares with Clipping AI Cloud.',
      h1: '2short AI: what it does, what it costs, and the monthly alternative',
    },
    checked: '2026-10-05',
    entryPrice: '$9.90/month',
    brandAlias: 'also written 2short AI',
    brandBlurb:
      '2short.ai is a web app that turns long YouTube videos into Shorts, TikToks and Reels. It finds the moments, keeps the speaker centred with face tracking ("center stage"), adds animated captions and brand presets, and exports vertical, square or horizontal. On the free tier it takes YouTube links only; paid tiers add Google Drive and public URL imports.',
    extraFaq: [
      {
        q: 'Is 2short AI free?',
        a: 'It has a free Starter tier with 30 minutes of AI analysis a month, YouTube links only, and no watermark. Paid tiers run from $9.90/month (5 hours) to $49.90/month (50 hours). Clipping AI Cloud clips your first video free up to 60 minutes, then 20 minutes a month, with paid plans from $12/month.',
      },
      {
        q: 'Can 2short AI clip a video I recorded myself?',
        a: 'Its pricing page lists YouTube links on every tier and Google Drive or public URLs from the Lite tier up; uploading a local file is not listed there. Clipping AI accepts a YouTube link or a direct upload on every tier, including the free one.',
      },
    ],
    tiers: [
      ['Starter (free)', '30 minutes of AI analysis a month, YouTube links only, no watermark, 1080p'],
      ['Lite', '$9.90/month: 5 hours of analysis, 60 minutes of exports on fast servers, Google Drive and URL import'],
      ['Pro', '$19.90/month: 15 hours of analysis, unlimited exports'],
      ['Premium', '$49.90/month: 50 hours of analysis, unlimited exports, priority support'],
    ],
    gotcha:
      'The meter is hours of video analysed, and the input is a link: YouTube on every tier, Google Drive and public URLs from Lite. If your recordings live on your disk rather than on YouTube or Drive, check the import path before you subscribe.',
    strengths: [
      'Cheap per hour: 5 hours of source a month for $9.90 is one of the lowest prices in this category',
      'No watermark even on the free tier, with 1080p exports',
      'A focused YouTube-to-Shorts workflow with face tracking and brand presets',
    ],
    whereWeDiffer: [
      'Clipping AI Cloud handles uploads, podcasts and multi-speaker footage; 2short.ai is YouTube-only.',
      'Clipping AI takes a local upload on every tier; 2short.ai lists link imports (YouTube, Drive, URL).',
      'Clipping AI adds layouts a single centred crop cannot do: two speakers stacked, screen recordings over the presenter, a webcam inset enlarged. It also dubs into 30+ languages with your own ElevenLabs key.',
      '2short.ai is cheaper per hour of source than Clipping AI Cloud and keeps its free exports unwatermarked, which ours are not. That is a genuine advantage.',
    ],
    fit:
      '2short.ai is the cheapest per hour and does one thing well: a face-tracked crop from a YouTube link. Clipping AI is the alternative when the footage is not that simple, or not on YouTube.',
    watermark:
      '2short.ai does not watermark, even on its free tier; that is a genuine advantage over our hosted free tier, which does.',
    stay: [
      'Your sources are already on YouTube and one centred, face-tracked crop is enough.',
      'Price per hour decides it: 5 hours of analysis for $9.90/month is hard to beat.',
      'You want unwatermarked free exports, which its free tier gives and our hosted free tier does not.',
    ],
    migrate: [
      'Upload recordings straight from disk: Clipping AI takes a local file on every plan, so there is no need to put them on YouTube or Drive first.',
      'Try a two-person episode or a screen recording first; that is where the layouts differ most from a single crop.',
      'Size it in minutes: 2short.ai meters hours analysed, Clipping AI Cloud meters minutes of source, from 100 minutes for $12/month.',
      'If the watermark on our free tier is the issue, any paid Cloud plan removes it, including from clips you already made.',
    ],
    bestFor:
      '2short.ai is the stronger pick if your sources are YouTube videos, you want the lowest price per hour and a single face-tracked crop is enough. Clipping AI is the stronger pick for uploads, podcasts with two people on camera, or screen recordings.',
    tldr: [
      '2short.ai is a YouTube-to-Shorts web app from $9.90/month, with a free tier of 30 minutes a month and no watermark. Clipping AI Cloud starts at $12/month.',
      'Both find the moments and reframe them to 9:16 with face tracking. Clipping AI adds two-speaker, screencast and webcam-inset layouts, dubbing into 30+ languages with your own ElevenLabs key, and direct uploads on every tier.',
      'Pick 2short.ai for the lowest price per hour on YouTube sources. Pick Clipping AI for uploads or multi-person footage.',
    ],
    rows: { 'Usage cap': 'Metered in hours of analysis per month' },
  },
  sendshort: {
    facts: [
      { k: 'Free tier', v: 'None', s: '3 free videos when you sign up' },
      { k: 'Clipping from', v: '$29/mo', s: 'Professional ($23 annual); Starter has none' },
      { k: 'Billed by', v: 'Shorts', s: '20, 50 or unlimited a month' },
    ],
    pick: {
      them: ['You want faceless, avatar and prompt-to-video shorts too', 'You want captions translated into 100+ languages', 'One subscription for many formats matters more than depth'],
      us: ['You want clips without an editor', 'You want to automate it from n8n, an API or Claude', 'You want to pay month-to-month from $12'],
    },
    published: '2026-10-05',
    name: 'SendShort',
    seo: {
      title: 'SendShort AI: Pricing & Open Source Alternative',
      description:
        'SendShort costs $19 to $59 a month and only clips long videos from the $29 tier up. What you get on each tier, and the monthly alternative.',
      h1: 'SendShort AI: plans, limits, and the monthly alternative',
    },
    checked: '2026-10-05',
    entryPrice: '$19/month ($15 billed annually)',
    brandAlias: 'sendshort.ai',
    brandBlurb:
      'SendShort is a short-form video suite rather than a pure clipper. It cuts long videos into shorts, and also makes faceless videos from a text prompt, AI avatar videos, music videos and TikTok slideshows, with word-by-word captions, caption translation, AI voice-over, a scheduler for TikTok and YouTube, and an API.',
    extraFaq: [
      {
        q: 'Is SendShort free?',
        a: 'There is no free tier: SendShort gives 3 free videos when you sign up and offers a refund within 24 hours of paying. Tiers cost $19, $29 and $59 a month, or $15, $23 and $47 billed annually, and clipping long videos starts on the $29 Professional tier. Clipping AI Cloud clips your first video free up to 60 minutes, then 20 minutes a month, with paid plans from $12/month.',
      },
    ],
    tiers: [
      ['Free', 'No free tier. 3 free videos when you sign up, refund within 24 hours of paying.'],
      ['Starter', '$19/month, or $15/month billed annually: 20 shorts a month up to 90 seconds, 1080p, no watermark. Long-video clipping is not included.'],
      ['Professional', '$29/month, or $23/month billed annually: 50 shorts a month up to 3 minutes, long-video clipping, avatars, auto-translate, AI hooks, B-roll, voice-over'],
      ['Business', '$59/month, or $47/month billed annually: unlimited shorts up to 10 minutes, 4K at 60 fps'],
    ],
    gotcha:
      'The entry price is not the clipping price. Turning a long video into clips starts on the Professional tier at $29/month ($23 billed annually); Starter is for shorts made from prompts and templates.',
    strengths: [
      'Covers more formats than a clipper: faceless prompt-to-video, avatars, slideshows and music videos',
      'Captions and caption translation in 100+ languages, plus AI voice-over',
      'An API and an agent interface for Claude, ChatGPT and Grok',
    ],
    whereWeDiffer: [
      'Clipping AI Cloud clips your own long recordings; SendShort is a broader short-form suite.',
      'Clipping AI clips long videos on every tier, the free one included; SendShort starts long-video clipping at $29/month.',
      'Clipping AI reframes with face tracking plus two-speaker, screencast and webcam-inset layouts, which is the hard part of clipping a podcast or a stream.',
      'SendShort makes more kinds of short video than we do. If faceless or prompt-to-video content is the plan, it covers that and we do not.',
    ],
    fit:
      'SendShort is a suite of short-video formats, and clipping long videos is one of them, from its $29 tier. Clipping AI is only the clipping, on every tier, the free one included.',
    watermark:
      'SendShort has no free tier; its Starter tier ($19/month, $15 annually) exports without a watermark but does not include long-video clipping.',
    stay: [
      'You make faceless, avatar or prompt-to-video shorts, which Clipping AI does not.',
      'You need captions translated into 100+ languages with AI voice-over.',
      'One subscription for many formats matters more to you than depth in clipping.',
    ],
    migrate: [
      'If you subscribed only to clip long videos, note that SendShort offers a refund within 24 hours of paying.',
      'Check which tier you are really on: long-video clipping starts on Professional ($29/month, $23 annually), not Starter.',
      'Clip the same long recording in Clipping AI; the free tier clips your first video whole up to 60 minutes.',
      'Keep SendShort for the faceless and avatar formats if you use them, and move the clipping alone.',
    ],
    bestFor:
      'SendShort is the stronger pick if you want one subscription for faceless videos, avatars and clips. Clipping AI is the stronger pick if the job is turning your own long recordings into clips cheaply.',
    tldr: [
      'SendShort is a short-form video suite from $19/month ($15 annually), but clipping long videos starts on the $29/month tier. Clipping AI Cloud starts at $12/month with clipping on every tier.',
      'SendShort covers faceless videos, avatars and caption translation into 100+ languages. Clipping AI goes deeper on the clipping itself: moment scoring, face tracking, two-speaker and screencast layouts, dubbing into 30+ languages.',
      'Pick SendShort for many formats in one tool. Pick Clipping AI to clip your own long recordings and keep the cost down.',
    ],
    rows: {
      'AI voice dubbing, 30+ languages': 'Caption translation and AI voice-over ($29 plan and up)',
      'AI UGC video with lip-synced actors': 'AI avatar videos ($29 plan and up)',
      'Usage cap': 'Metered in shorts per month',
    },
  },
  // "choppity", "choppity pricing", "is choppity free": a brand search, so the
  // page is a review first (review: true), like Klap. Read on choppity.com.
  choppity: {
    facts: [
      { k: 'Free tier', v: '1 hour/mo', s: 'Logo on exports, projects kept 3 days' },
      { k: 'Paid from', v: '$24/mo', s: 'Starter, 3 hours; $16.80 billed annually' },
      { k: 'Billed by', v: 'Hours analysed', s: 'Of source video, reset on the 1st' },
    ],
    pick: {
      them: ['You want to fine-tune every clip by editing its transcript', 'You also record screen tutorials and schedule posts to six networks', 'One hour of source a month is all you clip'],
      us: ['You want clips without an editor', 'You want to automate it from n8n, an API or Claude', 'You want to pay month-to-month from $12'],
    },
    edge: 'Choppity has the deeper editor: transcript editing, profanity bleeping and a screen recorder.',
    name: 'Choppity',
    checked: '2026-10-29',
    published: '2026-10-29',
    entryPrice: '$24/month ($16.80 billed annually)',
    seo: {
      title: 'Choppity Review 2026: Pricing, Free Plan & Alternative',
      description:
        'Choppity review, October 2026: a free hour a month with a logo, Starter at $24/month ($16.80 annually) for 3 hours, the limits, and the monthly alternative.',
      h1: 'Choppity review: pricing, the free tier, and the alternative',
      breadcrumb: 'Choppity',
    },
    review: true,
    brandBlurb:
      'Choppity (choppity.com) is a cloud AI clip maker aimed mostly at podcasters, educators and marketers. Upload a file or paste a YouTube link and it transcribes the video, proposes 20 to 50 or more short clips, reframes them to vertical while following the active speaker, and captions them; you then refine each clip by editing its transcript. Around the clipper it sells a screen recorder for tutorials and a social scheduler, and it exports 9:16, 1:1 and 16:9.',
    isFree:
      'Yes, with limits. The free tier needs no card and includes the clipper, the editor and captions, but it covers 1 hour of AI video analysis a month, deletes projects after 3 days and puts a small Choppity logo in the corner of every export. Removing the logo starts on Starter at $24/month, or $16.80/month billed annually.',
    tiers: [
      ['Free', '1 hour of AI video analysis a month, 2 GB of storage, projects kept 3 days, one seat, with the clipper, editor and captions; exports carry a small Choppity logo. No card needed.',],
      ['Starter', '$24/month, or $16.80/month billed annually ($201.60/year): 3 hours of analysis a month, 40 GB, projects kept 30 days, 1080p and 4K exports, scheduling to 1 social account'],
      ['Creator', '$32/month, or $22.40/month billed annually: 5 hours a month, 100 GB, projects kept with no expiry, bulk uploads of up to 10 links or files, 3 social accounts, custom fonts, a brand template and API access. More hours come in 5-hour packs at $32 each, up to 100 hours.'],
      ['Team', '$48/month, or $33.60/month billed annually: 5 hours a month, 200 GB, unlimited seats, a shared workspace with roles, 6 social accounts, 5 brand templates'],
      ['Enterprise', 'Custom pricing for bespoke usage, security review and white-label'],
    ],
    tierNote:
      'Annual billing takes 30% off every tier. Usage resets to zero on the 1st of each calendar month, and a payment can be refunded if you ask within 14 days.',
    gotcha:
      'The meter is hours of AI video analysis, counted on the source you upload rather than on the clips you keep: a 90-minute episode uses half of Starter\'s three hours however few clips you export. Usage resets on the 1st of the calendar month, so hours you do not use are gone.',
    strengths: [
      'Text-based editing: trim a clip by deleting words from its transcript, with timeline controls when you need them',
      'Active-speaker tracking for podcasts and interviews, keyword and topic search to clip one specific moment, and automatic profanity bleeping',
      'A screen recorder and a social scheduler (YouTube, TikTok, Instagram, LinkedIn, Facebook, Threads) in the same account, plus an API and an MCP server',
      'Captions and transcripts in 97 languages, it says, and uploads of up to 10 GB',
    ],
    whereWeDiffer: [
      'Clipping AI Cloud clips and captions in one unattended pass; Choppity is built around editing clips through the transcript.',
      'Entry prices: Clipping AI Cloud is $12/month for 100 minutes, billed monthly; Choppity Starter is $24/month for 3 hours, or $16.80 on a annual plan.',
      'Choppity\'s free tier is the more generous hosted one: a full hour a month, against 20 minutes on Clipping AI Cloud after a first video of up to 60 minutes. Both mark free exports.',
      'Choppity has the richer editor (transcript editing, profanity bleeping, a screen recorder). Clipping AI is built to finish clips without one, and adds dubbing into 30+ languages with your own ElevenLabs key.',
    ],
    fit:
      'Choppity and Clipping AI both start from a long recording and return captioned vertical clips. Choppity expects you to polish each clip in its transcript editor; Clipping AI is built to hand back finished clips and to run without you, on our servers or on yours.',
    watermark:
      'Choppity puts a small logo in the corner of free-tier exports; any paid tier, from $24/month ($16.80 annually), removes it, and old clips can be re-exported clean.',
    // Review pages normally reuse `stay` as "who it is for"; Choppity gets both.
    forWhom: [
      'Podcasters and interview shows that want speaker tracking and to fine-tune each clip by editing words rather than a timeline',
      'Course creators who also record screen tutorials and want one tool for the recording and the clips',
      'Small teams that want clipping, a content calendar and posting to six networks under one subscription',
    ],
    stay: [
      'One hour of source a month is all you clip and a corner logo does not bother you: the free tier covers it.',
      'You publish to LinkedIn, Facebook or Threads as well, and want the scheduler next to the clipper.',
      'You pay annually for Creator: $22.40/month for 5 hours is less per minute than Clipping AI Cloud\'s Creator tier at $24.17/month annually for 300 minutes.',
    ],
    migrate: [
      'Download the clips you want to keep first: free projects are deleted after 3 days and Starter projects after 30.',
      'Use up the month\'s hours, then switch: usage resets on the 1st of each calendar month, and refunds are only offered within 14 days of a payment.',
      'Convert the meter. Choppity sells hours of analysis, Clipping AI Cloud sells minutes of source: Starter\'s 3 hours is 180 minutes, between our $12 (100 minutes) and $29 (300 minutes) plans.',
      'Re-run a recent episode from the same YouTube link or file; your first video is clipped free up to 60 minutes, so the side-by-side costs nothing.',
      'If a script called Choppity\'s API or MCP server, point it at the Clipping AI API or MCP server instead.',
    ],
    bestFor:
      'Choppity is the stronger pick if you want to shape every clip by hand in a transcript editor, also record tutorials, and schedule to many networks from one tool. Clipping AI is the stronger pick if you want the clips finished without the editing pass, to pay monthly from $12, or to keep the whole pipeline on your own machine.',
    tldr: [
      'Choppity is a closed-source cloud clipper for podcasts and long talking videos: it proposes clips, follows the active speaker and lets you edit each clip through its transcript. A screen recorder and a social scheduler come in the same account.',
      'It has a real free tier: 1 hour of analysis a month and no card, with a Choppity logo on exports and projects deleted after 3 days. Paid tiers start at $24/month for 3 hours, or $16.80/month billed annually.',
      'Clipping AI Cloud is the alternative: from $12/month billed monthly, with a free tier you can keep.',
    ],
    extraFaq: [
      {
        q: 'How much does Choppity cost?',
        a: 'Checked 29 October 2026: Free at $0 (1 hour of analysis a month), Starter $24/month for 3 hours, Creator $32/month for 5 hours with API access, Team $48/month for 5 hours with unlimited seats, and custom Enterprise tiers. Annual billing takes 30% off: $16.80, $22.40 and $33.60 a month. Clipping AI Cloud starts at $12/month for 100 minutes.',
      },
      {
        q: 'Does Choppity have an API?',
        a: 'Yes. API access starts on the Creator tier ($32/month, $22.40 billed annually), and Choppity also offers an MCP server for AI assistants. Clipping AI has a REST API, webhooks and an MCP server on every Cloud plan.',
      },
    ],
    sources: [
      ['Choppity plans, limits, billing and refunds', 'https://www.choppity.com/pricing/'],
      ['Choppity on free-plan watermarks', 'https://www.choppity.com/tools/free-ai-clip-maker/ai-clip-maker-no-watermark/'],
      ['Choppity features and FAQ', 'https://www.choppity.com/'],
      ['Choppity languages and upload size', 'https://www.choppity.com/alternatives/opus-clip/'],
    ],
    rows: {
      'AI voice dubbing, 30+ languages': 'Not listed; captions in 97 languages, it says',
      'AI UGC video with lip-synced actors': 'Not listed',
      'Free AI YouTube thumbnail & title studio': 'Not listed',
      'Usage cap': 'Metered in hours of AI analysis a month',
    },
  },
  // "getmunch" and "getmunch alternative". getmunch.com now 301s to
  // munchstudio.com, an AI social-media service; the page says so first.
  getmunch: {
    facts: [
      { k: 'Now called', v: 'Munch Studio', s: 'getmunch.com redirects to munchstudio.com' },
      { k: 'Free tier', v: 'None', s: '7-day trial, then the plan bills' },
      { k: 'Paid from', v: '$38/mo', s: 'Billed annual; $68 month-to-month' },
    ],
    pick: {
      them: ['You want an AI to plan, write and post all of your social content, not only clips', 'You post images, carousels and generated videos too', 'You run several brands and want one workspace per client'],
      us: ['Clipping your own long videos is the whole job', 'You want a free tier, or to pay from $12/month rather than $38', 'You want two-speaker and screencast layouts'],
    },
    edge: 'Munch Studio plans, writes and schedules a whole social calendar, which Clipping AI does not.',
    name: 'Munch Studio',
    checked: '2026-10-29',
    published: '2026-10-29',
    entryPrice: '$38/month billed annually ($68 monthly)',
    seo: {
      title: 'GetMunch Review 2026: Now Munch Studio, Price & Alternative',
      description:
        'GetMunch is now Munch Studio, an AI social media service. October 2026: no free tier, a 7-day trial, from $38/month annually, and a clipping alternative.',
      h1: 'GetMunch is now Munch Studio: what changed, what it costs, and a GetMunch alternative',
      breadcrumb: 'GetMunch (Munch Studio)',
    },
    review: true,
    brandBlurb:
      'Searches for getmunch or Munch AI land on munchstudio.com: the old getmunch.com address now redirects there. Munch Studio is sold as "the AI that does your social media marketing for you". It reads your website, videos and brand material, builds a content strategy, then generates posts, posters, carousels, video scripts and short videos and publishes them to Instagram, Facebook, LinkedIn, YouTube and TikTok, with a performance dashboard. Cutting long videos into clips is still there, as a monthly allowance of "video repurposing" minutes, and its help center still documents clips tailored per platform with AI subtitles.',
    isFree:
      'No. There is no free tier, only a 7-day free trial, and its help center says the trial turns into a paid subscription on the tier you picked unless you cancel before it ends. A monthly payment can be refunded within 7 days, and an annual one within 14, only if you have not used the platform.',
    tiers: [
      ['Free', 'No free tier. A 7-day free trial that converts to the paid tier you chose unless you cancel before it ends.',],
      ['Essential', '$68/month, or $38/month billed annually ($456/year): one brand, one user, 500 minutes of video repurposing a month, 10 generated videos, 5 video scripts a week, 100 GB'],
      ['Premium', '$85/month, or $60/month billed annually ($720/year): one brand, unlimited team members, 1,000 minutes of video repurposing, 30 generated videos, unlimited scripts, 1 TB'],
      ['Studio', '$148/month: up to 5 brands, 2,500 minutes of video repurposing, 50 generated videos, 400 GB'],
      ['Scale', '$398/month: up to 15 brands, 7,500 minutes of video repurposing, 150 generated videos, 1 TB'],
    ],
    tierNote:
      'Every tier includes posting to Instagram, Facebook, LinkedIn, YouTube and TikTok, unlimited generated posters and carousels, a content planner and a performance dashboard. Studio and Scale are the multi-brand tiers, quoted at the monthly prices in its tier comparison.',
    gotcha:
      'You cannot buy the clipping on its own. The cheapest way to get it is Essential, $38/month on an annual commitment or $68 month-to-month, and that price also pays for post generation, scripts, generated videos and scheduling: if all you want is long videos cut into clips, most of the subscription goes to features you will not use. The help center lists seven supported languages: English (US and UK), German, Spanish, Italian, Portuguese and Russian.',
    strengths: [
      'Done-for-you social media: it learns the brand from your website and material, writes a content strategy and fills the calendar',
      'Clips, posters, carousels, scripts and generated videos in one queue, approved and posted with a single click to five networks',
      'Multi-brand tiers with a separate workspace, strategy and calendar per client, aimed at agencies',
    ],
    whereWeDiffer: [
      'Clipping AI Cloud does one job, clipping long videos into vertical shorts, from $12/month. Munch Studio sells a full social media service from $38/month on annual billing.',
      'Clipping AI has a free tier you can keep using; Munch Studio has a 7-day trial that becomes a subscription.',
      'Clipping AI Cloud does one job, clipping long videos; Munch Studio sells a full social media service.',
      'Munch Studio writes and schedules posts that are not videos, and plans the calendar for you. Clipping AI does not, and is not trying to.',
    ],
    fit:
      'If what you wanted from Munch was the clipping, Clipping AI does that part and nothing around it: give it a long video, get vertical clips with captions, post them to TikTok, Instagram or YouTube. If you want an AI running the whole social calendar, Munch Studio is a different product and Clipping AI does not replace it.',
    forWhom: [
      'Small businesses that want social media handled without writing or designing posts themselves',
      'Agencies running social for several clients, with one isolated workspace per brand',
      'Teams that want posts, carousels, scripts and clips planned and published from one calendar',
    ],
    stay: [
      'You use the strategy, posts and carousels as much as the clips, so you are paying for the whole service rather than for clipping alone.',
      'You manage several brands and the per-client workspaces on Studio or Scale save you a tool.',
      'You post to LinkedIn and Facebook as well as the short-video networks, from one approval queue.',
    ],
    migrate: [
      'Download the clips and posts you want to keep before the billing period ends: cancelling stops future charges and access lasts until then.',
      'If you are still inside the 7-day trial, cancel before it ends and nothing is charged.',
      'Count the repurposing minutes you actually use. A weekly one-hour show is about 260 minutes a month, which fits Clipping AI Cloud\'s $29 tier (300 minutes); Essential\'s full 500 fits the $59 tier (750).',
      'Run the same long video through Clipping AI; the first one is clipped free up to 60 minutes.',
      'Keep a scheduler for image posts and carousels if you relied on Munch Studio for those: Clipping AI posts only the clips, to TikTok, Instagram and YouTube.',
    ],
    bestFor:
      'Munch Studio is the stronger pick if you want an AI to run your social media end to end and clips are one ingredient. Clipping AI is the stronger pick if you searched for getmunch because you want a clipper: it does that job alone, with a free tier, monthly billing from $12, or $0 on your own machine.',
    tldr: [
      'GetMunch is now Munch Studio: getmunch.com redirects to munchstudio.com, which sells an AI that runs your social media marketing. The best alternatives today are OpusClip, Vizard and Clipping AI Cloud, from $12/month for 100 minutes with no watermark. Clipping long videos is still there, as an allowance of "video repurposing" minutes inside each tier.',
      'There is no free tier, only a 7-day trial that turns into a subscription. Tiers start at $38/month billed annually, or $68 month-to-month, for 500 minutes of video repurposing plus posts, scripts and generated videos.',
      'If you came for the clipper, Clipping AI Cloud is the GetMunch alternative: from $12/month with a free tier you can keep.',
    ],
    extraFaq: [
      {
        q: 'Is Munch AI the same as GetMunch?',
        a: 'Yes. Munch AI is how most people search for Munch, the AI clipper that lived at getmunch.com. That address now redirects to munchstudio.com, and the product is sold as Munch Studio. Checked 29 October 2026.',
      },
      {
        q: 'What happened to GetMunch?',
        a: 'getmunch.com now redirects to munchstudio.com. The product is sold as Munch Studio, an AI social media marketing service, and clipping long videos continues inside it as minutes of "video repurposing" per tier. Checked 29 October 2026.',
      },
      {
        q: 'How much does Munch Studio cost?',
        a: 'Checked 29 October 2026: Essential $68/month or $38/month billed annually (500 minutes of video repurposing), Premium $85/month or $60/month billed annually (1,000 minutes), and the multi-brand Studio ($148/month) and Scale ($398/month) tiers. There is a 7-day trial and no free tier. Clipping AI Cloud starts at $12/month for 100 minutes.',
      },
    ],
    sources: [
      ['Munch Studio plans and plan comparison', 'https://www.munchstudio.com/pricing'],
      ['Munch Studio home page (getmunch.com redirects here)', 'https://www.munchstudio.com/'],
      ['Free trial and billing during the trial', 'https://help.munchstudio.com/en/articles/13114429-free-trial-demo-billing-during-trial'],
      ['Cancellations and refunds', 'https://help.munchstudio.com/en/articles/13114532-cancelations-and-refunds'],
      ['Supported languages', 'https://help.munchstudio.com/en/articles/11801418-supported-languages-in-munch-studio'],
      ['What Munch does with your videos', 'https://help.munchstudio.com/en/articles/8163720-what-does-munch-do-with-my-videos'],
    ],
    rows: {
      'Face-tracked 9:16 reframing': 'Vertical clips per platform, with a manual crop',
      'Word-level auto subtitles': 'AI-generated subtitles with templates',
      'AI voice dubbing, 30+ languages': 'Not listed; 7 supported languages',
      'AI UGC video with lip-synced actors': 'Generated videos, 10 to 150 a month; lip-sync not stated',
      'Free AI YouTube thumbnail & title studio': 'Not listed',
      'Usage cap': 'Metered in minutes of video repurposing a month',
    },
  },
}

/* Rows for the head-to-head table. `os` values are deliberately honest about the
 * hosted plan rather than collapsing everything to "free". */
export const COMPARISON_ROWS = [
  {
    feature: 'Entry price',
    os: '$0 for 20 min/mo · $12/mo without watermark',
    key: 'entryPrice',
  },
  { feature: 'Highlight finder', os: 'Yes, Gemini 3.1 Flash-Lite', vendor: 'Yes' },
  { feature: 'Face-tracked 9:16 reframing', os: 'Yes, MediaPipe + YOLOv8', vendor: 'Yes' },
  { feature: 'Word-level auto subtitles', os: 'Yes, faster-whisper', vendor: 'Yes' },
  { feature: 'AI voice dubbing, 30+ languages', os: 'Yes, with your own ElevenLabs key', vendor: 'No' },
  { feature: 'AI UGC video with lip-synced actors', os: 'Yes, from $0.65/video (0.65 pollen)', vendor: 'No' },
  { feature: 'Free AI YouTube thumbnail & title studio', os: 'Yes on paid Cloud plans', vendor: 'No' },
  { feature: 'Usage cap', os: 'Metered in source minutes', vendor: 'Metered on every tier' },
]

/* The ranked "Best <tool> alternatives" list at the top of every
 * /alternatives/* page. Engines answer "best X alternative" with a numbered
 * list, so the page leads with one. Each line is the tool's one honest edge and
 * its entry price, read from COMPETITORS above (same check dates): if a price
 * changes there, change the line here. Order is the order the list keeps once
 * the page's own tool is taken out. */
export const ALT_PICKS = [
  ['clippingai', 'Clipping AI', 'best free tier you can keep, then $12/month for 100 minutes'],
  ['vizard', 'Vizard', 'best value at volume: 600 minutes for $29/month ($14.50 billed annually)'],
  ['klap', 'Klap', 'fastest link-to-clips: from $14/month billed annually for 100 clips'],
  ['opus-clip', 'Opus Clip', 'most complete cloud clipper: from $15/month for 150 minutes, 60 watermarked minutes a month free'],
  ['submagic', 'Submagic', 'best for animated captions: from $12/month billed annually'],
  ['vidyo-ai', 'Quso (formerly Vidyo.ai)', 'largest free tier: 75 credits a month at 720p'],
  ['choppity', 'Choppity', 'best for editing clips through the transcript: from $16.80/month billed annually'],
  ['2short', '2short.ai', 'cheapest YouTube-only tier: from $9.90/month, 30 free minutes a month'],
]

/* Third-party figures used across the pages. Every one is attributed inline,
 * because sourced statistics are among the few things that reliably survive
 * into a generated answer. */
export const CITED_STATS = [
  {
    claim: 'Short-form video delivers the highest ROI of any content format.',
    source: 'HubSpot, State of Marketing 2025',
  },
  {
    claim: '91% of businesses use video as a marketing tool.',
    source: 'Wyzowl, Video Marketing Statistics 2025',
  },
]

/* Plans as the cost calculator needs them: minutes of source video covered per
 * month and the monthly price, on monthly and on annual billing. Only tools
 * that bill by source minutes are here; Klap (per clip), Submagic (per video)
 * and SendShort (per short) cannot be priced on the same axis, and pretending
 * otherwise would be the kind of number this file exists to avoid. */
export const PRICE_MODELS = {
  clippingai: {
    name: 'Clipping AI Cloud',
    unit: 'per source minute, trims and hooks free',
    checked: '2026-10-05',
    plans: [
      { name: 'Free', watermark: true, monthly: { minutes: 20, price: 0 } },
      { name: 'Starter', monthly: { minutes: 100, price: 12 }, yearly: { minutes: 100, price: 10 } },
      { name: 'Creator', monthly: { minutes: 300, price: 29 }, yearly: { minutes: 300, price: 24.17 } },
      { name: 'Pro', monthly: { minutes: 750, price: 59 }, yearly: { minutes: 750, price: 49.17 } },
      // Pro plus top-ups of 200 minutes at $25.
      { name: 'Pro + 200 min', monthly: { minutes: 950, price: 84 }, yearly: { minutes: 950, price: 74.17 } },
      { name: 'Pro + 400 min', monthly: { minutes: 1150, price: 109 }, yearly: { minutes: 1150, price: 99.17 } },
      { name: 'Pro + 600 min', monthly: { minutes: 1350, price: 134 }, yearly: { minutes: 1350, price: 124.17 } },
      { name: 'Pro + 800 min', monthly: { minutes: 1550, price: 159 }, yearly: { minutes: 1550, price: 149.17 } },
    ],
  },
  'opus-clip': {
    name: 'Opus Clip',
    unit: '1 credit per source minute',
    checked: '2026-10-05',
    plans: [
      { name: 'Free', watermark: true, monthly: { minutes: 60, price: 0 } },
      { name: 'Starter', monthly: { minutes: 150, price: 15 } },
      { name: 'Pro', monthly: { minutes: 300, price: 29 }, yearly: { minutes: 300, price: 14.5 } },
      { name: 'Pro, 2 packs', monthly: { minutes: 600, price: 58 }, yearly: { minutes: 600, price: 29 } },
    ],
  },
  vizard: {
    name: 'Vizard',
    unit: '1 credit per uploaded minute',
    checked: '2026-10-05',
    plans: [
      { name: 'Free', watermark: true, monthly: { minutes: 60, price: 0 } },
      { name: 'Creator', monthly: { minutes: 600, price: 29 }, yearly: { minutes: 600, price: 14.5 } },
    ],
  },
  'vidyo-ai': {
    name: 'Quso (Vidyo.ai)',
    unit: '~1 credit per minute',
    checked: '2026-10-05',
    plans: [
      { name: 'Free (720p)', monthly: { minutes: 75, price: 0 } },
      { name: 'Lite', monthly: { minutes: 100, price: 29 }, yearly: { minutes: 200, price: 19 } },
      { name: 'Essential', monthly: { minutes: 300, price: 39 }, yearly: { minutes: 600, price: 26 } },
      { name: 'Growth', monthly: { minutes: 600, price: 49 }, yearly: { minutes: 1200, price: 33 } },
    ],
  },
  '2short': {
    name: '2short.ai',
    unit: 'hours of video analyzed',
    checked: '2026-10-05',
    plans: [
      { name: 'Free', monthly: { minutes: 30, price: 0 } },
      { name: 'Lite', monthly: { minutes: 300, price: 9.9 } },
      { name: 'Pro', monthly: { minutes: 900, price: 19.9 } },
      { name: 'Premium', monthly: { minutes: 3000, price: 49.9 } },
    ],
  },
  // Hours of AI analysis of the uploaded source; Creator scales in 5-hour packs
  // at $32 each (30% off annual). Munch Studio is left out: its minutes come
  // bundled with posts and generated videos, so a per-minute bar would mislead.
  choppity: {
    name: 'Choppity',
    unit: 'hours of AI analysis per month',
    checked: '2026-10-29',
    plans: [
      { name: 'Free', watermark: true, monthly: { minutes: 60, price: 0 } },
      { name: 'Starter', monthly: { minutes: 180, price: 24 }, yearly: { minutes: 180, price: 16.8 } },
      { name: 'Creator', monthly: { minutes: 300, price: 32 }, yearly: { minutes: 300, price: 22.4 } },
      { name: 'Creator, 10 h', monthly: { minutes: 600, price: 64 }, yearly: { minutes: 600, price: 44.8 } },
      { name: 'Creator, 15 h', monthly: { minutes: 900, price: 96 }, yearly: { minutes: 900, price: 67.2 } },
      { name: 'Creator, 20 h', monthly: { minutes: 1200, price: 128 }, yearly: { minutes: 1200, price: 89.6 } },
      { name: 'Creator, 25 h', monthly: { minutes: 1500, price: 160 }, yearly: { minutes: 1500, price: 112 } },
    ],
  },
}
