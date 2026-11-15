# Architecture

RabbitHole is a frontend application built with React, TypeScript, and Vite. It
currently renders a branded placeholder page. Routing, lesson pages, algorithms,
execution traces, playback, and visualizers are planned work.

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
  renders `App` inside `StrictMode`.
- [`src/App.tsx`](../src/App.tsx) contains the current wordmark and introduction.
  Its Tailwind classes control the placeholder's width, spacing, and typography.
- `public/` contains static assets, including the rabbit favicon used by the HTML
  document.

The application is currently frontend-only. Vite produces static assets in
`dist/` for deployment.

## Shared styling

[`src/index.css`](../src/index.css) imports Tailwind CSS v4 and defines the shared
colors and Arial font stack in an `@theme` block. Components use utilities such as
`text-brand` and `text-text-secondary` instead of repeating color values.

The `@layer base` block provides document-wide defaults and text-selection colors.
Keeping those defaults in the base layer allows utility classes to override them.
Use regular CSS when a custom animation or other specific behavior needs it.

The current wordmark emphasizes `bit` using the brand color; `Rab` and `Hole`
inherit the primary text color. Shared page layouts and a component library will
be introduced as the website grows.

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

The following areas are proposed, not existing directories. Introduce them when
the first feature needs them rather than creating empty scaffolding in advance.

| Area                | Responsibility                                                                  |
| ------------------- | ------------------------------------------------------------------------------- |
| `app/` and `pages/` | Routing, shared application layout, directories, and lesson composition.        |
| `components/`       | Shared navigation, controls, cards, and educational UI.                         |
| `algorithms/`       | Computer science logic that operates on data independently of React.            |
| `trace/`            | Execution recording, preserved snapshots, operation metadata, and validation.   |
| `playback/`         | Selected step, play/pause state, speed, timers, and navigation through a trace. |
| `visualizations/`   | Rendering array, tree, or graph snapshots received as data.                     |
| `content/`          | Explanations, complexity analysis, examples, exercises, and lesson metadata.    |

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

- Choose routing together with static-host handling of nested URLs and refreshes.
- Confirm the mobile interaction model for complex tree and graph visualizers.
- Design trace interfaces and playback behavior through small examples and tests.
- Add browser tests for actual styling and complete user workflows.
- Treat pasted JavaScript or TypeScript execution as a later feature with its own
  isolation and resource-limit design. It should produce the same trace contract
  consumed by playback and visualizers.

The next implementation milestone is the website foundation: navigation, page
layouts, directories, and basic educational pages.
