# noice ui

Copy-paste React components for Tailwind CSS v4. You own every line.

There is no npm package. Components are copied into your project as source you
can read, edit, delete, or vendor. Nothing to version, nothing to upgrade.

**Live:** https://ui.noicess.fun

## Install

The registry speaks the shadcn format, so the shadcn CLI installs from it
directly.

```bash
npx shadcn@latest add https://ui.noicess.fun/r/button.json
```

Or register the namespace once in your `components.json` and use short names:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@noiceui": {
      "url": "https://ui.noicess.fun/r/{name}.json"
    }
  }
}
```

```bash
npx shadcn@latest add @noiceui/accordion
```

### Install from GitHub

The repository is itself a registry, so components install with no domain and no
`components.json` entry. The CLI reads `registry.json` and the sources straight
from the repo:

```bash
npx shadcn@latest add ishivamgaur/noice-ui/accordion
```

This keeps working if the site is down, and every install traces to a commit.
Pin a tag for a reproducible install:

```bash
npx shadcn@latest add ishivamgaur/noice-ui/accordion#v1.0.0
```

### Prerequisites

Every component imports a `cn()` helper from `@/lib/utils`, and reads the CSS
variables that theme the library. Both are covered in the
[installation guide](https://ui.noicess.fun/docs/installation).

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

If you already have one, you do not need to add it.

## MCP

Register the namespace, then let your agent pull components in from a plain
language request:

```bash
npx shadcn@latest mcp init @noiceui
```

Works with Cursor, Claude, and Copilot. See the
[MCP guide](https://ui.noicess.fun/docs/mcp).

## Components

31 components across 8 categories.

| Category | Components |
| --- | --- |
| General | Button, Accordion, Avatar Stack, Number Stepper, OTP Input, Code Block, Slide to Confirm, Task List |
| Animation | Marquee, Gauge, Loader Set, Magnetic Button, Hold to Delete, Tilt Card |
| Effects | Scroll Progress, Glare Card, Animated List, Border Beam |
| Text | Number Ticker, Text Reveal, Text Scramble, Word Rotator |
| Navigation | Expanding Search, Gooey Nav, Command Palette, Segmented Control |
| Layout | Card, Compare Slider |
| Backgrounds | Spotlight, Dot Grid |
| Data | Sparkline |

Each has a live demo, a props table, and a Source tab showing the exact file the
CLI writes.

### Design rules

So a copied component behaves the same way it did on the site:

- **Self-contained.** A component that needs a keyframe or custom property ships
  it. Nothing depends on this site's stylesheet.
- **Token-driven.** Colour, radius, and type come from CSS variables, so
  changing one token restyles everything.
- **Accessible.** Sliders take arrow keys, dialogs trap focus, animated
  decoration is `aria-hidden`, and reduced motion is respected.
- **Theme-agnostic.** Light and dark are the same code path.

Peer dependencies, all optional per component: `motion`, `lucide-react`,
`class-variance-authority`. `clsx` and `tailwind-merge` are used through `cn()`.

## How the registry works

Static JSON, no server. `npm run registry:build` generates:

- `public/r/<name>.json` - one per component, source inlined in `files[].content`
- `registry.json` - the index, used for discovery and by MCP

Both are generated from `registry/meta.json`. Edit that, never the output. The
build runs it automatically via a `prebuild` hook, so the published JSON can
never be stale.

## Development

```bash
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Regenerates the registry, then builds |
| `npm run lint` | ESLint |
| `npm run registry:build` | Rebuild the registry JSON from `meta.json` |

`NEXT_PUBLIC_SITE_URL` is read at build time and drives every generated URL. It
defaults to `https://ui.noicess.fun`.

Full deployment and DNS notes are in [SETUP.md](./SETUP.md).

## Adding a component

1. Write `registry/ui/<name>.tsx`
2. Add an entry to `registry/meta.json`
3. Add `src/components/demos/<name>-demo.tsx`
4. Register it in the `DEMOS` map in `src/components/demos/demos.tsx`
5. `npm run build`

The gallery, sidebar, sitemap, and `llms.txt` all derive from the catalog, so
they update on their own.

Contributing notes are in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. Use it commercially, modify it, sell it. No attribution required.
