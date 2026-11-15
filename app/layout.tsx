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
			</head>
			{/* Extensions (and Whop's own iframe shell) add attributes to <body>
			    before React hydrates; ignore that difference. */}
			<body className="antialiased" suppressHydrationWarning>
				<WhopApp>{children}</WhopApp>
			</body>
		</html>
	);
}