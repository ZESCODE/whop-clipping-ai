import { withWhopAppConfig } from "@whop/react/next.config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* The dashboard bundle in public/app is a single index.html driven by a hash
	   router, so "/app" has to be answered with that file (public assets are
	   only served on their exact paths). */
	async rewrites() {
		return [{ source: "/app", destination: "/app/index.html" }];
	},
	/* config options here */
	images: {
		remotePatterns: [{ hostname: "**" }],
	},
};

export default withWhopAppConfig(nextConfig);
