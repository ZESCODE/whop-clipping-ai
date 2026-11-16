"use client";

import React from 'react';
import { ArrowLeft, FileText, Shield, Landmark, Flag, RotateCcw } from 'lucide-react';

// The canonical legal documents are the static pages emitted at build time by
// vite-plugin-seo from seo/legal.js (/terms, /privacy, /legal-notice + Spanish
// versions). This in-app view is a hub with the plain-language summary and
// links, so the SPA route (#legal) and the crawlable pages never drift: the
// full text lives in exactly one place.
const LAST_UPDATED = '2026-09-04';
const SUPPORT_EMAIL = 'info@clippingai.local';

const DOCS = [
    {
        icon: FileText,
        title: 'Terms of Service',
        desc: 'The ground rules for using the service, your rights over your content, how billing works, EU withdrawal, and what counts as fair use.',
        href: '/terms',
        es: '/terminos',
    },
    {
        icon: Shield,
        title: 'Privacy Policy',
        desc: 'The data we keep and for how long, the providers that handle it, and your rights under GDPR. Nothing optional is loaded before you agree.',
        href: '/privacy',
        es: '/privacidad',
    },
    {
        icon: Landmark,
        title: 'Legal Notice',
        desc: 'Self-hosted instance (branded Clipping AI) — upstream: OpenShorts, run by TONVI TECH SL, Málaga, Spain (LSSI-CE art. 10).',
        href: '/legal-notice',
        es: '/aviso-legal',
    },
    {
        icon: RotateCcw,
        title: 'Refund Policy',
        desc: 'Billed in the last 14 days without using the service since? We give you the full amount back, no explanation required.',
        href: '/refunds',
        es: '/reembolsos',
    },
    {
        icon: Flag,
        title: 'Report Illegal Content',
        desc: 'How to flag unlawful or rights-breaching material, what we do once a notice arrives, and how to contest a takedown (DSA arts. 16-17).',
        href: '/report-content',
        es: '/reportar-contenido',
    },
];

export default function Legal() {
    const handleBack = () => {
        window.location.hash = '';
    };

    return (
        <div className="ambient-page min-h-screen bg-paper text-ink2">
            <header className="border-b border-rule sticky top-0 bg-paper z-10">
                <div className="max-w-[65ch] mx-auto px-6 py-3 flex items-center">
                    <button onClick={handleBack} className="btn-quiet">
                        <ArrowLeft size={16} /> Go back
                    </button>
                </div>
            </header>

            <main className="max-w-[65ch] mx-auto px-6 py-12">
                <h1 className="font-display lowercase text-3xl md:text-4xl text-ink mb-3">Terms and Privacy</h1>
                <p className="readout mb-10">Last revised: {LAST_UPDATED}</p>

                <div className="text-ink2 leading-relaxed space-y-3 text-sm mb-10">
                    <p>In brief:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong className="text-ink">Your videos and clips remain yours.</strong> Your content is never used to train AI models.</li>
                        <li><strong className="text-ink">You need the rights</strong> to every video you upload or link, and you are the one publishing whatever you post.</li>
                        <li><strong className="text-ink">No advertising trackers.</strong> Audience measurement is first-party and stays switched off until you agree to it; free-plan clips are erased after 7 days.</li>
                        <li><strong className="text-ink">Cancel whenever you like</strong> in your account. Billed in the last 14 days and never used it? Full refund. EU consumers also keep their 14-day withdrawal right.</li>
                        <li><strong className="text-ink">Erase everything at any time.</strong> Account &rarr; Delete account wipes your projects, clips and keys on the spot. No email to us, no waiting.</li>
                    </ul>
                    <p>
                        The complete documents (in English, with Spanish versions that take precedence for consumers in Spain):
                    </p>
                </div>

                <div className="space-y-3 mb-12">
                    {DOCS.map(({ icon: Icon, title, desc, href, es }) => (
                        <a
                            key={href}
                            href={href}
                            className="flex items-start gap-4 p-4 border border-rule rounded-card hover:border-brass transition-colors"
                        >
                            <Icon size={18} className="text-brass shrink-0 mt-0.5" />
                            <span>
                                <span className="block text-ink font-medium">{title}</span>
                                <span className="block text-sm text-muted mt-1">{desc}</span>
                                <span className="block text-xs text-muted mt-1 underline underline-offset-2">
                                    también en español: {es}
                                </span>
                            </span>
                        </a>
                    ))}
                </div>

                <p className="text-sm text-muted">
                    the self-hosted instance is run by you; upstream OpenShorts.app is operated by TONVI TECH SL (CIF B-19780394), Calle Puerta del Mar 18,
                    29005 Málaga, Spain. Questions:{' '}
                    <a className="underline underline-offset-2 hover:text-brass transition-colors" href={`mailto:${SUPPORT_EMAIL}`}>
                        {SUPPORT_EMAIL}
                    </a>
                    . Self-hosted instances are managed by their own administrators under the MIT License; these
                    documents apply to the hosted service alone.
                </p>
            </main>
        </div>
    );
}
