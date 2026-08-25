# Cath Logo and History UI Design QA

## Comparison setup

- Source visual truth: `C:\Users\user\Downloads\cath_logo-removebg-preview.png` and `C:\Users\user\Downloads\cath_logo-2.png`
- Implementation screenshots: `C:\work\project\hackerton-financial\cath\design-qa-assets\root-lockup-final.png` and `C:\work\project\hackerton-financial\cath\design-qa-assets\history-logo-grid-final.png`
- Combined comparison evidence: `C:\work\project\hackerton-financial\cath\design-qa-assets\root-logo-comparison.png` and `C:\work\project\hackerton-financial\cath\design-qa-assets\history-logo-comparison.png`
- Target viewport: 390 × 844 CSS px app frame, light theme
- States: root onboarding introduction and `#/history` default filter
- Source pixels: lockup 309 × 322; mark 200 × 200
- Implementation pixels: root 1264 × 928; history 1264 × 880 full-browser captures containing the 390 × 844 CSS app frame
- Density normalization: source assets were aspect-fit without stretching; implementation assets were evaluated at their rendered CSS sizes (lockup 94px wide, header mark 34 × 34px).

## Full-view comparison evidence

The combined comparisons show the supplied transparent logo assets rendered without substitution, distortion, background boxes, or clipped edges. The root uses the full Cath lockup above a Toss-style left-aligned onboarding hierarchy. The history screen replaces the text title with the compact mark while preserving the page description and status badge. All four demo actions appear in a stable 2 × 2 grid inside the card.

## Focused-region evidence

- Root identity: the full lockup retains the wallet-road mark, Cath wordmark, and `cash + path` descriptor at the correct aspect ratio.
- Shell header: the mark-only asset retains transparency and is readable at 34 × 34px.
- History actions: measured container `clientWidth` and `scrollWidth` are both 322px; each column is 157px with an 8px gap, so no horizontal scrolling or clipped chip remains.

## Required fidelity surfaces

- Fonts and typography: existing Korean system font stack and Toss-style hierarchy are preserved; page-title text in the shell header is removed as requested.
- Spacing and layout rhythm: root cards are borderless 20px-radius white surfaces on a grey background. The logo, title, support copy, pill, cards, and fixed CTA have clear vertical separation.
- Colors and visual tokens: Toss blue/grey semantic tokens remain consistent, while the supplied navy/mint brand artwork is shown unchanged.
- Image quality and asset fidelity: both original PNGs are copied into `src/assets` and imported directly. Their alpha channel and aspect ratio are preserved; no SVG, CSS drawing, placeholder, or text approximation is used.
- Copy and content: existing Cath onboarding and transaction copy is unchanged. Only the shell's repeated `Cath` header title is replaced by the requested logo.

## Comparison history

1. P2: TDS Chip's built-in 20px group margin caused the 322px action area to report a 342px scroll width. Fixed by overriding the group margin, using a 2-column grid, and remeasuring at 322px client/scroll width.
2. P2: The root lacked the requested brand lockup and retained visually heavy bordered cards. Fixed by adding the supplied full lockup and applying a borderless Toss-style surface hierarchy.
3. Post-fix evidence: final root and history captures show the correct assets, all actions visible, and no application console errors.

## Interactions verified

- Root onboarding CTA remains available.
- `#/history` filters render correctly.
- Clicking `노트북 구매 -₩1,290,000` adds exactly one transaction.
- Demo actions are all visible without horizontal scrolling.
- Browser console checked: no application errors; only Vite/React development messages.
- `npm run build` passed.
- Domain test suite passed.

## Remaining P3 polish

- Production could replace the raster logo files with official vector exports if the brand team provides them; the requested PNG files are currently rendered sharply at their small display sizes.

final result: passed
