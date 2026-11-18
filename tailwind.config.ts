import { frostedThemePlugin } from "@whop/react/tailwind";

// Frost palette mirrored from the ZES OS dashboard at :7070 (#409cff rim,
// #0a0a0a paper, #eaf1ff ink), so the landing, the ported SEO pages and the
// component classes in clippingai-ui.css all read as the same lit glass.
export default {
	plugins: [frostedThemePlugin()],
	theme: {
		extend: {
			colors: {
				paper: "#0a0a0a / <alpha-value>",
				paper2: "#0d0f13 / <alpha-value>",
				paper3: "#12151b / <alpha-value>",
				ink: "#eaf1ff / <alpha-value>",
				ink2: "#cbd8ee / <alpha-value>",
				ink3: "#a8b6cf / <alpha-value>",
				muted: "#93a1b8 / <alpha-value>",
				brass: "#409cff / <alpha-value>",
				brassink: "#06101f / <alpha-value>",
				coral: "#7cc0ff / <alpha-value>",
				ok: "#10d181 / <alpha-value>",
				warn: "#fb923c / <alpha-value>",
				danger: "#f85564 / <alpha-value>",
			},
			borderColor: {
				rule: "rgb(64 156 255 / 0.20)",
				rule2: "rgb(64 156 255 / 0.34)",
			},
			borderRadius: {
				card: "16px",
				input: "10px",
			},
			fontFamily: {
				display: "var(--font-display)",
				body: "var(--font-body)",
				mono: "var(--font-mono)",
			},
		},
	},
};