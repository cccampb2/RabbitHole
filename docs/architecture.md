# Architecture

RabbitNotation is a frontend application built with React, TypeScript, and Vite.
The current foundation includes routing, shared layout components, and responsive
navigation. Most category pages, lessons, algorithms, execution traces, playback,
and visualizers remain planned work.

This document separates the current implementation from the intended direction.
Update it as those boundaries become real code.

## Current startup flow

```text
index.html -> src/main.tsx -> src/App.tsx
                   |
                   +-----> src/index.css
```

- [`index.html`](../index.html) provides the document, page metadata, favicon
  reference, and the `root` element where React mounts.
- [`src/main.tsx`](../src/main.tsx) imports global CSS, creates the React root, and
  renders `App` inside `StrictMode` and React Router's `BrowserRouter`.
- [`src/App.tsx`](../src/App.tsx) composes the shared header, the main content
  region, a centered container, and the route definitions. It provides space
  above the content for the fixed header.
- `public/` contains static assets, including the rabbit favicon used by the HTML
  document.

The application is currently frontend-only. Vite produces static assets in
`dist/` for deployment.

## Current components and pages

| File                                                                          | Responsibility                                                                                            |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`components/layout/Container.tsx`](../src/components/layout/Container.tsx)   | Centers content within a maximum width of 1160px and provides responsive horizontal padding.              |
| [`components/layout/SiteHeader.tsx`](../src/components/layout/SiteHeader.tsx) | Owns the navigation data, desktop dropdowns, mobile panel, event handling, and GitHub contribution links. |
| [`components/ui/Wordmark.tsx`](../src/components/ui/Wordmark.tsx)             | Renders the shared RabbitNotation wordmark.                                                               |
| [`pages/HomePage.tsx`](../src/pages/HomePage.tsx)                             | Displays the introductory heading and description.                                                        |
| [`pages/Algorithms.tsx`](../src/pages/Algorithms.tsx)                         | Exports `AlgorithmsPage`, currently a heading and introductory paragraph.                                 |
| [`pages/NotFoundPage.tsx`](../src/pages/NotFoundPage.tsx)                     | Displays a not-found message and a link home.                                                             |

Page components supply their own content; `App` supplies the shared main region
and container. This keeps the header and page gutters consistent across routes.

## Routing and static hosting

React Router runs in declarative mode. `BrowserRouter` supplies browser history,
and `Routes` and `Route` in `App` choose the page component.

| Path                       | Current result               |
| -------------------------- | ---------------------------- |
| `/`                        | Home page.                   |
| `/algorithms`              | Algorithms placeholder page. |
| Any other application path | Not-found page.              |

The Algorithms navbar control opens a dropdown; it does not navigate directly to
`/algorithms`. The dropdowns contain destinations such as `/algorithms/sorting`,
but those pages are not registered yet and currently use the not-found route.
The shared route prefixes and page routes in `SiteHeader` define the link URLs;
adding a navigation entry alone does not create its page.

`BrowserRouter` uses ordinary paths rather than hash URLs. A production static
host must serve `index.html` for application paths when someone opens or refreshes
a nested URL. Existing asset requests should still serve the asset files. The
client-side wildcard route can display a not-found page only after the application
loads; it cannot configure the server's fallback behavior or HTTP status code.
The host and its fallback configuration have not been selected yet.

## Navigation behavior

`SiteHeader` renders desktop and mobile navigation from the same `headerNav`
array. Each menu has a label, route prefix, and dropdown page entries.

- `openMenu` identifies the expanded category, or is `null` when all categories
  are collapsed. A single value allows only one category to be open at a time.
- `isMobileMenuOpen` separately controls visibility of the entire mobile panel.
- Below Tailwind's default `md` breakpoint, 768px, the desktop category controls
  are hidden and the mobile toggle is shown. Mobile category links use a
  two-column grid. The desktop GitHub icon becomes a contribution link inside the
  mobile panel.
- Buttons use `aria-expanded` and `aria-controls` to describe their panels.
  Desktop and mobile category panels use distinct IDs. `NavLink` provides the
  current-page attribute used by the desktop links' brand-color styling.
- Pointer events outside the navbar close the category and mobile panel. The
  effect removes its document listener during cleanup.
- Escape closes the relevant desktop dropdown or the entire mobile panel and
  returns focus to its trigger. Mobile page links and the wordmark close both
  states when selected.
- Refs identify the navbar for outside-pointer checks and the mobile toggle for
  restoring focus.

