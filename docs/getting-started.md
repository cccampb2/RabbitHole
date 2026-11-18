# Getting started

This guide covers running RabbitNotation locally and checking your changes. Run all
commands from the project root: the folder containing `package.json`.

## Requirements

- Use the Node.js version recorded in [`.nvmrc`](../.nvmrc).
- Install npm, which is included with a standard Node.js installation.
- Use a modern browser to view the application.

Check your installed versions:

```bash
node --version
npm --version
```

If you already use nvm, run `nvm install` from the project root. It reads `.nvmrc`,
installs the recorded Node version if needed, and selects it for the current shell.

## Install dependencies

After cloning the repository and opening its root folder, run:

```bash
npm ci
```

This installs the dependency versions recorded in `package-lock.json`. It replaces
an existing `node_modules` folder and fails if `package.json` and the lockfile
disagree. It leaves both dependency files unchanged.

When intentionally adding or updating a dependency, use `npm install` and include
the resulting changes to `package.json` and `package-lock.json` in your pull request.

## Start development

```bash
npm run dev
```

This starts Vite's development server and opens the application in your browser.
The terminal prints the local URL. Keep the server running while developing;
saved changes update the page automatically. Press `Ctrl+C` in that terminal to
stop the server.

Use a second terminal for tests and other commands while the server runs.

The current app has a home page, an Algorithms placeholder at `/algorithms`, and
a not-found page for other application paths. The navbar lists future category
destinations; most of those pages are not implemented yet. See
[Architecture](architecture.md#routing-and-static-hosting) for the current routing
behavior.

## Check your changes

Before submitting a pull request, run:

```bash
npm run check
```

This runs ESLint, the Prettier formatting check, Vitest, and the production build
in order. The build includes TypeScript checking. The sequence stops at the first
failure; read the reported error, address it, and rerun the command.

## Command reference

| Command                | Purpose                                                             |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Start the development server and open the application.              |
| `npm run lint`         | Check code against the ESLint rules.                                |
| `npm run typecheck`    | Check TypeScript for the application and tooling configuration.     |
| `npm run format`       | Rewrite supported files using the project's Prettier configuration. |
| `npm run format:check` | Check formatting without editing files.                             |
| `npm run test`         | Run the Vitest suite once and exit with a pass or failure status.   |
| `npm run test:watch`   | Keep Vitest running and rerun affected tests when files change.     |
| `npm run build`        | Check TypeScript and generate production assets in `dist/`.         |
| `npm run preview`      | Serve an existing production build locally for inspection.          |
| `npm run check`        | Run lint, formatting checks, tests, and the production build.       |

Run `npm run format` to fix formatting issues, then review its changes before
committing. Run `npm run check` afterward to verify the complete set of checks.

Watch mode is useful while developing; press `Ctrl+C` to stop it. React component
tests currently use jsdom, a browser-like test environment running in Node.

See [Testing](testing.md) for the test structure, shared setup, examples, and help
understanding failures.

To inspect the production version locally, run `npm run build`, followed by
`npm run preview`. Open the URL printed by the preview server.

For deployment, the static host must serve `index.html` for application paths so
direct links and refreshes work with `BrowserRouter`. Local previews alone do not
establish that a production host has this fallback configured. See
[Routing and static hosting](architecture.md#routing-and-static-hosting).
