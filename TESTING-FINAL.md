# Final browser tests

- Trip add/remove toggles, card buttons, duplicate protection, persistence, 1/4-traveller USD/LKR arithmetic, 1–20 integer limits, delegated Remove, Clear cancel/confirm and empty state passed.
- Currency failure leaves trip editing and USD totals working.
- Malformed/duplicate/unknown saved IDs and invalid saved traveller count handled without a crash.
- Search/filter/map, free-price duplication fix, invalid ID and enquiry error/success regression checks passed.
- All five pages, light/dark, 375/1280px: no horizontal overflow, mobile menu works; theme toggle and persistence passed. No uncaught JS errors.
- Fresh visitor follows operating-system dark preference.
- Unavailable browser storage falls back to page memory with a visible persistence warning.

Controlled weather and currency fixtures were used for repeatable arithmetic and failure tests. See Week 04 notes for live API checks. These tests do not replace external HTML/CSS validation or post-deployment checks.
