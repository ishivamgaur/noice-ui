# Contributing to noiceui

## Adding a component (the whole workflow)

1. Write the source: `registry/ui/<name>.tsx`
   - Self-contained, TypeScript, `cn()` from `@/lib/utils` for classes
   - Accept `className` on every part (merged with `tailwind-merge`)
   - No hardcoded colors - use theme tokens (`bg-primary`, `text-muted-foreground`, …)
2. Add one entry to `registry/meta.json`
   - `name`, `title`, `description`, `category`
   - `dependencies` (npm) + `registryDependencies` (other noiceui components)
   - `usage` - minimal copy-paste example shown on the doc page
   - `props` - rows for the props table
3. Add a demo in `src/components/demos/<name>-demo.tsx` and register it in
   `src/components/demos/demos.tsx`
4. Run `npm run registry:build` - regenerates `public/r/*.json` + `registry.json`
5. Run `npm run build` - the doc page, gallery card, sidebar entry, sitemap,
   and llms.txt are generated automatically from the catalog. No other files needed.

## Motion rules

- Every animation uses `src/lib/motion.ts` (one spring, one `rise`, one
  stagger step). No ad-hoc durations or easings.
- Every animated piece respects `useReducedMotion` - see `HeroIntro`,
  `Spotlight`, and `Reveal` for the pattern.
- Scroll reveals wrap whole grids (`Reveal`), never cards with CSS hover
  transforms (motion's inline transform would override them).
- Card grids get `cv-auto` (content-visibility) so offscreen demos skip
  rendering until scrolled near.

## Conventions

- Component APIs mirror shadcn where one exists (`variant`/`size` via `cva`).
- Demos must render with zero props and zero providers.
- Docs pages live under `src/app/(library)` and share blocks from
  `src/components/docs` - don't build one-off page chrome.
- Icons: site chrome uses `lucide-react`. Registry components stay icon-free
  (no extra dependency for users) - render `children` or accept icon nodes instead.
- Never hand-edit `public/r/*.json` or `registry.json` - they're generated.