The mobile toggle crossfades and rotates between the hamburger and close icons.
Its icon transition and the panel entrance animation respect reduced-motion
preferences. Icons come from `react-icons`.

## Shared styling

[`src/index.css`](../src/index.css) imports Tailwind CSS v4 and defines the shared
colors and Arial font stack in an `@theme` block. Components use utilities such as
`text-brand` and `text-text-secondary` instead of repeating color values.

The `@layer base` block provides document-wide defaults and text-selection colors.
Keeping those defaults in the base layer allows utility classes to override them.
Use regular CSS when a custom animation or other specific behavior needs it.

The current wordmark emphasizes `bit` using the brand color `#9B7BFF`; `Rab` and
`Notation` inherit the primary text color `#F2F3F5`. Shared shadow and animation
tokens support the header, while arbitrary-value utilities retain its specific
surface colors, borders, and dimensions. Extend the existing layout and UI
components when new pages need shared behavior.

## Tooling and quality checks

- [`vite.config.ts`](../vite.config.ts) configures the React and Tailwind plugins
  and the Vitest environment and setup file.
- [`tsconfig.json`](../tsconfig.json) references separate TypeScript configurations
  for application code and Vite configuration.
- [`eslint.config.js`](../eslint.config.js) defines the lint rules, while
  [`.prettierrc.json`](../.prettierrc.json) selects the pinned Prettier version's
  default formatting conventions.
- [`.nvmrc`](../.nvmrc) records the tested Node version. CI reads that same file.

`npm run check` is the shared local and CI quality-check entry point. See
[Getting started](getting-started.md) for commands and
[Testing](testing.md) for the test structure and current coverage.

The [GitHub Actions workflow](../.github/workflows/ci.yml) defines the `quality`
job. GitHub's repository settings separately make that check required and require
pull requests for changes to `main`. Those protection settings are managed on
GitHub, not by the workflow file.

## Planned application boundaries

`src/pages/` and `src/components/` already provide page composition and shared UI.
The computational areas below are proposed, not existing directories. Introduce
them when the first feature needs them rather than creating empty scaffolding in
advance.

| Area              | Responsibility                                                                  |
| ----------------- | ------------------------------------------------------------------------------- |
| `algorithms/`     | Computer science logic that operates on data independently of React.            |
| `trace/`          | Execution recording, preserved snapshots, operation metadata, and validation.   |
| `playback/`       | Selected step, play/pause state, speed, timers, and navigation through a trace. |
| `visualizations/` | Rendering array, tree, or graph snapshots received as data.                     |
| `content/`        | Explanations, complexity analysis, examples, exercises, and lesson metadata.    |

The intended data flow is:

```text
Validated input -> algorithm execution and trace generation -> preserved steps
                                                                   |
                                                              playback
                                                                   |
                                                              selected step
                                                               /         \
                                                     visualization     explanation
```

Algorithm logic must not manipulate React components or control animation timers.
Trace generation records what happened; playback chooses which recorded step to
show; rendering and educational content explain that step. The exact interface
between algorithms and trace generation remains design work for the trace
milestone.

## Proposed first trace approach

Start with bounded, complete snapshots for the first array visualizer. This makes
previous-step navigation and timeline seeking straightforward. For `S` snapshots
of an array containing `n` elements, copied array storage costs roughly `O(S * n)`.
Snapshots must preserve earlier states when later execution changes working data.

Event deltas can reduce repeated state but require reconstruction when seeking.
Checkpoints combine occasional snapshots with deltas at the cost of more playback
and validation complexity. Revisit these alternatives after measuring the first
implementation. Trace storage overhead should be explained separately from the
algorithm's own auxiliary space.

These are proposals, not implemented contracts. Agree on the step format,
operation granularity, input and trace limits, and validation before implementing
the system. Bubble Sort will be the first complete algorithm lesson.

## Decisions to revisit

- Choose a static host and configure the application-path fallback required by
  `BrowserRouter`.
- Confirm the mobile interaction model for complex tree and graph visualizers.
- Design trace interfaces and playback behavior through small examples and tests.
- Add browser tests for actual styling and complete user workflows.
- Treat pasted JavaScript or TypeScript execution as a later feature with its own
  isolation and resource-limit design. It should produce the same trace contract
  consumed by playback and visualizers.

Continue the website foundation by adding category content, basic educational
pages, and the remaining shared website sections. Complex visualizations belong
to later milestones.
