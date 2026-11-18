# Contributing to RabbitNotation

RabbitNotation aims to help people learn computer science and gain practical software
engineering experience. Contributions can include bug fixes, tests, documentation,
accessibility improvements, algorithms, and visualizations.

The project is in early development. Coordinate substantial work with a maintainer
so it fits the current architecture and development priorities.

## Choose and coordinate work

- Search existing issues and pull requests before proposing a change.
- For a feature, algorithm, data structure, or substantial refactor, discuss the
  scope and acceptance criteria in an issue before implementing it.
- To work on an existing issue, comment with your proposed approach and ask a
  maintainer to confirm ownership. Check whether someone is already working on it.
- Small corrections, such as fixing a documentation typo, can go directly into a
  focused pull request.
- If you cannot continue assigned work, leave an update so someone else can pick
  it up. Keep onboarding exercises separate from production issues.

If you are unsure where to start, ask for help identifying a small, useful task.

## Set up your working copy

Contributors without repository write access should
[fork RabbitNotation](https://github.com/cccampb2/RabbitHole/fork) and clone their fork.
Maintainers with write access can work on branches in the main repository.

Follow the [getting-started guide](docs/getting-started.md) for the Node version,
dependency installation, local development, and available commands.

Start each change from an up-to-date `main`. If you use a fork, synchronize its
`main` with the original repository first. Create a branch with a descriptive
name; for example:

```bash
git switch -c docs/clarify-setup
```

This creates and switches to a branch for the documentation change. Other useful
prefixes include `feat/`, `fix/`, and `test/`.

## Make a focused change

- Keep each pull request focused on one problem or feature.
- Follow existing TypeScript, React, styling, and formatting conventions. Reuse
  shared design tokens and components when they fit the task.
- Keep algorithm logic separate from React rendering. Agree on new algorithm,
  trace, or visualization interfaces before building substantial features.
- Add or update tests for changed behavior and relevant edge cases. Place unit
  and component tests beside their subjects using `.test.ts` or `.test.tsx`.
- Documentation-only changes generally do not need new automated tests.
- Update affected documentation so it describes the actual project behavior.
- Include dependency-file changes when intentionally adding or updating packages.

## Validate locally

Before opening a pull request, run the combined quality checks:

```bash
npm run check
```

This runs ESLint, Prettier's formatting check, Vitest, TypeScript checking, and the
production build. Resolve failures before requesting review. The
[command reference](docs/getting-started.md#command-reference) explains individual
checks, watch mode, and the formatting command.

For interface changes, also inspect the affected behavior in the browser and
describe any manual verification in your pull request.

For navigation changes, check desktop and mobile layouts, link destinations, and
keyboard behavior such as Tab and Escape. The component tests cover interactions;
responsive styling and animation still need browser verification. See
[Testing](docs/testing.md#styling-and-browser-behavior) for the current limits and
planned browser coverage.

## Open a pull request

Push your branch to your fork or the main repository, as appropriate. For the
example branch above:

```bash
git push -u origin docs/clarify-setup
```

This uploads the branch to `origin` and establishes its upstream connection. For
a fork-based contribution, `origin` should point to your fork.

Open a pull request targeting `main` in `cccampb2/RabbitHole`. Include:

- The problem being addressed and a link to its issue, when applicable.
- What changed and why the approach fits the problem.
- The checks you ran and their results.
- Screenshots or a short recording when they help explain an interface change.

Review the diff before submitting. Use a draft pull request when you want early
feedback on work that is still in progress.

GitHub Actions runs the **Quality Checks** workflow on pull requests. The
`quality` job is required before merging into `main`.

## Review and merge

Maintainers review correctness, scope, maintainability, tests, documentation, and
accessibility where relevant. Passing CI is one part of that review.

Respond to feedback, explain your reasoning, and push revisions to the same
branch. Those commits update the existing pull request and rerun its checks.
Keep the branch up to date with `main` when GitHub requires it.

Maintainers merge accepted changes after required checks pass and review feedback
is addressed. After merging, synchronize your local `main` and remove finished
branches.

Questions are welcome. Share what you tried, what you expected, and what happened
so reviewers can give useful guidance.
