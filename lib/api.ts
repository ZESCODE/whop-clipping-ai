// Minimal API stub for the marketing port. The real dashboard talks to the
// Clipping AI backend; the whop site only needs the plan list to render pricing
// and a safe failure for checkout (there is no billing backend here).

export const getToken = () => {
	try {
		return localStorage.getItem("os_token") || "";
	} catch {
		return "";
	}
};

export const setToken = (t: string) => {
	try {
		localStorage.setItem("os_token", t);
	} catch {
		/* ignore */
	}
};

export const clearToken = () => {
	try {
		localStorage.removeItem("os_token");
	} catch {
		/* ignore */
	}
};

export const getApiUrl = (path: string) => path;

// Plans mirror seo/data.js (hosted Clipping AI Cloud).
const STATIC_PLANS = [
	{ plan: "starter", interval: "month", amount: 1200, currency: "usd", minutes: 100, price_id: "price_starter_month" },
	{ plan: "starter", interval: "year", amount: 12000, currency: "usd", minutes: 100, price_id: "price_starter_year" },
	{ plan: "creator", interval: "month", amount: 2900, currency: "usd", minutes: 300, price_id: "price_creator_month" },
	{ plan: "creator", interval: "year", amount: 29000, currency: "usd", minutes: 300, price_id: "price_creator_year" },
	{ plan: "pro", interval: "month", amount: 5900, currency: "usd", minutes: 750, price_id: "price_pro_month" },
	{ plan: "pro", interval: "year", amount: 59000, currency: "usd", minutes: 750, price_id: "price_pro_year" },
];

export async function apiJson(path: string, init?: RequestInit): Promise<any> {
	if (path === "/api/billing/plans") return { plans: STATIC_PLANS };
	if (path === "/api/billing/checkout") {
		throw new Error("Checkout is not available in this preview. Sign in to the Clipping AI app to upgrade.");
	}
	throw new Error(`No backend for ${path}`);
}