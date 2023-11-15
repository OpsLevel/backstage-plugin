# Contributing

1. [About this document](#about-this-document)
2. [Proposing a change](#proposing-a-change)
3. [Getting the code](#getting-the-code)
4. [Local development](#local-development)
5. [Submitting a Pull Request](#submitting-a-pull-request)
6. [Releasing](#releasing)

## About this document

This document is a guide intended for folks interested in contributing to `@opslevel/backstage-maturity`. Below, we document the process by which members of the community should create issues and submit pull requests (PRs) in this repository. This guide assumes you are using macOS and are comfortable with the command line.

If you're new to Node development or contributing to open-source software, we encourage you to read this document from start to finish.

## Proposing a change

This project is what it is today because community members like you have opened issues, provided feedback, and contributed to the knowledge loop for the entire community. Whether you are a seasoned open source contributor or a first-time committer, we welcome and encourage you to contribute code, documentation, ideas, or problem statements to this project.

### Defining the problem

If you have an idea for a new feature or if you've discovered a bug, the first step is to open an issue. Please check the list of [open issues](https://github.com/OpsLevel/backstage-plugin/issues) before creating a new one. If you find a relevant issue, please add a comment to the open issue instead of creating a new one.

> **Note:** All community-contributed Pull Requests _must_ be associated with an open issue. If you submit a Pull Request that does not pertain to an open issue, you will be asked to create an issue describing the problem before the Pull Request can be reviewed.

### Submitting a change

If an issue is appropriately well scoped and describes a beneficial change to the codebase, then anyone may submit a Pull Request to implement the functionality described in the issue. See the sections below on how to do this.

The maintainers will add a `good first issue` label if an issue is suitable for a first-time contributor. This label often means that the required code change is small or a net-new addition that does not impact existing functionality.

## Getting the code

### Installing git

You will need `git` in order to download and modify the source code. On macOS, the best way to download git is to just install [Xcode](https://developer.apple.com/support/xcode/).

### External contributors

If you are not a member of the `OpsLevel` GitHub organization, you can contribute by forking the repository. For a detailed overview on forking, check out the [GitHub docs on forking](https://help.github.com/en/articles/fork-a-repo). In short, you will need to:

1. fork the repository
2. clone your fork locally
3. check out a new branch for your proposed changes
4. push changes to your fork
5. open a pull request from your forked repository

### OpsLevel contributors

If you are a member of the `OpsLevel` GitHub organization, you will have push access to the repo. Rather than forking to make your changes, just clone the repository, check out a new branch, and push directly to that branch.

## Local Development

### Installation

To see the plugin in action, first make sure you have a working version of the plugin tied to your Backstage instance by following the [installation instructions](https://github.com/OpsLevel/backstage-plugin#install-plugin) from the README.

Due to the difficulties of plugin development across yarn workspaces, we also provide [Storybook](https://storybook.js.org/) to allow development of the plugin. As you add new components, ensure that they are visible in Storybook so that you they can be validated without having to package and move a plugin into Backstage.

```sh
yarn storybook
```

### Changie (Change log generation)

Before submitting the pull request, you need add a change entry via Changie so that your contribution changes can be tracked for our next release.

To install Changie, follow the directions [here](https://changie.dev/guide/installation/).

Next, to create a new change entry, in the root of the repository run: `changie new`

Follow the prompts to create your change entry - remember this is what will show up in the changelog.  Changie registers the change in a .yaml file, and that file must be included in your pull request before we can release.

## Submitting a Pull Request

OpsLevel provides a CI environment to test changes through Github Actions. For example, if you submit a pull request to the repo, GitHub will trigger automated code checks and tests upon approval from an OpsLevel maintainer.

A maintainer will review your PR. They may suggest code revision for style or clarity, or request that you add unit or integration test(s). These are good things! We believe that, with a little bit of help, anyone can contribute high-quality code.
- First time contributors should note code checks + unit tests require a maintainer to approve.

Once all tests are passing and your PR has been approved, a maintainer will merge your changes into the active development branch. And that's it!  It will be available in the next release that is cut. Happy developing :tada:

## Releasing

To release a new version, you will need to be a maintainer of the package and have access to [OpsLevel](https://app.opslevel.com).

1. Navigate to the [service](https://app.opslevel.com/services/backstage_plugin).
1. Click the "Actions" button.
1. Click the "Release" button.
1. Ignore the "version bump type". Versioning will be automatically handled by Changie and this drop down is ignored for this library.
1. Click "execute".