# Saugat Pokhrel · Personal Portfolio

A Japanese-inspired personal website about Saugat’s story, education, programming languages, skills, hobbies, and social links. It includes a shoji-style opening sequence on every page load, animated sakura branches and profile frame, scroll reveals, a pull-rope light/dark theme switch, user-supplied Japanese sound effects, and an owner-only site editor. The warm-paper light theme is the default. The theme changes only when the rope is pulled down (or held and released from the keyboard), and the connected cord and lantern move together. The Japanese-style MP3 attempts to play on every page load. Browsers may block autoplay; when they do, a dedicated “Play opening sound” button appears. Button sounds are enabled by default and can be turned off in the navigation. The sword-draw MP3 plays briefly on button and link hover.

The cookie notice records the visitor’s allow/decline choice in a first-party preference cookie. The private editor sets its HTTP-only session cookie only after the visitor allows essential cookies and signs in. Theme and sound settings are stored on the device; the site uses no advertising or analytics cookies.

## Run locally

Install Node.js, then open a terminal in this folder and run:

```powershell
node server.mjs
```

Open `http://localhost:4173`. No npm packages are needed.

## Admin sign-in and editing

The private `.env` file supplies `ADMIN_EMAIL` and `ADMIN_PASSWORD`. It is ignored by Git and must never be included in a public download or repository. The site editor is available at **Admin login** after sign-in. Sessions use an HTTP-only, same-site cookie and expire after 12 hours. Failed attempts are rate-limited.

The owner can edit their introduction, education, programming languages, skills, hobbies, spoken languages, social links, and portrait. Programming-language cards choose familiar built-in marks (JS, C, C++, HTML, CSS, Python) and give new names a monogram. Saving updates `content.json` on the server; export/import are also available in the editor.

## Contact form delivery

Messages are addressed to `saugatpokhrel069@gmail.com`. To deliver them, add `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL` to `.env`. Without these Resend settings, the form will report that delivery is not configured and show the direct email fallback.

## Publishing

For InfinityFree/Apache shared hosting, upload `.htaccess` into the same public folder as `index.html`; it routes clean page URLs and the PHP API. Upload the `api/` and `private/` folders too. Upload `.env` separately into the same folder as `index.html` so PHP can read `ADMIN_EMAIL` and `ADMIN_PASSWORD`. `.htaccess` denies web access to `.env`; never publish it in a repository. The admin editor can update `content.json` only if the host permits PHP to write that file. For Netlify, upload `_redirects` beside `index.html`; Netlify’s static hosting does not run this PHP API.

The included Node server remains available for local development and Node-compatible hosts. On InfinityFree, the PHP API handles sign-in, content saving, and the optional Resend contact form. Add `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL` to the private `.env` if you want email delivery. Never commit or publicly bundle `.env`; the local development server binds only to `127.0.0.1`.
# grimmy-s-portfolio
