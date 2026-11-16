"use client";

import React, { useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Github, MoveRight, Cpu, KeyRound, Send, Server, HardDrive } from 'lucide-react';
import PricingSection from './PricingSection';

// The honest hosted-vs-self-hosted trade-off. The software is identical and open
// source either way, so the plans have to earn their price on hardware, keys and
// setup rather than on features. Timings are measured on our own pipeline: an
// 8-minute input takes ~50s on the server GPU and 5-8 min on CPU.
// The landing page carries its own shorter version of this (Landing.jsx "Two ways
// to use Clipping AI"); this detailed table is only for the standalone #/pricing.
const HOSTED_VS_SELF = [
  {
    icon: Cpu,
    label: 'Speed',
    hosted: 'Our NVIDIA GPU cuts an 8-minute video in roughly 50 seconds.',
    self: "That same video takes 5 to 8 minutes on a regular CPU — unless you've got a CUDA GPU of your own.",
  },
  {
    icon: KeyRound,
    label: 'API keys',
    hosted: 'Your Gemini key is on us. Nothing to set up, paste or top up.',
    self: 'You bring and pay for your own Gemini key — plus ElevenLabs and Pollinations for dubbing and AI Shorts.',
  },
  {
    icon: Send,
    label: 'Auto-posting',
    hosted: 'Link TikTok, Instagram Reels and YouTube Shorts right from your account.',
    self: 'You sign up for Upload-Post yourself and wire up the credentials.',
  },
  {
    icon: Server,
    label: 'Setup',
    hosted: 'Just sign in and drop a link. Nothing to install.',
    self: 'Docker, 8GB+ RAM and a few gigabytes of model downloads on first run.',
  },
  {
    icon: HardDrive,
    label: 'Storage',
    hosted: "We host your clips, ready to reopen in any browser.",
    self: 'Your disk, your backups, your rules.',
  },
];

// Billing / value questions reused verbatim from Landing.jsx faqs, minus the
// two that called the product free with no limits: this page is where every
// cancelled checkout lands, right under the paid plans.
const FAQS = [
  {
    question: "Is Clipping AI actually free? Where's the catch?",
    answer: "No catch — just two ways to use it. (1) Self-hosted is 100% free and open source: run it with Docker on your own machine, bring your own API keys, and there are no watermarks, no usage caps and no subscription. What it costs is hardware and time. On a typical CPU, an 8-minute video takes 5 to 8 minutes to process, and you'll need your own Google Gemini key (required; free tier is 1,500 requests/day), plus ElevenLabs for dubbing and Pollinations for AI Shorts if you want those. (2) Hosted at clippingai.app is the same software with the running costs covered: our NVIDIA GPU cuts that same 8-minute video in about 50 seconds, the Gemini key is included so there's nothing to create or paste, auto-posting to TikTok, Instagram and YouTube is already wired up, and your clips are stored and reopenable in any browser. There's a free plan (20 minutes a month, watermark, no card) and paid plans from $12/mo for 100 minutes without watermark. Bottom line: free if you're happy to run it yourself, paid if you'd rather it just fly. Both cost far less than Opus Clip ($15-228/month) or Kapwing ($24-79/month)."
  },
  {
    question: "Does Clipping AI make YouTube thumbnails and titles for free?",
    answer: "Yes. Clipping AI bundles a free AI YouTube thumbnail maker, a free AI YouTube title generator and a free AI YouTube description writer — all driven by Google Gemini 3.1 Flash-Lite. Drop in your video and the AI suggests 10 viral title options, with a chat to refine them. It then generates several thumbnail designs via AI image generation; upload a face photo and a background for a personal touch. The studio also auto-writes YouTube descriptions with chapter timestamps and publishes straight to YouTube. Self-hosted, it all runs on your own Gemini key (the free tier works fine). On Clipping AI Cloud, titles and descriptions work on every plan, while thumbnail images need a paid plan, from $12/month."
  },
  {
    question: "What does an AI ad video cost to make?",
    answer: "Clipping AI is free on its own, but AI Shorts lean on outside APIs that bill per use: Pollinations for actor images and video generation, ElevenLabs for the voiceover. Pollinations draws pollen from your own account, so a video costs whatever those models charge for one Flux actor image, a handful of b-roll stills and 5-15 seconds of video per talking-head chunk. Either way, it's way cheaper than hiring UGC creators ($50-500 per video) or subscribing to platforms like HeyGen ($24-180/month)."
  },
  {
    question: "Do the API and MCP add-ons cost extra?",
    answer: "Nope. Every plan — free included — lets you create API keys in the account page and use the REST API and the MCP server at mcp.clippingai.app/mcp. Calls pull from the same monthly minutes as the dashboard, so automating with Claude, ChatGPT or n8n won't bump your bill at all. The hosted endpoint's edge is that it's always on: an agent or a scheduled pipeline can clip and publish while your machine is powered down — the one thing self-hosting can't do for you. Full guide at clippingai.app/mcp."
  },
  {
    question: "What do I need to run Clipping AI?",
    answer: "Clipping AI runs anywhere Docker does. We recommend 8GB+ RAM and a modern multi-core CPU. GPU acceleration (NVIDIA CUDA) is optional, but it makes video processing much faster. The Docker Compose setup sorts out every dependency automatically — Python 3.11, FFmpeg, YOLOv8, MediaPipe, faster-whisper and the React dashboard. It works on Linux, macOS and Windows (via WSL2/Docker Desktop)."
  }
];

