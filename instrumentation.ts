/* Runs once when the server starts. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Start polling Spotify now, so the 15-minute-delayed "now playing" has history to show.
    const { startMusicFeed } = await import("@/lib/music-feed");
    startMusicFeed();
  }
}
