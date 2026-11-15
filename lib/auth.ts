// Minimal auth stub for the marketing port. The OpenShorts landing only reads
// `billingEnabled` (to decide whether to show pricing) and `isSignedIn`
// (checkout gating). This whop build has no billing backend, so it presents as
// a signed-out visitor on the hosted (billing-on) product.
export function useAuth() {
	return {
		isSignedIn: false,
		loading: false,
		billingEnabled: true,
		user: null,
		plan: "free",
	};
}