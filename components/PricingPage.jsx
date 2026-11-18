"use client";

import React, { useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, MoveRight } from 'lucide-react';
import PricingSection from './PricingSection';

// Billing / value questions for the standalone #/pricing page.

// Billing / value questions reused verbatim from Landing.jsx faqs, minus the
// two that called the product free with no limits: this page is where every
// cancelled checkout lands, right under the paid plans.
const FAQS = [
  {
    question: "Is Clipping AI actually free? Where's the catch?",
    answer: "No catch. The free plan gives you 20 minutes a month with a watermark and no card; paid plans from $12/mo give you 100 minutes without one. Our NVIDIA GPU cuts an 8-minute video in about 50 seconds, the Gemini key is included so there's nothing to create or paste, auto-posting to TikTok, Instagram and YouTube is already wired up, and your clips are stored and reopenable in any browser. Both cost far less than Opus Clip ($15-228/month) or Kapwing ($24-79/month)."
  },
  {
    question: "Does Clipping AI make YouTube thumbnails and titles for free?",
    answer: "Yes. Clipping AI bundles a free AI YouTube thumbnail maker, a free AI YouTube title generator and a free AI YouTube description writer — all driven by Google Gemini 3.1 Flash-Lite. Drop in your video and the AI suggests 10 viral title options, with a chat to refine them. It then generates several thumbnail designs via AI image generation; upload a face photo and a background for a personal touch. The studio also auto-writes YouTube descriptions with chapter timestamps and publishes straight to YouTube. Titles and descriptions work on every plan, while thumbnail images need a paid plan, from $12/month."
  },
  {
    question: "What does an AI ad video cost to make?",
    answer: "Clipping AI is free on its own, but AI Shorts lean on outside APIs that bill per use: Pollinations for actor images and video generation, ElevenLabs for the voiceover. Pollinations draws pollen from your own account, so a video costs whatever those models charge for one Flux actor image, a handful of b-roll stills and 5-15 seconds of video per talking-head chunk. Either way, it's way cheaper than hiring UGC creators ($50-500 per video) or subscribing to platforms like HeyGen ($24-180/month)."
  },
  {
    question: "Do the API and MCP add-ons cost extra?",
    answer: "Nope. Every plan — free included — lets you create API keys in the account page and use the REST API and the MCP server at mcp.clippingai.app/mcp. Calls pull from the same monthly minutes as the dashboard, so automating with Claude, ChatGPT or n8n won't bump your bill at all. The endpoint is always on, so an agent or a scheduled pipeline can clip and publish around the clock. Full guide at clippingai.app/mcp."
  },
  {
    question: "Do I need to install anything?",
    answer: "No. Clipping AI runs in your browser: paste a link or upload a file and our GPUs do the rest. An 8-minute video is cut in about 50 seconds, and captions, reframing, thumbnails and publishing are all built in."
  }
];

const TRUST_CARDS = [
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
          </div>
        </div>
      </section>
    </div>
  );
}
