// A single promise that resolves once the vendored jQuery theme bundle has
// finished loading and its one-time setup has run. Client components that need
// jQuery/owl-carousel/AOS await this before touching those globals, so they
// never race the async <script> loads. On the server it resolves immediately
// (effects that use it only ever run in the browser anyway).
let resolveReady: (() => void) | undefined;

export const themeReady: Promise<void> =
  typeof window === 'undefined'
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        resolveReady = resolve;
      });

export function markThemeReady(): void {
  resolveReady?.();
}
