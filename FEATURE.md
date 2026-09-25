# Feature log

Everything built for noiceui, point by point. `[x]` means done and verified;
`[ ]` is left to do.

Live at **https://ui.noicess.fun** - 31 components across 8 categories.

## Registry

- [x] shadcn-compatible registry serving static JSON
- [x] `public/r/<name>.json` per component, with source inlined in `files[].content`
- [x] `registry.json` index for discovery and MCP
- [x] Single source of truth: `registry/meta.json` drives everything
- [x] `scripts/build-registry.mjs` generates all output
- [x] `prebuild` hook so the registry regenerates on every build
- [x] Catalog `homepage` derived from `SITE_URL` instead of hardcoded
- [x] `SITE_URL` reads `NEXT_PUBLIC_SITE_URL`, fallback `https://ui.noicess.fun`
- [x] Per-component manifest with `dependencies`, `registryDependencies`, `usage`, `props`
- [x] `llms.txt`, `sitemap.xml`, `robots.txt` generated from the catalog
- [x] `/api/source` route so displayed code can't drift from installed code

## Components (31)

Baseline was 11. Added 20.

- [x] **Batch 1** - accordion, gauge, loader-set, avatar-stack, number-stepper, expanding-search
- [x] **Batch 2** - otp-input, code-block, gooey-nav, command-palette, magnetic-button, text-scramble, compare-slider, slide-to-confirm
- [x] **Batch 3** - hold-to-delete, tilt-card, segmented-control, sparkline, task-list, word-rotator
- [x] A live demo per component, registered in the `DEMOS` map
- [x] Every component dogfooded somewhere on the site (FAQ, tabs, gallery, hero)

By category: General 8, Animation 6, Text 4, Effects 4, Navigation 4, Layout 2,
Backgrounds 2, Data 1.

## Component correctness

Found by a full audit of all 31 files. These were real defects, not polish.

**Self-containment** - a copied component must work in a project that knows
nothing about this site.

- [x] `border-beam` shipped no keyframes; now emits its own per instance
- [x] `marquee` shipped no keyframes; now self-contained
- [x] Brand colour tokens given literal fallbacks in spotlight, gooey-nav,
      compare-slider, glare-card, sparkline

**Interaction**

- [x] `hold-to-delete` fired on right-click; now primary button only
- [x] `hold-to-delete` never deleted at `duration={0}` (no transitionend)
- [x] `hold-to-delete` dropped consumer props entirely
- [x] `slide-to-confirm` confirmed on a cancelled gesture
- [x] `code-block` reported success when the copy failed
- [x] `expanding-search` left consumer query state stale on Escape
- [x] `segmented-control` divided by zero on an empty `options` array
- [x] `word-rotator` documented letter-matching it never implemented; rewritten

**Accessibility**

- [x] `segmented-control` moved roving tabindex but never moved DOM focus
- [x] `gauge` had no value semantics; now `role="meter"` kept in sync with the animation
- [x] `command-palette` hardcoded ids, so two instances broke each other
- [x] `command-palette` had no focus trap, no focus restore, no scroll lock
- [x] `marquee` announced every item twice and tabbed through it twice
- [x] `otp-input` truncated browser autofill to one character
- [x] `otp-input` labelled every slot "Digit" even in letters mode
- [x] `otp-input` signalled error and success by colour alone
- [x] `text-scramble` declared `role="button"` with no click handler
- [x] `text-reveal` claimed reduced-motion support it never implemented
- [x] Focus outlines removed without replacement in marquee, code-block, expanding-search
- [x] `avatar-stack` documented image URLs but only rendered initials

**Cleanup**

- [x] Dead `pendingRef`, `moveTo`, `FitBox`, hover state removed
- [x] Unused `getComponentsByCategory`, `drift-up` / `drift-down` keyframes removed
- [x] `border-beam` `size` prop was inert; now wired
- [x] Timers and animations disconnected on unmount

## Infrastructure

- [x] `next-themes` removed; it renders a `<script>` child that React 19 refuses
      to execute from component render
- [x] Own theme provider: context, persistence, OS sync, cross-tab sync
- [x] Anti-flash script moved to the document head where it actually belongs
- [x] Theme switch made synchronous - previously one frame painted the old theme
- [x] Global guard suppresses transitions only during a theme swap
- [x] Gauge hydration fix: `Math.cos`/`sin` differ in the last bit between Node
      and the browser, so coordinates are rounded

## Design

Built against the frontend-design skill. The rule applied throughout: spend
boldness in one place, and cut anything that only decorates.

**Typography**

- [x] Single family, Geist Sans + Geist Mono (same as shadcn)
- [x] Scale: 34/46px hero, 2xl detail h1, 15px body at `max-w-xl`
- [x] Weights capped at 600; all bold/extrabold/black removed

**Template chrome removed**

- [x] Tracked-out ALL-CAPS eyebrows, everywhere
- [x] Decorative `01 / 02 / 03` ordinals, replaced with hairline dividers
- [x] SaaS card kit - uniform radius, one soft shadow, hover lift everywhere
- [x] Brand-coloured mono labels encoding no information
- [x] Mid-dot meta strings and trailing arrows on every link

**Layout**

- [x] Sidebar: one menu on desktop and mobile, text-only active, edge fades
- [x] Gallery: ruled reference table, not a card grid
- [x] Featured: bento, width assigned but height always follows the content,
      so nothing is ever cropped
- [x] Featured previews stay live; navigation is a separate deliberate arrow
- [x] Detail page: dots removed, tab row is the heading, spacing on one grid
- [x] Footer: the 31-item component column removed as sidebar duplication

**Motion**

- [x] Zoom entrance replaces fade-and-slide
- [x] All colour and opacity transitions removed from site chrome
- [x] Hero collage: cursor has zero influence on the camera
- [x] Camera centres exactly at any zoom; the transform origin bug fixed
- [x] Tour holds at each end instead of cutting between states

**Surfaces**

- [x] Scrollbar: 3px, near-invisible at rest, solid on hover
- [x] Logo: snapping-tile mark, viewBox cropped to artwork, used as favicon
- [x] Stack row: marks not chips, no brand hues, all five linked
- [x] `CopyableArtifact` - whole line is the button, for install commands
- [x] Hero scribble and moving stack strip removed, then the stack restored

## Documentation

- [x] Installation guide
- [x] Theming guide - corrected, it told users to change `--primary` for the
      brand when the accent is `--brand`, and showed a `ThemeProvider` prop
      that no longer existed
- [x] MCP guide
- [x] `SETUP.md` - deploy, DNS, registry protocol, verification
- [x] Shared `Token` component, replacing ~30 copy-pasted inline code spans

## Remaining

- [ ] Reduced-motion coverage is still thin on several components: avatar-stack,
      border-beam, glare-card, loader-set, number-stepper, scroll-progress
- [ ] Timer cleanup outstanding on command-palette rAF callbacks,
      expanding-search focus rAF, gauge Web Animation, slide-to-confirm reset timer
- [ ] `props` spread ordering in ~8 files lets a consumer replace a handler the
      component depends on
- [ ] `registry.json` items carry no `files` array, so index-only readers see
      components with no source attached
- [ ] Verify MCP install works against the live domain
- [ ] Component pages render their demo twice - once in the stage, once in the
      preview tabs
- [ ] `README.md` is still create-next-app boilerplate

## Verify

```bash
npm run registry:build && npm run build && npm run lint
npx shadcn@latest add https://ui.noicess.fun/r/button.json
```
