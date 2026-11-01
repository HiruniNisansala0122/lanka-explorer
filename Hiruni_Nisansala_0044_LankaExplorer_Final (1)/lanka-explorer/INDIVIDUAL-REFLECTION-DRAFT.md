# Individual reflection — editable draft (approximately 150 words)

**Student:** Hiruni Nisansala — 0044

This is an AI-assisted draft based on the project features, not a statement of work you have personally completed. Rewrite it to accurately describe your own learning and contributions before submitting.

## Suggested reflection

In this individual project, I brought together semantic HTML, responsive CSS and JavaScript to develop Lanka Explorer. The application presents Sri Lankan destinations, supports searching and filtering, and displays weather, currency conversions and interactive maps. I also worked with browser storage to maintain a trip list, traveller count and theme preference between visits.

The most challenging area was keeping the visible interface consistent with saved state. Adding or removing a destination needed to update the buttons, navigation counter, trip rows and budget together. Separating storage helpers from rendering functions made this process easier to understand and test. Another important lesson was handling external API failures without stopping the rest of the application.

I would next improve loading performance, verify all tourism fees directly with official operators, and add automated accessibility checks. Before describing these features in my presentation, I will review each function, reproduce the tests myself and make sure I can explain both the implementation and its limitations.
