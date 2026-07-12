# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.16.1 create --template minimal --types ts --add sveltekit-adapter="adapter:cloudflare+cfTarget:pages" drizzle="database:postgresql+postgresql:neon" better-auth="demo:password" --install bun .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deploying to Cloudflare Pages

Set `DATABASE_URL`, `ORIGIN`, and `BETTER_AUTH_SECRET` in the Pages project's
Settings → Environment variables (both Production and Preview) — these are
never committed (`.env` is gitignored).

`worker-configuration.d.ts` is generated locally by `bun run gen` (`wrangler
types`), inferring the `Env` shape from your local `.env` file. **Do not put
`wrangler types --check` back into the `build` script** — Cloudflare's build
environment has no `.env` file, so `wrangler types` there always infers an
empty `Env` interface, and the check will fail regardless of what you set in
the dashboard. The committed type file is a local dev/editor convenience
only; it isn't required for `vite build` to produce a correct bundle.
