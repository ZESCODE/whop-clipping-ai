"use client";

/**
 * Browser side of the Upload-Post BYOK flow.
 *
 * The key is the visitor's own, stored by the dashboard under
 * `uploadPostKey_v3` (XOR + base64, the same obfuscation the app has always
 * used) and read here so the publishing pages work without a server session.
 * It is only ever sent to our own /api/upload-post proxy over the current
 * origin.
 */
const PREFIX = "ENC:";
const SALT = process.env.NEXT_PUBLIC_UPLOAD_POST_SALT || "Clipping AI-Static-Salt-Change-Me";
const KEY_STORAGE = "uploadPostKey_v3";
const PROFILE_STORAGE = "uploadUserId";

function decrypt(value: string): string {
	if (!value) return "";
	if (!value.startsWith(PREFIX)) return value;
	try {
		const raw = atob(value.slice(PREFIX.length));
		return raw
			.split("")
			.map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ SALT.charCodeAt(i % SALT.length)))
			.join("");
	} catch {
		return "";
	}
}

export function readUploadPostKey(): string {
	if (typeof window === "undefined") return "";
	try {
		return decrypt(localStorage.getItem(KEY_STORAGE) || "");
	} catch {
		return "";
	}
}

export function readUploadPostProfile(): string {
	if (typeof window === "undefined") return "";
	try {
		return localStorage.getItem(PROFILE_STORAGE) || "";
	} catch {
		return "";
	}
}

export async function uploadPostGet<T = any>(path: string): Promise<T> {
	const key = readUploadPostKey();
	if (!key) throw new Error("missing_key");
	const res = await fetch(`/api/upload-post${path}`, {
		headers: { "x-upload-post-key": key },
		cache: "no-store",
	});
	const text = await res.text();
	let data: any = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = { raw: text.slice(0, 200) };
	}
	if (!res.ok) {
		const detail = data?.detail || data?.message || data?.error || `upstream ${res.status}`;
		throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail).slice(0, 200));
	}
	return data as T;
}
