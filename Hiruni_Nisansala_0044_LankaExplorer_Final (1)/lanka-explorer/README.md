# Lanka Explorer — Final Individual Project (Weeks 01–05)

**Student:** Hiruni Nisansala  
**Student ID:** 0044  
**Tagline:** Discover the Pearl of the Indian Ocean  
**Live URL:** Not deployed — hosting is optional in the lab guide.

## Project
A front-end travel discovery and entry-fee planning app for Sri Lanka. This individual adaptation combines all five weekly labs. The student is responsible for planning, content, JSON data, UI implementation and testing; no invented group members are listed. Replace the name, student ID and email placeholders and confirm individual submission permission with your lecturer.

## Features
- Five linked semantic HTML5 pages with a consistent shared header/footer, skip link, responsive Flexbox navigation, CSS Grid cards and a keyboard-accessible mobile menu.
- Ten destinations across Heritage, Beach, Nature and Wildlife; exactly three featured entries. JSON drives cards and details without hard-coded destination cards in HTML.
- Case-insensitive name/district/description search, category filters, name/fee sorting, result count, clear filters and matching map pins.
- URL-driven details, correct tab titles and invalid-ID messages.
- Current weather, humidity/wind and a three-day forecast with weather icons and Sri Lanka time.
- Latest available USD/LKR reference rate with its actual date; one cached request per page, shared across concurrent callers. Paid cards and detail pages display approximate LKR values.
- Leaflet/OpenStreetMap maps, popup detail links, visible attribution and missing-library/tile failure messages.
- Add/remove trip toggles on cards and details, duplicate protection, saved navigation count and reload persistence.
- Trip rows, delegated Remove buttons, confirmed Clear trip, empty state and whole-number traveller counts 1–20. USD/LKR totals cover the whole group; highest entry-fee destination and its budget percentage are shown.
- Saved light/dark mode; first visit follows the OS preference. Fixed-colour text remains readable on hero images, badges and maps. Reduced-motion preference is respected.
- Local enquiry validation with all errors together, future/today optional date, one or more interests and a 500-character message limit. Success is explicitly a demo: no enquiry is transmitted or stored.
- Loading spinners, API timeouts, failure isolation, malformed-storage handling and page-memory fallback when browser storage is unavailable.

## Run locally
1. Extract the ZIP and open the `lanka-explorer` folder in Visual Studio Code.
2. Install Live Server by Ritwick Dey.
3. Right-click `index.html` → **Open with Live Server**.
4. Do not open through file:///; JSON uses fetch(). No package installation, build command, database or secret key is needed.

Alternatively, run `python -m http.server 5500` from the site folder and open http://localhost:5500/ . Internet is required for Google Fonts, weather, exchange rates and map tiles; system font fallbacks and friendly API messages handle unavailable services.

## Project structure
- `index.html`, `destinations.html`, `details.html`, `trip.html`, `about.html`
- `css/style.css` — shared theme, numbered sections, responsive styles
- `js/app.js` — numbered functions for pages, APIs, storage and themes
- `data/destinations.json` — ten typed records; optional imageSmall/imageLarge fields for WebP delivery
- `images/` — original photographs and optimised WebP derivatives
- `vendor/leaflet/` — local Leaflet 1.9.4 distribution and licence
- `screenshots/` — all five pages × 375px/1280px × light/dark = 20 final screenshots
- `audits/` — real mobile Lighthouse HTML and JSON reports
- `API-NOTES.md`, `HOSTING.md`, `TESTING-FINAL.md`, `DEMO-GUIDE.md`, `INDIVIDUAL-REFLECTION-DRAFT.md`

## APIs
Open-Meteo forecast endpoint; Frankfurter v2 USD/LKR rate endpoint; Leaflet with standard OpenStreetMap tiles. See API-NOTES.md for URLs, parameters, attribution and lessons. Leaflet is supplied locally rather than relying on a CDN at runtime. Reference currency rates may be dated before today due to publication schedules and are not bank quotes.

