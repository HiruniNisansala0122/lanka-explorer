# Week 04 tests

- All 10 detail records: 3 forecast days, one map marker, correct free/paid conversion behaviour with controlled API fixtures.
- Cached exchange rate reused without another currency request.
- All-destinations map: 10 pins, filter-synchronised 3/0/10 pins, popup detail link, clear filters.
- All five pages at 375/768/1280px: no page overflow; mobile menus work. Home screenshots refreshed.
- Blocked currency, weather HTTP 503 and missing Leaflet library: friendly isolated fallbacks and no uncaught runtime errors. Invalid ID handled.

Weather/currency UI tests use controlled fixture responses, not evidence of live accuracy. Live endpoint HTTP checks separately returned 200 for Open-Meteo and Frankfurter from the build environment. External service availability varies. W3C validation remains a final manual check.

Live Chromium smoke test also passed for Sigiriya: current weather and three forecast days rendered, currency conversion displayed with reference date, and 15 map tiles loaded.
