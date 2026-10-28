// Deliberately not toLocaleString: this renders on the server and again in the
// browser, and locale-dependent grouping can differ between the two, which
// shows up as a hydration mismatch. Manual grouping is identical everywhere.
export function formatUGX(amount: number): string {
  return "UGX " + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
