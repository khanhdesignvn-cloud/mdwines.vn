// Custom entry point for cPanel's "Setup Node.js App" (Phusion Passenger).
// Passenger starts this file directly with `node` and expects the app to
// listen on process.env.PORT — `next start` alone doesn't read that variable,
// so a thin custom server is needed here. Not used for local dev (`npm run dev`)
// or for hosts that run `next start` directly (e.g. `npm start`).
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(process.env.PORT || 3000, () => {
    console.log("MDWines Cellar ready on port", process.env.PORT || 3000);
  });
});
