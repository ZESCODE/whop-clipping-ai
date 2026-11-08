import { NextRequest, NextResponse } from "next/server";

/**
 * Clip pipeline proxy → OpenShorts API (:8000 by default).
 *   POST { video_url }            → starts a clip job (URL ingest via yt-dlp)
 *   POST { upload_id }            → starts a job from an uploaded file
 *   GET  ?job=<id>                → job status + finished clips
 * Keeps the OpenShorts URL server-side; the browser only talks to this origin.
 */
const OPENSHORTS = process.env.OPENSHORTS_API_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  try {
    if (body.video_url) {
      const res = await fetch(`${OPENSHORTS}/api/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: body.video_url,
          acknowledged: true,
          captions: body.captions ?? true,
        }),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
    if (body.upload_id) {
      const res = await fetch(`${OPENSHORTS}/api/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upload_id: body.upload_id,
          acknowledged: true,
          captions: body.captions ?? true,
        }),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json({ error: "video_url or upload_id is required" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: `OpenShorts unreachable: ${String(e?.message || e)}` }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("job");
  if (!jobId) {
    return NextResponse.json({ error: "job id is required" }, { status: 400 });
  }
  try {
    const res = await fetch(`${OPENSHORTS}/api/jobs/${encodeURIComponent(jobId)}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: `OpenShorts unreachable: ${String(e?.message || e)}` }, { status: 502 });
  }
}