## Persistence and budget limitations
LocalStorage saves numeric destination IDs, traveller count and theme, not entire destination objects. It is per origin/browser/device, not account-based/cloud storage. Moving to a new hosted URL starts with separate state. Trip totals are indicative entry fees only: no accommodation, meals, transport, safari vehicles or extra taxes/service charges. All travellers use one illustrative foreign-adult price; no resident/child/SAARC pricing calculation is claimed.

## Destination data and image notes
Coordinates are approximate destination locations. Fees are indicative foreign-adult base values; free towns/beaches refer to public access, not individual paid attractions inside them. Reconfirm against official operators before travelling or final submission.

Tourism fee references consulted during the build:
- https://ouratravel.com/sri-lanka-tourist-attractions-guide/ — Sigiriya USD 35 and Polonnaruwa USD 30
- https://tuktukrental.com/sri-lanka-entrance-fees/ — Yala/Minneriya USD 25 base rates

These are tourism references, not direct operator verification. Original photo sources are in IMAGE-CREDITS.md; WebP files are resized derivatives of the same originals. Review each source image's exact author/licence attribution before public redistribution.

## CSS learning notes
`box-sizing: border-box` includes padding/borders in width. Flexbox arranges navigation/controls along one axis; Grid lays out cards in rows and columns. Desktop-first media queries at 768px and 480px override wider defaults; mobile-first uses min-width enhancements instead.

**Specificity:** `#enquiry-form label` is (1,0,1), stronger than `fieldset label` (0,0,2). The more specific `#enquiry-form fieldset label` (1,0,2) correctly overrides checkbox-label weight.

## JavaScript learning notes
The loader checks response.ok and awaits JSON parsing. filter() builds a fresh result array before sort(), retaining the source order. URLSearchParams yields text, so Number() is needed to compare IDs strictly. Rate requests are cached rather than fired repeatedly. Event delegation handles dynamically generated trip buttons. JSON text is escaped before HTML interpolation and form feedback uses textContent. Real applications require server-side validation as well.

## Testing and Lighthouse
Automated Chromium tests cover trip arithmetic/persistence, duplicate protection, removal/clear confirmation, traveller limits, malformed storage, blocked currency, themes and OS preference, mobile navigation, filter/map synchronisation, form validation and invalid IDs. See TESTING-FINAL.md and prior-week reports. Controlled API fixtures make totals repeatable; screenshots were captured with live API requests and sample trip data. All screenshots are examples, not live quotes.

Mobile Lighthouse results (local development server; simulated mobile throttling):

| Page | Performance | Accessibility | Best practices | SEO |
|---|---:|---:|---:|---:|
| Home | 76 | 100 | 100 | 100 |
| Details — Sigiriya | 56 | 100 | 100 | 100 |

These are actual audit results, not guarantees for a hosted copy. Both pages meet the guide's 90+ accessibility aim. Performance still needs work, especially dynamic layouts and third-party map/weather requests; local concurrent auditing and network latency affect scores. Full evidence is in audits/.

Two audit issues addressed: (1) the missing favicon request now has a real icon, eliminating its 404; (2) oversized images now use smaller WebP card variants and an optimised/preloaded hero. Image dimensions and reserved detail/weather space also reduce layout movement. No claim is made that all performance warnings are resolved.

## Final manual checks
- Replace identity/email placeholders and rewrite the reflection draft to reflect your own work and understanding.
- Validate all HTML at https://validator.w3.org/ and CSS at https://jigsaw.w3.org/css-validator/ . External W3C validation has not been completed here. JSON is parsed successfully in local tests.
- Review tourism facts, official fees and image author/licence credits.
- Practise the demo and explain the code yourself.
- Hosting is optional; follow HOSTING.md if you want a public URL. No public deployment has been made. After deployment, retest on phone/mobile data and add the real URL above.
