# Testing

RabbitNotation uses automated tests to check expected behavior and catch regressions.
This guide explains the current setup and how it will grow with the application.
For installation and the full command reference, see
[Getting started](getting-started.md).

## Current coverage

The suite currently contains 13 tests across two files:

| File                                                                                        | Tests | Coverage                                                                             |
| ------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------ |
| [`src/App.test.tsx`](../src/App.test.tsx)                                                   | 3     | Home heading and brand class, Algorithms placeholder route, and the not-found route. |
| [`src/components/layout/SiteHeader.test.tsx`](../src/components/layout/SiteHeader.test.tsx) | 10    | Desktop category dropdowns and mobile navigation interactions.                       |

The six desktop header tests cover opening, toggling closed, outside clicks,
Escape with focus restoration, switching between categories, and selecting a
page. The selection test also checks the Sorting link's destination.

The four mobile tests cover opening the panel, Escape with focus restoration,
outside clicks, and closing the panel after selecting a page. They check panel
content and the toggle's expanded state.

Algorithm, trace, playback, and browser tests will be added with those features.
Playwright and browser test commands are not configured yet. Link assertions do
not establish that every linked page exists; most dropdown destinations currently
use the not-found route.

## What each tool does

| Tool                  | Responsibility                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Vitest                | Finds and runs tests, provides assertions and lifecycle hooks, and reports results.                |
| React Testing Library | Renders React components and provides helpers for inspecting their output.                         |
| DOM Testing Library   | Supplies the underlying DOM queries used by React Testing Library.                                 |
| user-event            | Simulates interactions such as clicks, Tab navigation, and key presses.                            |
| jsdom                 | Provides browser-like objects such as `window` and `document` inside Node.                         |
| jest-dom              | Adds DOM assertions such as `toHaveTextContent`, `toHaveClass`, and `toBeInTheDocument` to Vitest. |

Despite its name, jest-dom supports Vitest. The Jest test runner is not part of
this project.

## Where tests belong

Keep unit and component tests beside the code they test:

```text
src/
  App.tsx
  App.test.tsx
  components/
    layout/
      SiteHeader.tsx
      SiteHeader.test.tsx
  test/
    setup.ts
```

Use `.test.ts` for tests containing ordinary TypeScript and `.test.tsx` when JSX
is needed. For example, a future `bubbleSort.test.ts` should live beside its
algorithm implementation.

`src/test/setup.ts` contains shared initialization. Shared fixtures and tests
spanning several features can be added under `src/test/` as needed. Future
Playwright workflows will live separately under `tests/e2e/`, with test discovery
configured so each runner executes its own suite.

## Run the tests

Run the suite once:

```bash
npm run test
```

This executes `vitest run`, reports the results, and exits. A test failure produces
a failure status that local scripts and CI can detect.

Keep tests running while developing:

```bash
npm run test:watch
```

Watch mode runs the tests and stays open. Saving a test file reruns that file;
saving application code normally reruns test files that depend on it, directly or
indirectly. A shared component can therefore cause several test files to rerun.
Watch mode does not create tests automatically. Press `Ctrl+C` to stop it.

Before submitting a pull request, run `npm run check`. This includes the tests
alongside lint, formatting, TypeScript, and build checks.

To run only the header test file:

```bash
npm run test -- src/components/layout/SiteHeader.test.tsx
```

The `--` forwards the following argument to Vitest. The file path restricts this
run to the header tests; it does not run the full quality-check sequence.

## Understand a component test

Read the existing [App test](../src/App.test.tsx) as a worked example:

1. `it` registers a named test. Vitest executes the function passed to it.
2. `render` mounts `App` inside a `MemoryRouter` with an initial route. The router
   supplies the context needed by the component's routes and links.
3. `screen.getByRole("heading", { level: 1 })` finds the level-one heading.
4. `within(heading).getByText("bit", { exact: true })` searches only inside that
   heading for the branded text. This avoids matching the wordmark in the header.
5. `expect(...)` starts an assertion, and its matcher states the expected result.

For example:

```ts
expect(heading).toHaveTextContent("RabbitNotation");
```

This checks whether the element's text contains `RabbitNotation`. The class assertion
in the App test checks for a particular class within the element's class list.

Aim for one behavior per `it` block. Related assertions can belong in the same
test. `describe` can group related tests as a suite grows.

## Find elements and check absence

Prefer semantic queries when they express how someone finds and uses the
interface. For example:

```ts
const button = screen.getByRole("button", { name: "Open navigation" });
```

Here, `name` means the accessible name. A text button can get its name from visible
text such as `Algorithms`; the icon-only mobile toggle gets its name from
`aria-label`. Its label changes to `Close navigation` while the panel is open.

| Query                          | Behavior                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `getByRole` or `getByText`     | Returns a match immediately; throws if none or several match.                                          |
| `queryByRole` or `queryByText` | Returns `null` if nothing matches; useful for absence assertions. Throws if several match.             |
| `findByRole` or `findByText`   | Returns a Promise and waits for a match; use `await` when testing content that appears asynchronously. |

