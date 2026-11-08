"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@whop/react/components";

/**
 * Clip Studio — the experience-view tool:
 *   1. pick an open bounty (the campaign being clipped for)
 *   2. ingest a source video (URL) → OpenShorts pipeline
 *   3. poll job status → review finished vertical clips
 *   4. submit a clip as the bounty deliverable
 */

type Bounty = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  reward?: number | string;
  state?: string;
  status?: string;
};

type Clip = {
  id?: string;
  title?: string;
  video_url?: string;
  duration?: number;
  hook_score?: number;
};

const STEPS = ["Pick a bounty", "Clip it", "Submit"] as const;

export default function ClipStudio({
  bounties,
  companyId,
  userId,
}: {
  bounties: Bounty[];
  companyId: string;
  userId: string;
}) {
  const [step, setStep] = useState(0);
  const [bounty, setBounty] = useState<Bounty | null>(bounties[0] || null);
  const [videoUrl, setVideoUrl] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  useEffect(() => {
    if (bounties.length && !bounty) setBounty(bounties[0]);
  }, [bounties, bounty]);

  const poll = useCallback(
    (id: string) => {
      const tick = async () => {
        try {
          const res = await fetch(`/api/clips?job=${encodeURIComponent(id)}`);
          const j = await res.json();
          setJob(j);
          const finished = (j.clips || []).filter((c: Clip) => c.video_url);
          setClips(finished);
          if (j.status === "completed" || j.status === "failed") {
            setBusy(false);
            if (j.status === "failed") setError(j.error || j.message || "clip job failed");
            return;
          }
          setTimeout(tick, 2000);
        } catch (e: any) {
          setError(String(e?.message || e));
          setBusy(false);
        }
      };
      tick();
    },
    [],
  );

  const startClipping = async () => {
    setError(""); setDone(""); setClips([]); setJob(null);
    if (!videoUrl.trim()) { setError("Paste a source video URL"); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_url: videoUrl.trim(), captions: true }),
      });
      const j = await res.json();
      if (!res.ok || !j.job_id) throw new Error(j.detail || j.error || "failed to start");
      setJobId(j.job_id);
      setStep(1);
      poll(j.job_id);
    } catch (e: any) {
      setError(String(e?.message || e));
      setBusy(false);
    }
  };

  const submitClip = async () => {
    setError(""); setDone("");
    if (!bounty || !picked) return;
    setBusy(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bounty_id: bounty.id,
          urls: [`/api/media?path=${encodeURIComponent(picked)}`],
          caption: `Clip generated with Clipping AI by @${userId}`,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail || j.error || "submission failed");
      setDone("Submitted to the bounty — the creator reviews it next.");
      setStep(2);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* step rail */}
      <div className="flex items-center gap-2 text-3 text-gray-10">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <span className={i === step ? "font-bold text-gray-12" : i < step ? "text-gray-11" : "text-gray-9"}>
              {i + 1}. {label}
            </span>
            {i < STEPS.length - 1 && <span className="text-gray-8">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* 1 — bounties */}
      <section className="flex flex-col gap-3">
        <h2 className="text-6 font-bold">Open bounties in this community</h2>
        {bounties.length === 0 && (
          <p className="text-3 text-gray-10">No open bounties right now. Check back later.</p>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          {bounties.map((b) => (
            <button
              key={b.id}
              onClick={() => setBounty(b)}
              className={`text-left border rounded-lg p-4 transition-colors ${
                bounty?.id === b.id ? "border-gray-12 bg-gray-a3" : "border-gray-a4 hover:border-gray-10"
              }`}
            >
              <div className="flex justify-between items-center gap-3">
                <strong className="text-4">{b.title || b.name || b.id}</strong>
                {b.reward != null && <span className="text-3 text-gray-11">${b.reward}</span>}
              </div>
              {b.description && (
                <p className="text-2 text-gray-10 mt-1 line-clamp-2">{b.description}</p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 2 — clip pipeline */}
      <section className="flex flex-col gap-3">
        <h2 className="text-6 font-bold">Clip a video</h2>
        <p className="text-2 text-gray-10">
          Paste a long-form link (YouTube, Twitch, or a direct mp4). The pipeline transcribes, finds
          viral moments, reframes to 9:16 and burns captions — then you pick the clip to submit.
        </p>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col gap-1 grow">
            <span className="text-2 text-gray-10">Source video URL</span>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="border border-gray-a4 rounded-lg px-3 py-2 bg-gray-a1 text-gray-12 text-3 w-full"
            />
          </label>
          <Button variant="classic" size="3" onClick={startClipping} disabled={busy || !videoUrl.trim()}>
            {busy && !jobId ? "Starting…" : "Generate clips"}
          </Button>
        </div>
        <p className="text-1 text-gray-9">Company {companyId} · clipper {userId}</p>
      </section>

      {/* job + clips */}
      {jobId && (
        <section className="flex flex-col gap-3">
          <h3 className="text-5 font-bold">
            Job <code className="text-2">{jobId.slice(0, 8)}</code> — {job?.status || "queued"}
            {job?.progress ? ` · ${job.progress}%` : ""}
          </h3>
          {busy && (
            <div className="w-full h-2 bg-gray-a3 rounded-full overflow-hidden">
              <div className="h-full bg-gray-12 transition-all" style={{ width: `${Math.max(2, job?.progress || 0)}%`}} />
            </div>
          )}
          {clips.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {clips.map((c) => (
                <figure key={c.video_url} className={`border rounded-lg overflow-hidden ${picked === c.video_url ? "border-gray-12" : "border-gray-a4"}`}>
                  <video
                    controls
                    preload="metadata"
                    className="w-full aspect-[9/16] bg-black"
                    src={`/api/media?path=${encodeURIComponent(c.video_url || "")}`}
                  />
                  <figcaption className="p-2 flex flex-col gap-2">
                    <span className="text-2 text-gray-10 line-clamp-1">{c.title || "clip"}</span>
                    {c.duration ? <span className="text-1 text-gray-9">{Math.round(c.duration)}s</span> : null}
                    <Button
                      variant={picked === c.video_url ? "classic" : "surface"}
                      size="2"
                      onClick={() => c.video_url && setPicked(c.video_url)}
                      disabled={busy}
                    >
                      {picked === c.video_url ? "Selected" : "Select for submission"}
                    </Button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3 — submit */}
      {picked && (
        <section className="flex flex-col gap-3 border border-gray-a4 rounded-lg p-4">
          <h3 className="text-5 font-bold">Submit to “{bounty?.title || bounty?.name || bounty?.id}”</h3>
          <p className="text-2 text-gray-10">
            The selected clip goes to the bounty creator for review. Approvals are paid out from the
            bounty pool.
          </p>
          <div>
            <Button variant="classic" size="3" onClick={submitClip} disabled={busy || !bounty}>
              {busy ? "Submitting…" : "Submit clip"}
            </Button>
          </div>
        </section>
      )}

      {error && <p className="text-3 text-red-10">{error}</p>}
      {done && <p className="text-3 text-green-10">{done}</p>}
    </div>
  );
}
