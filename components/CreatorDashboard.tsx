"use client";

import React from "react";
import { Button } from "@whop/react/components";

/**
 * Creator dashboard — review queue for clipping submissions.
 * Note: approve/deny is a native Whop bounty action (no public API endpoint),
 * so each review links out to the Whop dashboard; this view is the fast
 * watch-then-decide queue with payout totals.
 */

type Submission = {
	id: string;
	status: string;
	created_at?: string;
	deliverable?: {urls?: string[]; caption?: string};
	user?: {id?: string; username?: string; name?: string};
};

type Bounty = {
	id: string;
	title: string;
	reward?: number | string | null;
	state?: string;
	submissions: Submission[];
};

const STATUS_TONE: Record<string, string> = {
	approved: "text-green-10 border-green-8",
	paid: "text-green-10 border-green-8",
	denied: "text-red-10 border-red-8",
	rejected: "text-red-10 border-red-8",
	submitted: "text-gray-11 border-gray-a4",
	pending: "text-gray-11 border-gray-a4",
};

export default function CreatorDashboard({
	bounties,
	payouts,
	companyId,
}: {
	bounties: Bounty[];
	payouts: {total: number; count: number};
	companyId: string;
}) {
	// Submissions carry app-origin deliverable URLs — strip the origin so the
	// same-origin media proxy can stream them in-app.
	const inAppUrl = (url: string) => {
		try {
			const u = new URL(url);
			if (u.pathname.startsWith("/api/media")) return `${u.pathname}${u.search}`;
		} catch { /* relative already */ }
		return url;
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="grid gap-4 md:grid-cols-3">
				<div className="border border-gray-a4 rounded-lg p-4">
					<div className="text-2 text-gray-10">Open bounties</div>
					<div className="text-9 font-bold mt-1">{bounties.length}</div>
				</div>
				<div className="border border-gray-a4 rounded-lg p-4">
					<div className="text-2 text-gray-10">Submissions in queue</div>
					<div className="text-9 font-bold mt-1">
						{bounties.reduce((n, b) => n + b.submissions.length, 0)}
					</div>
				</div>
				<div className="border border-gray-a4 rounded-lg p-4">
					<div className="text-2 text-gray-10">Payouts ({payouts.count})</div>
					<div className="text-9 font-bold mt-1">${payouts.total.toFixed(2)}</div>
				</div>
			</div>

			{bounties.length === 0 && (
				<p className="text-3 text-gray-10">
					No bounties yet. Create one in your Whop dashboard and clipping submissions will show
					up here.
				</p>
			)}

			{bounties.map((b) => (
				<section key={b.id} className="flex flex-col gap-4 border border-gray-a4 rounded-lg p-5">
					<header className="flex flex-wrap justify-between items-center gap-3">
						<div>
							<h2 className="text-6 font-bold">{b.title}</h2>
							<p className="text-2 text-gray-10">
								{b.id} · {b.submissions.length} submission{b.submissions.length === 1 ? "" : "s"}
								{b.reward != null ? ` · $${b.reward} reward` : ""}
							</p>
						</div>
						<a href="https://whop.com/dashboard" target="_blank" rel="noreferrer">
							<Button variant="classic" size="2">
								Review in Whop
							</Button>
						</a>
					</header>

					{b.submissions.length === 0 && (
						<p className="text-2 text-gray-9">No submissions yet.</p>
					)}

					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{b.submissions.map((s) => {
							const url = s.deliverable?.urls?.[0];
							return (
								<article key={s.id} className="border border-gray-a4 rounded-lg overflow-hidden flex flex-col">
									{url ? (
										<video
											controls
											preload="metadata"
											className="w-full aspect-[9/16] bg-black"
											src={inAppUrl(url)}
										/>
									) : (
										<div className="w-full aspect-[9/16] bg-gray-a2 grid place-items-center text-2 text-gray-9">
											No media
										</div>
									)}
									<div className="p-3 flex flex-col gap-2">
										<div className="flex justify-between items-center gap-2">
											<strong className="text-3">
												{s.user?.name || s.user?.username || s.user?.id || "clipper"}
											</strong>
											<span
												className={`text-1 px-2 py-0.5 rounded-full border ${STATUS_TONE[s.status] || "text-gray-11 border-gray-a4"}`}
											>
												{s.status}
											</span>
										</div>
										{s.deliverable?.caption && (
											<p className="text-2 text-gray-10 line-clamp-2">{s.deliverable.caption}</p>
										)}
										{s.created_at && (
											<p className="text-1 text-gray-9">{new Date(s.created_at).toLocaleString()}</p>
										)}
									</div>
								</article>
							);
						})}
					</div>
				</section>
			))}

			<p className="text-1 text-gray-9">Company {companyId}</p>
		</div>
	);
}
