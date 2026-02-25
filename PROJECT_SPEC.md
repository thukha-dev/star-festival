# Star Festival - Project Specification

## 1. Project Overview

**Project Name:** Star Festival  
**Concept:** A modern, emotional, multilingual Tanabata festival web experience where users write wishes and hang them on an animated bamboo tree.  
**Design Mood:** Dreamy, magical, elegant, calm, and peaceful.

## 2. Goals and Success Criteria

### Primary Goals
- Deliver a visually striking Tanabata-themed hero experience with strong emotional tone.
- Enable users to create and submit wishes via interactive Tanzaku cards.
- Provide smooth, subtle micro-interactions that feel magical but not flashy.
- Support multilingual UI for English, Japanese, and Burmese (Myanmar).
- Ensure responsive, accessible behavior across desktop and mobile devices.

### Success Criteria
- Users can switch language instantly without page reload.
- Wish submission flow is intuitive and completes in under 20 seconds.
- Animations remain smooth (~60 FPS on modern devices).
- Mobile experience preserves visual identity and usability.
- UI remains legible and accessible in all three supported languages.

## 3. Target Audience

- Festival visitors and culture enthusiasts.
- Users seeking calming, emotional, aesthetic digital experiences.
- Global audience requiring multilingual support.

## 4. Visual and Art Direction

### Overall Style
- Minimal elegant UI with soft glows and restrained visual effects.
- Avoid cartoonish illustration style.
- Avoid aggressive neon or over-saturated elements.

### Color Direction
- **Background gradient:** Deep navy -> indigo.
- **Accent glow:** Soft cyan/white with low opacity bloom.
- **Tanzaku colors:** red, blue, green, yellow, purple.
- **Glass panel:** translucent dark-blue with subtle blur and light edge.

### Typography
- **Japanese heading font:** elegant serif Japanese typeface.
- **English font:** clean modern sans-serif.
- **Myanmar font:** highly legible Burmese font with correct line-height and glyph rendering.

Suggested fallback stacks:
- Japanese headings: `"Noto Serif JP", "Hiragino Mincho ProN", serif`
- English UI/body: `"Manrope", "Inter", "Segoe UI", sans-serif`
- Myanmar text: `"Noto Sans Myanmar", "Pyidaungsu", sans-serif`

## 5. Information Architecture

### Hero (Fullscreen)
- Full viewport height (`100vh`) landing section.
- Centered title (Japanese + English).
- Poetic subtitle line below title.
- Primary CTA button with glow-on-hover that scrolls to and focuses the wish input panel.
- Secondary CTA button that triggers an optional intro interaction/animation sequence.
- Main interactive bamboo area in visual center.
- Floating wish input panel at bottom area.
- Top-right language switcher.

### Language Switcher
- Position: top-right, fixed or absolute in hero.
- Options: `English`, `日本語`, `မြန်မာ`.
- Active language visibly highlighted.
- Accessible via keyboard and screen reader labels.

## 6. Core UI Components

### 6.1 Night Sky Background
- Layered deep gradient base.
- Subtle twinkling stars (low density, random opacity pulsing).
- Soft Milky Way glow (blurred radial/linear light texture).
- Occasional shooting star animation (infrequent, non-distracting).

### 6.2 Bamboo Tree Centerpiece
- Tall illustrated bamboo tree centered in viewport.
- Gentle sway animation (slow, natural oscillation).
- Branches support hanging Tanzaku cards.
- Motion should be subtle and continuous, never exaggerated.

### 6.3 Tanzaku Cards
- Slim vertical rounded rectangle.
- Small thread/string anchor at top.
- Soft shadow and slight depth.
- Color variants: red, blue, green, yellow, purple.
- Initial resting rotation is slightly randomized per card.

#### Interactions
- `hover`: gentle swing + soft glow enhancement.
- `click/tap`: open wish detail modal.

### 6.4 Wish Detail Modal
- Triggered by selecting a Tanzaku.
- Background dim + blur overlay.
- Modal content includes:
  - Wish text
  - Optional nickname
  - Card color indicator
- Smooth fade/scale entrance.
- Dismiss with close button, overlay click, or `Esc`.

### 6.5 Wish Input Panel (Glassmorphism)
- Floating near bottom center on desktop; bottom sheet style on mobile.
- Frosted glass effect:
  - semi-transparent background
  - backdrop blur
  - thin border highlight

#### Fields and Controls
- Color picker (5 circular buttons matching Tanzaku palette).
- Wish textarea (max 120 chars).
- Optional nickname input.
- Character counter (`0/120`).
- Primary action: `Hang My Wish`.

#### Validation
- Wish text required (non-empty).
- Max length strictly enforced at 120 characters.
- Basic moderation required before public display (blocked words/profanity filter + simple spam heuristics).
- Nickname optional; if empty show localized anonymous label.

## 7. User Flow

