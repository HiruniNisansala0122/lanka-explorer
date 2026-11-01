# Individual demo guide — 10 minutes

Adapt the group guide to one presenter. Confirm the timing with your lecturer.

1. **1 minute — introduction:** introduce yourself, student ID, the project goal and individual responsibilities.
2. **4 minutes — walkthrough:** Home → Destinations → search/filter/sort → details → weather/forecast, dated LKR conversion, map → add a paid and a free place → My Trip → change travellers → remove a place → dark mode → mobile menu.
3. **3 minutes — code:** explain loadDestinations() and createCard(); URLSearchParams/Number()/find(); API requests and catch; storage and delegated remove buttons; CSS variables for dark mode.
4. **2 minutes — questions:** practise the topics below.

## Prepare
- Run through Live Server or your own deployed link, never file:///.
- Start with an empty trip using Clear trip. Theme/traveller state is stored separately.
- Use sample personal data for the enquiry demo; no email is sent.
- If an API fails, show the fallback and explain why other features continue working.
- Screenshots use three sample saved places; they do not change a visitor's empty initial state.

## Questions and short answers
- **Why store IDs only?** Details already live in JSON; this avoids duplicated, stale copies.
- **Why event delegation?** A listener on tbody catches clicks that bubble from generated Remove buttons, including buttons created on later renders.
- **Why fetch over a server?** file:/// security restrictions prevent reliable JSON fetching.
- **How does await help?** It waits for a promise before using its result without blocking the browser's interface.
- **Currency API down?** USD totals and trip editing still work; unavailable LKR figures are labelled.
- **How does the details URL work?** Read id, convert to Number, find the matching JSON object.
- **Why CSS variables?** One class overrides theme values consistently. Future variable names should describe roles such as surface/text instead of literal colours.
- **Is client validation enough?** No. A real business backend must validate again; this demo has no backend.
