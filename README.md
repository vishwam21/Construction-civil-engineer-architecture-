# SQUARE ARCHITECTS — Website

A responsive, static website for SQUARE ARCHITECTS (Ashwin Patel), built with
plain HTML5, CSS3 and vanilla JavaScript. No build step or framework required.

## File structure

```
square-architects/
├── index.html              Main page (all sections)
├── favicon.svg              Site icon
├── css/
│   └── styles.css           All styling
├── js/
│   └── script.js            Nav, cards, animations, form handling
├── apps-script/
│   └── Code.gs               Google Apps Script backend template (optional)
└── README.md                 This file
```

Keep this folder structure intact — `index.html` links to `css/styles.css`
and `js/script.js` using relative paths.

## Running it locally

No build tools are needed. Just open `index.html` in a browser, or serve the
folder with any static server, e.g.:

```
cd square-architects
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publishing on GitHub Pages

1. Create a new GitHub repository (e.g. `square-architects`).
2. Push the contents of this folder to the repository root (or to a `/docs`
   folder, whichever you prefer to configure).
3. In the repository, go to **Settings > Pages**.
4. Under **Source**, choose the branch and folder containing `index.html`.
5. Save. GitHub will publish the site at
   `https://<your-username>.github.io/square-architects/`.

## Connecting the consultation form to email

The form on the site (Name, Number, Email, Description) does **not** send
email on its own — per the project requirements, no email credentials are
stored in the frontend JavaScript. Instead, it is wired to call an endpoint
you control:

1. Open `apps-script/Code.gs` — it contains full setup steps in its comments.
2. Follow those steps to deploy it as a Google Apps Script Web App. This will
   email every submission to `patelharsha680@gmail.com` and, optionally, log
   it to a Google Sheet.
3. Copy the deployment URL you receive from Apps Script.
4. Open `js/script.js` and paste the URL into the `CONSULTATION_ENDPOINT`
   constant near the top of the file:

   ```js
   var CONSULTATION_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```

5. Save and redeploy the site. Submissions will now be emailed automatically.

Until this is configured, the form still validates input correctly, but will
show a message asking the visitor to email the practice directly instead of
silently failing.

### Alternative backends

Any form backend that accepts a JSON POST body of
`{ name, number, email, description }` will work in place of Apps
Script — for example Formspree, Getform, or a small serverless function you
host yourself. Just point `CONSULTATION_ENDPOINT` at that service's URL.

## Editing content

- **Services / project types**: edit the `services` and `projectTypes`
  arrays near the top of `js/script.js`. Cards are generated from this data,
  so you don't need to touch `index.html` to add, remove, or reword one.
- **Colors and type**: all design tokens are defined as CSS custom
  properties at the top of `css/styles.css` (`:root { ... }`).
- **Copy**: section text lives directly in `index.html`.

## Notes

- The favicon is an SVG placeholder using the brand mark. Replace
  `favicon.svg` with a PNG/ICO version if you need broader favicon support,
  and update the `<link rel="icon">` tag in `index.html` accordingly.
- Add a real Open Graph image at `assets/og-image.png` and it will be picked
  up automatically by the existing `<meta property="og:image">` tag.
- The consultation form includes a hidden honeypot field for basic spam
  filtering; no visible behavior change for real visitors.
