# Cath History Chip Size Design QA

## Comparison setup

- Source visual truth: `C:\Users\user\AppData\Local\Temp\codex-clipboard-c669b33d-ed1e-4b54-bcc3-bfa8415d4a96.png`
- Implementation screenshot: `C:\work\project\hackerton-financial\cath\design-qa-assets\history-chip-size-final.png`
- Focused implementation crop: `C:\work\project\hackerton-financial\cath\design-qa-assets\history-chip-card-final.png`
- Combined comparison evidence: `C:\work\project\hackerton-financial\cath\design-qa-assets\history-chip-card-comparison.png`
- Viewport: 390 × 844 CSS px app frame, light theme, `#/history` default state
- Source pixels: 583 × 421
- Implementation pixels: 1264 × 880 full-browser capture; 362 × 222 focused card crop
- Density normalization: the source and focused card were aspect-fit side by side without stretching. Layout measurements were verified directly in CSS pixels.

## Full-view comparison evidence

The final history screen preserves the four-action 2 × 2 layout while reducing the visual weight of each chip. All labels and amounts stay inside their 157px columns, and the surrounding transaction card and bottom navigation remain unchanged.

## Focused-region evidence

The focused comparison shows the source's clipped large labels beside the corrected card. Final measurements are 157px per chip, 11px label text, 10.5px amount text, 44px rendered height, and 322px container client/scroll width. Every button reports `scrollWidth === clientWidth`, so no label or amount overflows.

## Required fidelity surfaces

- Fonts and typography: reduced from the accidental 16px inline value to 11px labels and 10.5px amounts with tightened letter spacing; text remains legible and untruncated.
- Spacing and layout rhythm: TDS internal chip padding is normalized to 6px; the 8px two-column gap and 44px touch target are preserved.
- Colors and visual tokens: existing Toss grey chip surfaces and semantic text colors are unchanged.
- Image quality and asset fidelity: no image assets are involved in this focused correction; existing Cath header logo remains unchanged and sharp.
- Copy and content: transaction labels, signed amounts, reset label, and all behavior are preserved.

## Comparison history

1. P2: the source state used an invalid `fontsize: '16px'` inline style and TDS default inner padding, causing long labels to reach or cross the pill boundary.
2. Fix: removed the invalid inline style, separated label and amount into a controlled content wrapper, and applied compact values to the actual TDS `ChipItem` inner element.
3. Post-fix evidence: all four chips fit with no horizontal overflow; browser capture and focused comparison show fully visible copy.

## Interactions verified

- History filter and demo transaction controls remain rendered.
- Demo chip buttons remain clickable.
- Container and all four buttons have no measured overflow.
- Browser console checked: no application errors.
- `npm run build` passed.
- Domain tests: 3 passed.

## Findings

- No actionable P0, P1, or P2 differences remain.

final result: passed
