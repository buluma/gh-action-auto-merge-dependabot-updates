# Auto Merge Dependency Updates

A GitHub action that will automatically approve and merge a PR that only contains dependency updates, based on some rules.

If you run tests on PR's make sure you [configure those as required status checks](https://docs.github.com/en/github/administering-a-repository/enabling-required-status-checks) so that they need to go green before the merge can occur.

Note that the action does not check the lockfile is valid, so you should only set `allowed-actors` you trust, or validate that the lockfile is correct in another required action.

It currently supports npm and yarn.

## Config

- `allowed-actors`: A comma separated list of usernames auto merge is allowed for.
- `repo-token` (optional): a GitHub API token. _Default: The token provided to the workflow (`${{ github.token }}`)_
- `allowed-update-types` (optional): A comma separated list of types of updates that are allowed. Supported: [devDependencies|dependencies]:[major|minor|patch]. _Default: `devDependencies:minor, devDependencies:patch`_
- `approve` (optional): Automatically approve the PR if it qualifies for auto merge. _Default: `true`_
- `package-block-list` (optional): A comma separated list of packages that auto merge should not be allowed for.
- `package-allow-list` (optional): A comma separated list of packages that auto merge should only be allowed for. Omit to allow all packages.
- `merge` (optional): Merge the PR if it qualifies. _Default: `true`_
- `merge-method` (optional): Merge method. Supported: `merge`, `squash`, `rebase` _Default: `merge`_
- `allow-github-actions-workflow-updates` (optional): Allow modified workflow files under `.github/workflows/*.yml` and `.github/workflows/*.yaml`. _Default: `false`_
- `allowed-workflow-files` (optional): Comma separated list of workflow files that are allowed when `allow-github-actions-workflow-updates` is enabled. Omit to allow all workflow files.
- `allow-prerelease-updates` (optional): Allow dependency updates where either old or new version is a prerelease (for example `1.2.3-beta.1`). _Default: `false`_

Both the workflow actor (`github.actor`) and the pull request author must be in `allowed-actors`.

You should configure this action to run on the `pull_request_target` event. If you use `pull_request` you might need to provide a custom `repo-token` which has permission to merge. [The default token for dependabot PRs only has read-only access](https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/).

## Outputs

A `success` output is set to `true` if a commit is eligible for auto merge.

## Example Action

```yaml
name: Auto Merge Dependency Updates

on:
  - pull_request_target

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - name: Auto Merge Dependabot Updates
        uses: buluma/gh-action-auto-merge-dependabot-updates@v1
        with:
          allowed-actors: dependabot-preview[bot], dependabot[bot]
```

If you prefer pinning to an exact release tag, use:

```yaml
uses: buluma/gh-action-auto-merge-dependabot-updates@1.1.0
```

## Hardened Example

```yaml
name: Auto Merge Dependency Updates

on:
  pull_request_target:
    types: [opened, synchronize, reopened, ready_for_review]

permissions:
  contents: write
  pull-requests: write

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    steps:
      - name: Auto Merge Dependabot Updates
        uses: buluma/gh-action-auto-merge-dependabot-updates@v1
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          allowed-actors: dependabot[bot], dependabot-preview[bot]
          allowed-update-types: devDependencies:minor, devDependencies:patch, dependencies:patch
          package-allow-list: '@actions/core,@actions/github,@types/node'
          package-block-list: typescript
          allow-prerelease-updates: 'false'
          allow-github-actions-workflow-updates: 'true'
          allowed-workflow-files: .github/workflows/dependabot-auto-merge.yml
          merge: 'true'
          merge-method: squash
```

Recommended branch protection for this job:
- Require status checks to pass before merging.
- Include your test/lint workflow checks as required checks.
- Limit who can push directly to the default branch.
