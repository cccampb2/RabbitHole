# RabbitHole

RabbitHole is an educational project being built to teach algorithms, data
structures, problem-solving patterns, and computer science fundamentals through
interactive visualizations.

The goal is to explain how these ideas work, when to use them, and how to reason
about their time and space complexity. The project also aims to give students
practical experience contributing features, tests, documentation, and improvements
to a real application.

## Project status

RabbitHole is in early development. The repository currently includes:

- A React and TypeScript application with a branded placeholder page and favicon.
- Shared dark-theme colors and typography using Tailwind CSS v4.
- ESLint, TypeScript checking, and Prettier formatting commands.
- Vitest and React Testing Library setup with an initial component test.
- A combined local quality-check command and development setup guide.
- GitHub Actions CI for pull requests and pushes to `main`

Algorithm visualizers, execution traces, playback controls, and browser tests
are planned features.

## Tech stack

- **Application:** React and TypeScript.
- **Build and styling:** Vite and Tailwind CSS v4.
- **Testing:** Vitest, React Testing Library, jest-dom, and jsdom.
- **Code quality:** ESLint and Prettier.

The project's tested Node.js version is recorded in [`.nvmrc`](.nvmrc).

## Getting started

Follow the [getting-started guide](docs/getting-started.md) for environment
requirements, dependency installation, local development, testing, formatting, and
production previews.

Before submitting changes, follow the guide's
[quality-check instructions](docs/getting-started.md#check-your-changes).

## Project guides

- [Architecture](docs/architecture.md): current structure and planned boundaries.
- [Testing](docs/testing.md): test tools, conventions, and current coverage.
- [Contributing](CONTRIBUTING.md): coordination, pull requests, and review.