`getByText` searches displayed text. `getByRole` can additionally identify the
expected kind of control, such as a link or button. Exact string matches are
case-sensitive: `GitHub` and `Github` are different.

Before the mobile panel opens, test the contribution link's absence with a
`queryBy` query:

```ts
expect(
  screen.queryByRole("link", { name: "Contribute on GitHub" }),
).not.toBeInTheDocument();
```

Using `getByRole` here would throw before the absence assertion could run.

## Test interactions and routing

The [header tests](../src/components/layout/SiteHeader.test.tsx) import `userEvent`
from `@testing-library/user-event`. Each interaction test uses an `async` callback,
creates a user with `userEvent.setup()`, and renders `SiteHeader` inside a
`MemoryRouter` before searching for controls.

Create the user before rendering. Await interactions so their events and React
updates complete before the next assertion. Examples from the existing tests
include:

```ts
await user.click(button);
await user.tab();
await user.keyboard("{Escape}");
```

These simulate clicking, moving focus with Tab, and pressing Escape. The Escape
tests move focus into the open panel first, then check both that it closes and
that focus returns to its trigger. Clicking the trigger and immediately pressing
Escape alone would not establish that focus returns from a child control.

`toHaveAttribute("aria-expanded", "true")` checks the control's reported open state.
`toHaveFocus()` checks the focused element. These are assertions about component
behavior and DOM state, not animation or layout.

`MemoryRouter` keeps route history in memory so tests can select an initial URL
without navigating the real browser. `App` tests render the application's routes;
header-only tests render its controls and links. Both need router context, even
though only the `App` tests render destination pages.

For mobile category selection, use `within` to restrict searches to the mobile
panel. The existing test checks that the `mobile-navigation` element exists, then
uses `within(panel)` to find its Algorithms button and Sorting link. Desktop and
mobile controls share accessible names; jsdom does not apply the responsive
stylesheet that hides one version in a real browser. Scoping prevents ambiguous
matches.

## Test functions directly

A regular function does not need React rendering. Import it, call it with a known
input, and assert its return value or other intended effects.

For an algorithm, useful cases will include empty input, one element, duplicates,
already ordered input, and reverse order where applicable. Check the documented
input-mutation policy and other invariants as well as the final result.

`toBe` compares primitive values or checks whether references point to the same
object. Use `toEqual` to compare the contents of arrays or objects. Tests should
express the function's agreed contract rather than duplicate its implementation.

The current default test environment is jsdom. That does not require every test
to render a component. Pure logic tests can use a Node environment as the suite
grows.

## Shared setup and imports

[`vite.config.ts`](../vite.config.ts) selects jsdom and registers
[`src/test/setup.ts`](../src/test/setup.ts) as a setup file. The setup runs before
each test file and:

- Imports `@testing-library/jest-dom/vitest` to enable DOM matchers.
- Registers `afterEach(cleanup)` to unmount rendered components and remove their
  test containers after every test.

Test files explicitly import helpers such as `it`, `expect`, and `describe` from
`vitest`. React rendering helpers come from `@testing-library/react`, and
`MemoryRouter` comes from `react-router`.

Each test must render its own subject. Cleanup removes the previous test's DOM;
rendering a header in one test does not make it available to the next test.

If you have used Jest, the basic test structure and many assertions will look
familiar. Vitest's mocking helpers use `vi`; mocking behavior has differences we
will document when mocks become necessary.

## Styling and browser behavior

The current class assertion verifies that `bit` receives `text-brand`. It does not
verify that the stylesheet turns that class into the intended purple. A changed
token value or an overriding CSS rule could leave the class test passing.

When Playwright is introduced, add a browser test for the wordmark's computed
colors: `bit` should use brand purple `#9B7BFF`, while `Rab` and `Notation` inherit the
primary text color `#F2F3F5`. This is planned coverage, not an existing check.

Real-browser tests will also cover important navigation and playback workflows.
The current jsdom suite does not establish that layout, fonts, responsive styles,
or visual appearance are correct in a real browser. In particular, the mobile
interaction tests exercise state and event handling; they do not verify the
768px breakpoint, icon crossfade, reduced-motion behavior, or panel dimensions.
Inspect those in a real browser until automated browser coverage is introduced.

## Investigate failures

- Read the failing test name, error, and reported source line.
- For a failed assertion, compare the expected and received values.
- For a failed query, inspect the rendered DOM included in the error and check
  whether the component exposes the expected role or text.
- For an import or environment error, investigate the setup before changing the
  behavior assertion.
- If Vitest reports no tests found, check the filename and test location.

Fix regressions in the implementation. When behavior intentionally changes,
review and update the relevant tests alongside that change.

## Pull-request checks

The [Quality Checks workflow](../.github/workflows/ci.yml) runs `npm run check` on
pull requests and pushes to `main`. The `quality` job is required for merging.

A failed test leaves the pushed commits on GitHub and prevents merging while the
required check is failing. Push a fix to the same pull-request branch to rerun
the checks. Passing tests verify their stated expectations; maintainers also
review the change's correctness, scope, and maintainability.
