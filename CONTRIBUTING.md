# Contributing to Datadive

Thank you for considering contributing to Datadive :tada:

## How to Contribute

To contribute to this project, follow these steps:

1. Fork this repository and clone it to your local machine.
2. Create a new branch for your contribution: `git checkout -b BRANCHNAME`
3. Add your changes to the staging area: `git add [path of files]`
4. Commit your changes using [commitizen](https://commitizen-tools.github.io/commitizen/): `bun run commit`
5. Push to the branch: `git push -u origin BRANCHNAME`
6. Submit a pull request.

Please note that this repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This is enforced by [commitlint](https://github.com/conventional-changelog/commitlint). For more details check out the [commitlint conventional configuration](<[./commitlint.config.js](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)>).

## Quick Guide

### Prerequisites

```shell
bun: ">=1.1.12"
```

### Setting up your local repo

Datadive uses bun workspaces, so you should **always run `bun install` from the top-level project directory**. Running `bun install` in the top-level project root will install dependencies for `Datadive`, and every package in the repo.

```shell
git clone && cd ...
bun install
bun turbo build
```

### Setting up environment variables

Checkout the `.env.example` file inside the `apps/api` directory for the environment variables you need to get the project running. You should create free [Turso](https://turso.tech) and [Resend](https://resend.com) accounts and copy the environment variables from their dashboard to a `.env.local` file in `apps/api`.

### Using GitHub Codespaces for development

To get started, create a codespace for this repository by clicking this 👇

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/lucaschultz/datadive)

Your new codespace will open in a web-based version of Visual Studio Code. All development dependencies will be preinstalled, and the tests will run automatically ensuring you've got a green base from which to start working.

### Development

```shell
# Dev
bun turbo dev

# Build
bun turbo build

# Typecheck
bun turbo typecheck

# Lint
bun turbo lint

# Start apps in production mode
bun turbo start
```

If you're familiar with turborepo / bun workspaces, running stuff around this repo will be easy to figure out.

### Other useful commands

```shell
# auto-format the entire project
bun run format
```

```shell
# lint the project
bun run lint
```

## Code Style Guidelines

Please follow the existing code style and conventions used in the project.

## Issue Reporting

If you encounter any issues with the project or have suggestions for improvements, please open an issue on the GitHub repository.

## License

By contributing to this project, you agree that your contributions will be licensed under the [LICENSE](LICENSE).

---

If you have any suggestions or concerns, consider opening a new issue.

**[Datadive](https://github.com/lucaschultz/datadive/issues)**
