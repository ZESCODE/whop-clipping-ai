// Stripe-return hook stub: no billing backend here, so nothing to resume.
import { useEffect } from "react";

export function useBackFromStripe(_cb: () => void) {
	useEffect(() => {
		/* no-op */
	}, [_cb]);
}