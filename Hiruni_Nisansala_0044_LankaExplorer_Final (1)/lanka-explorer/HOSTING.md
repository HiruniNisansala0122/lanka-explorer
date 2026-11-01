# Hosting guide — optional

Week 05 Task 6 explicitly makes hosting **optional**. You can demonstrate the complete project with VS Code Live Server. A public link is useful for a CV or remote demonstration, but confirm any extra lecturer requirements.

## Fastest option: Netlify Drop
1. Replace Hiruni Nisansala, 0044 and your-email@example.com in the project.
2. Extract the final ZIP. Find the `lanka-explorer` folder containing `index.html`.
3. Visit https://app.netlify.com/drop and sign in to your own account if requested.
4. Drag that folder onto the drop area. No build command, API key or backend is required.
5. Open the assigned HTTPS address. Rename the site in its settings if desired.
6. Add the actual public URL to README.md. Do not paste your account password into this chat.

**Important:** Upload the site folder, not a folder which merely contains another lanka-explorer folder. `index.html` must be at the published root. Keep css/, js/, data/, images/ and vendor/ intact. audits/ and screenshots/ are submission evidence and can be omitted from the hosted copy to reduce upload size. Keep them in the final submission ZIP.

## Alternative: GitHub Pages
1. Create a public repository named `lanka-explorer` in your own account.
2. Upload the contents of the site folder, with `index.html` at the repository root.
3. In repository Settings → Pages, choose deployment from the main branch and `/ (root)`.
4. Open the generated `https://YOUR-USERNAME.github.io/lanka-explorer/` URL when deployment finishes.
5. No build process is needed. Relative asset and JSON paths work under the repository subpath.

## Post-deployment checks
- Test the live address on your phone using mobile data.
- Open every page and inspect images, weather, LKR conversion and both maps.
- Add a destination, reload, and check it stays in My Trip. Set traveller count and verify totals.
- Toggle dark mode and navigate to another page.
- Check the public version's browser console and rerun Lighthouse.
- LocalStorage is private to a browser/device **and origin**. Your local demo trip does not automatically transfer to a hosted URL. This is expected; there is no account/cloud sync.
- Maps and weather depend on external services and an internet connection. Error messages are part of the expected offline behaviour.

## Current publication status
No public deployment has been performed for you. The workspace live preview is a development preview, not a permanent public hosting link. Publishing makes the uploaded files public: remove personal details you do not want publicly visible.
