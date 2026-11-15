"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The marketing site lives at "/" with the app at /app. The upstream product
 * keeps both in one document and switches on the hash (#app), so links such as
 * "/#app" or "/#app?tab=thumbnails" must still land in the dashboard.
 */
export function HashAppRedirect() {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname !== "/") return;
		const move = () => {
			const hash = window.location.hash;
			if (hash === "#app" || hash.startsWith("#app?") || hash === "#/app") {
				window.location.replace(`/app/${hash}`);
			}
		};
		move();
		window.addEventListener("hashchange", move);
		return () => window.removeEventListener("hashchange", move);
	}, [pathname]);

	return null;
}
