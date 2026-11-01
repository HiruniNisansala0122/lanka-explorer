# Week 04 API Notes

## Open-Meteo
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Parameters: each record's latitude and longitude; current temperature_2m, relative_humidity_2m, wind_speed_10m, weather_code; daily weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max; timezone=Asia/Colombo; forecast_days=3.
- Documentation: https://open-meteo.com/en/docs
- Learned: daily values are parallel arrays indexed by the same date; WMO codes need translation to human-readable conditions. Three forecast days include today. Current weather is a model estimate, not a guaranteed local station observation.
- Attribution: Weather data by Open-Meteo. https://open-meteo.com/ . Free access is intended for non-commercial use; follow current terms and limits.

## Frankfurter
- Endpoint: `https://api.frankfurter.dev/v2/rate/USD/LKR`
- Documentation: https://frankfurter.dev/
- Learned: v2 returns a single object with rate, base, quote and date. Use the latest returned reference date, not a promise of a live bank rate or today's publication on weekends. Conversion = USD fee × rate.
- Cache: one successful rate per page, also sharing an in-flight promise. A failed request clears the promise so retry is possible. No fabricated exchange rate fallback is used.

## Leaflet + OpenStreetMap
- Library: Leaflet 1.9.4, https://leafletjs.com/reference.html . Local distribution included with licence in vendor/leaflet.
- Tile endpoint: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- Documentation/policy: https://operations.osmfoundation.org/policies/tiles/
- Learned: map containers require explicit height. fitBounds frames a group of coordinates; markers use [latitude, longitude]. Tile attribution must stay visible. Avoid bulk tile downloads and prefetching; browser caching is respected by normal Leaflet tile requests.
- Attribution: © OpenStreetMap contributors, linked to https://www.openstreetmap.org/copyright on both maps.

## Failure and security notes
Browser fetch requires CORS permission from the remote service. Each JSON request checks HTTP status and times out after 15 seconds. API failures do not block destination descriptions, search or the enquiry form. Missing Leaflet and tile failures have separate fallbacks. No secret keys are stored. JSON strings are escaped before HTML insertion.

## Verification
Live HTTP requests to Open-Meteo and Frankfurter returned 200 during this build. A live browser smoke test displayed current conditions, three forecast days, an LKR conversion with its actual reference date, and 15 loaded OpenStreetMap tiles for Sigiriya. Values change; fixture tests verify UI behaviour independently of network availability. Full test notes are in TESTING-WEEK04.md.
