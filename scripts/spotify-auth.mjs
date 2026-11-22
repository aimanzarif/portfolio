#!/usr/bin/env node
/*
 * One-time Spotify login for zarep.my's radio. Prints the SPOTIFY_REFRESH_TOKEN for the server .env.
 *
 *   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-auth.mjs
 *
 * Run it on a computer with a browser (your Mac). The Spotify app's Redirect URI must be exactly
 * http://127.0.0.1:8888/callback . Scopes are read-only: what's playing, recently played, your playlists.
 * Needs no packages: plain Node 18+.
 */
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first, e.g.\n  SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-auth.mjs");
  process.exit(1);
}

const redirect = "http://127.0.0.1:8888/callback";
const state = randomBytes(16).toString("hex");
const scope = ["user-read-currently-playing", "user-read-recently-played", "playlist-read-private"].join(" ");
const url = `https://accounts.spotify.com/authorize?${new URLSearchParams({ response_type: "code", client_id: id, scope, redirect_uri: redirect, state })}`;

const server = createServer(async (req, res) => {
  const u = new URL(req.url ?? "/", redirect);
  if (u.pathname !== "/callback") return res.writeHead(404).end();
  if (u.searchParams.get("state") !== state) return res.writeHead(400, { "Content-Type": "text/plain" }).end("State mismatch. Start again.");
  const code = u.searchParams.get("code");
  if (!code) return res.writeHead(400, { "Content-Type": "text/plain" }).end(`Spotify said: ${u.searchParams.get("error") ?? "no code"}`);
  try {
    const r = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
    });
    const json = await r.json();
    if (!json.refresh_token) throw new Error(JSON.stringify(json));
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Done! Go back to the terminal. You can close this tab.");
    console.log("\nAdd this line to the server .env (keep it secret):\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" }).end("Token exchange failed, see the terminal.");
    console.error("Token exchange failed:", e.message);
  } finally {
    server.close();
  }
});

server.listen(8888, "127.0.0.1", () => {
  console.log("1. Open this link in your browser and log in to Spotify:\n");
  console.log(url + "\n");
  console.log("2. Waiting for Spotify to send you back to http://127.0.0.1:8888/callback ...");
});
