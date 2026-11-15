// Pending-plan stubs: the real dashboard stashes a plan across sign-in. Here
// there is no sign-in, so these are inert.
const KEY = "os_pending_plan";
export const stashPendingPlan = (entry: unknown, _source?: string) => {
	try {
		localStorage.setItem(KEY, JSON.stringify(entry));
	} catch {
		/* ignore */
	}
};
export const readPendingPlan = () => {
	try {
		return JSON.parse(localStorage.getItem(KEY) || "null");
	} catch {
		return null;
	}
};
export const clearPendingPlan = () => {
	try {
		localStorage.removeItem(KEY);
	} catch {
		/* ignore */
	}
};