1. User lands on fullscreen hero and sees animated bamboo scene.
2. User optionally switches language.
3. User can use primary CTA to jump directly to the wish panel, or use secondary CTA for intro interaction.
4. User enters wish, selects card color, adds optional nickname.
5. User clicks `Hang My Wish`.
6. Submission micro-interaction plays:
   - new card appears near panel,
   - floats upward to tree,
   - settles with slight swing,
   - sparkle particles briefly appear.
7. Wish is persisted to database with moderation state.
8. Approved wishes are publicly visible and can be opened via modal.

## 8. Motion and Micro-interactions

### Motion Principles
- Smooth easing (`ease-out` / cubic-bezier with soft landing).
- Keep movements slow to medium speed.
- Prioritize calm, magical atmosphere.

### Required Animations
- Bamboo sway loop.
- Star twinkle loop.
- Occasional shooting star traverse.
- Tanzaku hover swing/glow.
- Wish submit float-up path.
- Sparkle burst on successful submission.
- Modal fade+scale transitions.

### Performance Targets
- Prefer CSS transforms/opacity for animation.
- Avoid heavy repaint effects across full viewport.
- Maintain fluid performance on mid-range mobile devices.

## 9. Responsive Behavior

### Desktop
- Bamboo fully centered and dominant visual.
- Panel floats with comfortable margins from bottom.
- Title/subtitle centered above main interaction zone.

### Mobile
- Maintain immersive hero, reduce visual clutter.
- Scale bamboo to fit without clipping key branches.
- Convert input panel into compact bottom sheet style.
- Ensure tap targets >= 44px.
- Reduce particle density and star count for performance.

## 10. Accessibility and Usability Requirements

- Sufficient contrast for all text over dark background.
- Keyboard navigation for language switcher, form controls, modal actions.
- Visible focus states for interactive elements.
- ARIA labels for icon-only or color-only controls.
- Respect `prefers-reduced-motion`:
  - dampen or disable non-essential animations,
  - keep core interaction understandable without motion.

## 11. Content and Localization

### Supported Languages
- English (`en`)
- Japanese (`ja`)
- Burmese/Myanmar (`my`)

### Localization Requirements
- Externalized translation keys for all user-facing strings.
- Font fallback per language script.
- Adjustable line-height/letter-spacing for script readability.
- No hardcoded text inside reusable components.

## 12. Technical Implementation Notes

### Suggested Frontend Stack
- Any modern component-based frontend framework or vanilla modular JS.
- CSS architecture with tokens/variables for theme consistency.
- Supabase for persistence and read APIs.

### Recommended Structure
- `HeroSection`
- `LanguageSwitcher`
- `BambooScene`
- `TanzakuCard`
- `WishInputPanel`
- `WishModal`
- `ParticleLayer`

### State Model
- Current language
- Wish list collection
- Form state (text, nickname, color)
- Active modal wish
- Animation state for submission
- Submission/moderation state (`pending`, `approved`, `rejected`)

### Persistence and Moderation Requirements
- Use Supabase as the system of record for wishes.
- Persist each wish with at least: `id`, `wish_text`, `nickname`, `color`, `language`, `status`, `created_at`.
- `status` lifecycle:
  - `pending`: newly submitted and not yet publicly shown.
  - `approved`: visible in public tree/modal.
  - `rejected`: hidden from public list.
- Public feed must query only `approved` wishes.
- Apply client-side basic validation and moderation checks before submit; enforce moderation again server-side.
- Max length validation (120 chars) must be enforced both client-side and server-side.

## 13. Acceptance Criteria Checklist

- Fullscreen hero with dreamy night-sky background implemented.
- Central animated bamboo with hanging Tanzaku cards implemented.
- Tanzaku hover + click modal interaction implemented.
- Glassmorphism wish panel with required fields and counter implemented.
- Submit sequence (float, sparkle, settle) implemented smoothly.
- Language switcher for EN/JA/MY implemented and functional.
- Typography per-language configured and readable.
- Responsive layout verified for desktop and mobile.
- Reduced-motion accessibility behavior implemented.
- Shooting star animation appears occasionally and subtly.
- Primary CTA scrolls and focuses wish panel; secondary CTA triggers intro interaction.
- Wishes are persisted in Supabase and approved wishes are publicly visible.
- Basic moderation and validation are enforced before public visibility.
- Empty nickname displays localized anonymous label.

## 14. Risks and Mitigations

- **Risk:** Too many layered effects reduce frame rate.  
  **Mitigation:** Cap particle count, prefer transform-based animation, throttle star density on mobile.

- **Risk:** Burmese or Japanese text clipping in fixed-height UI controls.  
  **Mitigation:** Use script-specific line-height and test real localized strings.

- **Risk:** Visual style becomes too flashy.  
  **Mitigation:** Keep glow intensity and animation amplitude intentionally low.

## 15. Finalized Product Decisions

1. Wishes are persisted in Supabase.
2. All approved wishes are publicly visible.
3. Basic moderation and length validation are required.
4. Empty nickname defaults to localized `Anonymous`.
5. Primary CTA scrolls to and focuses the wish panel; secondary CTA can trigger an intro interaction.
6. Use the proposed font stacks for current implementation.
