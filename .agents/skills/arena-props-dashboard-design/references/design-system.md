# Arena Props dashboard visual system

## Character

Aim for a focused sports-research terminal with editorial polish: dark, confident, information-rich, and calm. It should feel closer to a premium analytics product than a spreadsheet or a collection of promotional cards.

## Color roles

- Base canvas: `#080808`
- Primary surface: approximately `#101212`
- Elevated surface: approximately `#151818`
- Hairline border: white at 5–8% opacity
- Primary text: zinc 100–200
- Secondary text: zinc 400–500
- Tertiary metadata: zinc 600
- Active and selected: `#14B8A6`
- Active hover and focus: `#2DD4BF`
- Premium identity: `#F5C542`
- Positive: `#22C55E`
- Negative: `#EF4444`
- Warning or mixed: `#F59E0B`

Use neutral hierarchy first. Do not use accent colors to decorate ordinary labels.

For hit-rate and confidence grading:

- 80–100: positive green
- 60–79: teal
- 40–59: amber
- 0–39: red

Apply the grade to the number, a dot, a thin bar, or a restrained wash. Do not turn every statistic into a separate colored tile.

## Typography

- Screen title: 18–24px, semibold or bold
- Section title: 14–16px, semibold
- Player and primary selection: 12–14px, semibold
- Core numeric data: 11–13px, semibold, tabular numerals
- Supporting text: 11–12px
- Labels and timestamps: 9–10px with moderate tracking

Avoid 7–8px text for information users must compare. Use weight and contrast before increasing the number of colors.

## Spacing and geometry

- Base spacing rhythm: 4, 8, 12, 16, 24px
- Dense table row target: 56–72px depending on controls
- General panel radius: 10–12px
- Control radius: 6–8px
- Use fully rounded pills only for filters, small statuses, or compact actions
- Prefer one enclosing surface with quiet row dividers over a border around every child

## Surfaces and depth

Create no more than three visible elevation levels on one screen. Use a soft shadow only for floating elements such as popovers, drawers, and active overlays. Avoid heavy glassmorphism, strong gradients, and neon glows.

## Motion

Use 150–200ms transitions for hover, selection, row expansion, and drawer movement. Motion should explain state changes, not run continuously. Respect reduced-motion preferences.
