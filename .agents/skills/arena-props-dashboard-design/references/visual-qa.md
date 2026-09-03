# Dashboard visual QA

## Required viewports

Check substantial dashboard changes at:

- 390px phone
- 768px tablet
- 1366 × 768 desktop
- 1440 × 900 desktop

## Browser review

Inspect the rendered page after data and lazy routes finish loading. Capture a screenshot and check:

- The primary task is obvious within a few seconds.
- Core text and numbers are readable without zooming.
- Player, selection, evidence, context, and action form clear groups.
- Color communicates meaning without becoming visual noise.
- Repeated rows feel like one system rather than separate cards.
- Popovers and drawers are not clipped.
- Sticky elements do not cover headings, values, or actions.
- Builder and sidebar states leave a usable research canvas.
- No horizontal page overflow exists; intentional table scrolling is discoverable.
- Keyboard focus is visible and the interface works without hover.
- Mobile controls do not overlap bottom navigation.

Compare the screenshot to the user's reference and stated preference. If the page still looks like raw text, a spreadsheet, or a wall of boxes, iterate before reporting completion.

## Regression checks

Run the relevant component tests, then:

```text
npm test
npm run lint
npm run build
```

Treat the existing large-bundle warning separately from the visual change unless the change materially increases it.
