# Contributing to GitHub Issue Tracker

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to GitHub Issue Tracker. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) (Fastest) or Node.js (v20+)

### Local Installation

1. Fork the repository and clone it locally.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy `.env.example` to `.env` and optionally add your GitHub PAT for higher rate limits.
4. Start the development server:
   ```bash
   bun dev
   ```

## Workflow

1. Create a new branch for your feature or bugfix: `git checkout -b feature/my-new-feature`
2. Make your changes.
3. Ensure the code looks good and follows the project's style:
   ```bash
   bun lint
   ```
4. Run unit tests to ensure no regressions:
   ```bash
   bun test:unit
   ```
5. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. Push to your fork and submit a Pull Request.

## Coding Standards

- **Vue 3**: Use the Composition API with `<script setup>`.
- **Styling**: Always use **Vanilla CSS** with CSS Custom Properties. Avoid Tailwind or UI kits.
- **JavaScript**: This project is strictly **JavaScript** (no TypeScript).
- **Aesthetics**: Maintain the "Editorial Utility" aesthetic (sharp, dense, intentional).

## Pull Request Process

1. Ensure all CI checks (linting, tests, build) pass.
2. Provide a clear description of the changes in the PR.
3. Reference any related issues (e.g., `Closes #123`).

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
