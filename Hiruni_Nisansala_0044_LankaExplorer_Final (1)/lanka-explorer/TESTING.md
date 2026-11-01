# Week 03 browser test results

Automated local Chromium checks:

- Featured cards, all 10 cards, case-insensitive search, district/description search, combined category filter, both fee sorts, no-results count and clear filters passed.
- All 10 detail IDs, missing ID and invalid IDs passed.
- Empty-form errors, past date, 501-character message rejection and successful local demo/reset passed.
- All five pages checked at 375px, 768px and 1280px: no horizontal page overflow; mobile menu and Escape work.
- Simulated JSON 404 produces friendly messages on Home, Destinations and Details. No uncaught JavaScript errors in normal tests.

External W3C HTML/CSS validation still requires a final manual check. Screenshots were refreshed from the dynamic Home page.
