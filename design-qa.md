# Cath Toss-style UI Design QA

## Comparison setup

- Source visual truth: `C:\Users\user\Pictures\Screenshots\스크린샷 2026-08-25 112339.png`
- Implementation screenshot: `C:\work\project\hackerton-financial\cath\design-qa-assets\implementation-home-risk.png`
- Side-by-side evidence: `C:\work\project\hackerton-financial\cath\design-qa-assets\home-comparison.png`
- Target viewport: 390 × 844 CSS px, light theme
- State: 홈 화면, 돌발 지출 후 유동성 위험 감지 상태
- Source pixels: 393 × 721; app crop 307 × 660
- Implementation pixels: full capture 1264 px wide; 390 × 844 CSS app rendered at 0.8 capture scale, cropped to 312 × 676 and normalized to 307 × 660
- Density normalization: both app crops compared at 307 × 660 pixels

## Full-view comparison evidence

The normalized side-by-side comparison confirms the same information order and mobile composition: status/header, available-funds hero, risk notice, money-management card, and persistent five-item navigation. Card widths, radii, section gaps, and semantic colors align closely with the source.

## Focused-region evidence

The full comparison remains readable enough to inspect the header badge, hero metrics, warning CTA, donut legend, note surface, and navigation icons. A separate crop was not required.

## Required fidelity surfaces

- Fonts and typography: system Korean sans-serif stack, optical weight hierarchy, compact supporting text, and large amount emphasis match the Toss-style source. Live amounts have different string lengths because they come from the existing calculation engine.
- Spacing and layout rhythm: 390 × 844 app frame, card order, horizontal insets, rounded corners, and bottom navigation match. Desktop preview now preserves the full 844px mobile frame.
- Colors and visual tokens: Toss blue, grey background, white surfaces, green connection state, red risk state, and segment-specific allocation colors are consistently applied.
- Image and icon fidelity: navigation, warning, reset, alert, and back controls use Phosphor vector icons instead of emoji or text glyph stand-ins. The cash-flow and allocation charts remain data-driven UI visualizations.
- Copy and content: Cath-specific labels and the existing calculated data are preserved. The reference's static sample amounts are intentionally not hardcoded.

## Comparison history

1. Earlier P2: Home connection status changed into a red cash-risk badge. Fixed by keeping account connection status green on Home and expressing liquidity risk only in the risk card.
2. Earlier P2: Bottom navigation and alerts used text symbols, and transaction chips escaped the mobile frame. Fixed with real Phosphor icons, TDS SegmentedControl/Chip components, and clipped horizontal chip scrolling.
3. Earlier P2: Apps-in-Toss provider emitted SafeArea bridge errors in the standalone browser. Fixed by using the core `TDSMobileProvider`; the final interaction run has no console errors.
4. Earlier P2: Header, hero, and risk-card proportions drifted from the reference. Fixed by normalizing the desktop preview to a 390 × 844 frame and retuning vertical spacing.

## Remaining P3 polish

- The reference uses static sample balances and the Korean wordmark, while the implementation displays live mock-engine balances and the current `Cath` service name.
- The production icon set could later be replaced with official brand-owned icons if those assets become available.

## Interactions verified

- Bottom-tab navigation
- Transaction filter and demo transaction creation
- Risk recalculation and optimization proposal
- TDS checkbox consent and approval execution
- Approved-plan success state
- Browser console checked: no application errors in the final run

final result: passed
