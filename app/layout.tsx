import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Clipping AI",
	description:
		"Clip long videos into shorts for Whop bounties — generate, review, submit, get paid.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" data-accent-color="blue" suppressHydrationWarning>
			<head>
				{/* Self-hosted faces (OFL WOFF2): Space Grotesk display, Inter body,
				    JetBrains Mono readouts — see public/fonts.css. */}
				<link rel="stylesheet" href="/fonts.css" />
				{/* Dev overlay shows errors thrown by browser extensions (Automa
				    injects an inline script and data-atm-ext-installed on <body>).
				    Register a capture listener before the overlay's so their
				    errors never reach the red box. Dev only. */}
				{process.env.NODE_ENV !== "production" && (
					<script
						dangerouslySetInnerHTML={{
							__html: `(function(){var isExt=function(s){s=String(s||'');return !s||s==='<anonymous>'||s.indexOf('chrome-extension://')===0||s.indexOf('moz-extension://')===0||s.indexOf('safari-web-extension://')===0};window.addEventListener('error',function(e){if(isExt(e.filename)||/chrome-extension:\\/\\/|<anonymous>/.test(e.error&&e.error.stack||''))e.stopImmediatePropagation()},true);window.addEventListener('unhandledrejection',function(e){var s=String(e.reason&&(e.reason.stack||e.reason)||'');if(/chrome-extension:\\/\\/|<anonymous>/.test(s))e.stopImmediatePropagation()},true)})();`,
						}}
					/>
				)}
			</head>
			{/* Extensions (and Whop's own iframe shell) add attributes to <body>
			    before React hydrates; ignore that difference. */}
			<body className="antialiased" suppressHydrationWarning>
				<WhopApp>{children}</WhopApp>
			</body>
		</html>
	);
}