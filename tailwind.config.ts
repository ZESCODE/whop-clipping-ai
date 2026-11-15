import { frostedThemePlugin } from "@whop/react/tailwind";

// Frost-blue palette mirrored from the OpenShorts dashboard tokens, so the
// ported landing (components/Landing.jsx) and its CSS classes resolve.
export default {
	plugins: [frostedThemePlugin()],
	theme: {
		extend: {
			colors: {
				paper: "oklch(12% 0.02 258 / <alpha-value>)",
				paper2: "oklch(15.5% 0.022 258 / <alpha-value>)",
				paper3: "oklch(19% 0.024 258 / <alpha-value>)",
				ink: "oklch(96% 0.006 262 / <alpha-value>)",
				ink2: "oklch(86% 0.01 262 / <alpha-value>)",
				ink3: "oklch(74% 0.012 262 / <alpha-value>)",
				muted: "oklch(64% 0.012 262 / <alpha-value>)",
				brass: "oklch(64% 0.19 258 / <alpha-value>)",
				brassink: "oklch(16% 0.03 258 / <alpha-value>)",
				coral: "oklch(76% 0.12 250 / <alpha-value>)",
				ok: "oklch(75% 0.11 150 / <alpha-value>)",
				warn: "oklch(78% 0.14 75 / <alpha-value>)",
				danger: "oklch(66% 0.18 25 / <alpha-value>)",
			},
			borderColor: {
				rule: "oklch(96% 0.006 262 / 0.08)",
				rule2: "oklch(96% 0.006 262 / 0.14)",
			},
			borderRadius: {
				card: "10px",
				input: "8px",
			},
			fontFamily: {
				display: "var(--font-display)",
				body: "var(--font-body)",
				mono: "var(--font-mono)",
			},
		},
	},
};