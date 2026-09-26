# Setup

Everything needed to get noiceui live and installable. In order.

## 1. Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Regenerates the registry, then builds. `prebuild` runs `registry:build` automatically, so the published JSON can never be stale |
| `npm run lint` | ESLint |
| `npm run registry:build` | Rebuilds `public/r/*.json` and `registry.json` from `registry/meta.json` |

`registry:build` is already wired into `build` via `prebuild`. You never need to
run it by hand before deploying.

## 2. Deploy

Any static host works. The only requirement is that it serves `public/r/*.json`
as plain files over HTTPS.

### Vercel

1. Import the repo.
2. Set the environment variable below.
3. Deploy. Build command stays `npm run build`.

### Environment variable

Set this in your host's dashboard, **not** in a committed `.env`:

```
NEXT_PUBLIC_SITE_URL=https://ui.noicess.fun
```

It is `NEXT_PUBLIC_` because it is read at build time and baked into the client
bundle. It drives `SITE_URL` in `src/lib/site.ts`, which everything else derives
from:

- the `homepage` field in `registry.json`
- every component URL the CLI prints
- `installCommand()` output
- canonical tags, OG images, `sitemap.ts`, `llms.txt`

The fallback is `https://ui.noicess.fun`, so the build works without it. Set the
variable anyway so the domain lives in one place, and note that it is a
build-time value: **changing it requires a redeploy**, it will not take effect on
a running deployment.

## 3. Point a domain at it

### Apex domain

Add an `A` record to your DNS provider:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `76.76.21.21` |

Then add the bare domain in your host and deploy once so the certificate is issued.

### Subdomain

Use a `CNAME` instead:

| Type | Name | Value |
| --- | --- | --- |
| `CNAME` | `ui` | `cname.vercel-dns.com` |

Then add `ui.noicess.fun` in your host's Domains settings.

The apex and the subdomain must live in the **same** hosting account. If
`noicess.fun` is on a personal Vercel account, the subdomain has to go there
too, or certificate issuance will fail.

If the subdomain becomes your canonical home, set
`NEXT_PUBLIC_SITE_URL=https://ui.noicess.fun` and redeploy so the registry
and the site agree on one origin.

## 4. How the registry works

A shadcn registry is **static JSON on a public URL**. No server, no database, no
authentication. When someone runs `npx shadcn add <url>`, the CLI:

1. HTTP GETs the URL
2. Reads `files[]` and writes each entry's inlined `content` to disk
3. Resolves `registryDependencies`, fetching any of those too
4. `npm install`s everything in `dependencies`

You publish two things:

- **`public/r/<name>.json`** - one per component. This is what the CLI fetches.
  It carries `dependencies`, `registryDependencies`, and a `files[]` array whose
  entries each hold a `path` and the full `content`.
- **`registry.json`** - the index. Used for discovery and by MCP.

Both are generated from `registry/meta.json` by `scripts/build-registry.mjs`.
Edit `meta.json`, never the generated files.

### Install a component by URL

```bash
npx shadcn@latest add https://ui.noicess.fun/r/button.json
```

### Install by namespace

Users add this once to their `components.json`:

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

`{name}` is the whole trick. It lets `@noiceui/accordion` resolve to
`https://ui.noicess.fun/r/accordion.json`.

The `aliases` block matters: your components import from
`@/components/ui/...`, so files must land where that import already expects.
`@/lib/utils` must exist in the user's project or nothing will compile - that is
what the Installation guide covers.

## 5. MCP

```bash
npx shadcn@latest mcp init
```

This starts an MCP server exposing the registry as tools, so an agent can list
components, read their source, and install them from a plain-language request
rather than guessing at an API.

To have it serve **your** registry, register the namespace from step 4 first.

## 6. Verify it works

Against production:

```bash
curl https://ui.noicess.fun/registry.json | head
curl https://ui.noicess.fun/r/button.json | head
```

Both should return JSON. Then, in a scratch project:

```bash
npx shadcn@latest add https://ui.noicess.fun/r/button.json
```

Confirm `components/ui/button.tsx` exists and the install is clean.

Against a local dev server, `http://localhost:3000` works for a single
component. Note that `registryDependencies` still resolve to production URLs,
since they are baked in at build time.

## 7. Adding a component

1. Write `registry/ui/<name>.tsx`. Import `cn` from `@/lib/utils`.
2. Add an entry to `registry/meta.json` with `name`, `title`, `description`,
   `category`, `dependencies`, `registryDependencies`, `usage`, and `props`.
3. Add `src/components/demos/<name>-demo.tsx`.
4. Register it in the `DEMOS` map in `src/components/demos/demos.tsx`.
5. `npm run build`.

The gallery, sidebar, sitemap, and `llms.txt` all derive from `meta.json`, so
they update with no further edits.

## Gotchas

- **`dependencies` must be accurate.** The CLI installs exactly what is listed.
  A missing entry gives the user a component that fails to compile.
- **`registryDependencies` must be absolute URLs.** Use
  `registryUrl("<name>")` from `src/lib/registry.ts` rather than hand-writing
  them, so they pick up `SITE_URL` automatically.
- **Components must be self-contained.** They are copied into a project that
  knows nothing about this site. If one relies on a keyframe or custom property
  defined in `src/app/globals.css`, it has to ship that itself or it will be
  broken in the user's project.
- **Trailing slashes break URLs.** `SITE_URL` strips them, which is why that
  `.replace()` is there.
- **`registry.json` items carry no `files` array.** The CLI is fine, because it
  fetches `r/<name>.json` directly. Tools that read only the index see
  components with no source attached.
