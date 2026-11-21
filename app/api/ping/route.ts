/** Tiny endpoint the terminal's `ping` command times. Never cached. */
export function GET() {
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