const TRUST_CARDS = [
  {
    eyebrow: 'Open Source',
    body: (
      <>
        Every line of code is public on{' '}
        <a
          href="https://github.com/mutonby/clippingai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink underline decoration-1 underline-offset-2 hover:text-brass transition-colors"
        >
          GitHub
        </a>
        , and self-hosting it stays free forever. A plan here buys the GPU, the API keys and the
        setup — not the software.
      </>
    ),
  },
  {
    eyebrow: 'No watermarks on paid plans · no per-clip credits',
    body: (
      <>
        Paid plans export clean, watermark-free clips. Plans meter minutes of source video per billing
        period — never per-clip credits.
      </>
    ),
  },
  {
    eyebrow: 'Cancel Anytime',
    body: (
      <>
        Start free — your first video is on us for up to 60 minutes, then 20 minutes a month, no card needed. Paid plans bill through
        Stripe, and you can cancel anytime from your account.
      </>
    ),
  },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div>
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-1 py-5 text-left"
    >
      <span className="text-ink font-medium pr-4">{question}</span>
      <ChevronDown
        size={18}
        className={`text-muted flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && (
      <div className="px-1 pb-6">
        <p className="text-muted text-sm leading-relaxed">{answer}</p>
      </div>
    )}
  </div>
);

const DemoFigure = ({ src, label, className = '', children }) => (
  <figure className={`border border-rule rounded-card overflow-hidden bg-paper2 ${className}`}>
    <div className="relative">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="block w-full h-auto"
      />
      {children}
    </div>
    <figcaption className="readout px-3 py-2 border-t border-rule">{label}</figcaption>
  </figure>
);

// Conversion-focused paywall / pricing page (#/pricing). Wraps <PricingSection/>.
export default function PricingPage({
	onRequireLogin = () => {
		if (typeof window !== "undefined") window.location.href = "/discover";
	},
}) {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToPlans = () => {
    document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="ambient-page min-h-screen bg-paper text-ink2 animate-fade">
      {/* Header */}
      <header className="px-6 pt-20 pb-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="eyebrow mb-5">Plans &amp; Pricing</p>
          <h1 className="font-display lowercase text-ink tracking-tight text-4xl md:text-6xl leading-[1.02] mb-5">
            clip your first video in minutes.
          </h1>
          <p className="readout">first video free (up to 60 min) · then 20 min/month · no card</p>
        </div>
      </header>

      {/* Demo proof strip */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-5 md:gap-6">
            <DemoFigure src="/demo/clip-source.mp4" label="source · 16:9" />

            <MoveRight size={20} className="text-brass hidden md:block" aria-hidden="true" />
            <ArrowDown size={20} className="text-brass md:hidden justify-self-center" aria-hidden="true" />

            <DemoFigure
              src="/demo/clip-vertical.mp4"
              label="result · 9:16 · tracked"
              className="w-44 sm:w-48 justify-self-center md:justify-self-auto"
            />
          </div>
          <p className="text-center text-xs text-muted lowercase mt-4">
            real output from the studio — same footage, reframed with AI face tracking.
          </p>
        </div>
      </section>

      {/* Pricing grid */}
      <section id="pricing-plans" className="px-6 py-16 border-t border-rule scroll-mt-8">
        <div className="max-w-6xl mx-auto">
          <PricingSection onRequireLogin={onRequireLogin} />
        </div>
      </section>

      {/* Hosted vs self-hosted: same software, different running costs. */}
      <section className="px-6 py-16 border-t border-rule">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="eyebrow mb-3">Cloud or Self-Hosted</p>
            <h2 className="font-display text-3xl md:text-4xl lowercase text-ink tracking-tight">
              what you&apos;re really paying for
            </h2>
            <p className="text-muted text-sm mt-3 max-w-2xl leading-relaxed">
              Same software, open source either way. A plan covers the hardware, the API keys and the
              setup — here&apos;s exactly what that adds up to.
            </p>
          </div>

          <div className="hidden md:grid grid-cols-[9rem_1fr_1fr] gap-x-6 pb-2 mb-2 border-b border-rule">
            <span />
            <span className="eyebrow">Hosted on This Site</span>
            <span className="eyebrow">Self-Hosted</span>
          </div>

          <div className="divide-y divide-rule border-b border-rule">
            {HOSTED_VS_SELF.map(({ icon: Icon, label, hosted, self }) => (
              <div key={label} className="py-4 grid gap-2 md:grid-cols-[9rem_1fr_1fr] md:gap-x-6 md:items-start">
                <div className="flex items-center gap-2 text-ink2">
                  <Icon size={15} className="text-muted shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <div>
                  <span className="eyebrow block mb-1 md:hidden">Hosted on This Site</span>
                  <p className="text-sm text-ink2 leading-relaxed">
                    <Check size={14} className="text-ok inline-block mr-1.5 -mt-0.5" />
                    {hosted}
                  </p>
                </div>
                <div>
                  <span className="eyebrow block mb-1 mt-2 md:hidden">Self-Hosted</span>
                  <p className="text-sm text-muted leading-relaxed">{self}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <p className="text-xs text-muted leading-relaxed max-w-xl">
              Self-hosting is genuinely free, and always will be. It costs you a machine, your own API
              keys and the time to keep it humming.
            </p>
            <a
              href="https://github.com/mutonby/clippingai"
              target="_blank" rel="noopener noreferrer"
              className="shrink-0 text-sm text-muted hover:text-ink transition-colors inline-flex items-center gap-1.5"
            >
              <Github size={15} /> Browse the source
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="px-6 py-16 border-t border-rule">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRUST_CARDS.map((card) => (
            <div key={card.eyebrow} className="card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Check size={16} className="text-ok shrink-0" />
                <span className="eyebrow">{card.eyebrow}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="px-6 py-16 border-t border-rule">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="eyebrow mb-3">Billing · FAQs</p>
            <h2 className="font-display text-3xl md:text-4xl lowercase text-ink tracking-tight">
              Common Questions
            </h2>
          </div>
          <div className="divide-y divide-rule border-y border-rule">
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="px-6 py-24 border-t border-rule">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl lowercase text-ink tracking-tight mb-10">
            twenty free minutes, every single month. no card until you decide.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToPlans} className="btn-primary whitespace-nowrap">
              Start free
              <ArrowRight size={16} />
            </button>
            <a
              href="https://github.com/mutonby/clippingai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost whitespace-nowrap"
            >
              <Github size={16} />
              View source
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
