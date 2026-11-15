// Analytics no-op for the marketing port.
export const track = (_event: string, _opts?: unknown) => {};
export const identify = (_user: unknown, _opts?: unknown) => {};
export const reset = () => {};