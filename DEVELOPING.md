# Developing

## Pre-requisites

1. Node.js version >= 10.0.0
1. Install Yarn globally using `npm install -g yarn`.
   We use `tslint` so please install it using `npm install --global tslint`.
1. There is a list of recommended extensions for this workspace in
   .vscode/extensions.json. The first time you open VS Code on this workspace,
   it will ask you to install them. **Please do so since this includes the
   linters and formatters**.

## Typical workflow

1. Clone this repository from git `git clone https://github.com/ProvarTesting/provardx-vscode.git`
1. `cd` into `provardx-vscode`
1. We develop on the `development` branch and release from the `master` branch. Checkout
   development branch `git checkout -t origin/development`.
1. `yarn` to bring in all the top-level dependencies

## List of Useful commands

### `yarn run pretest`

Compiles the code and also shows lint issues.

### `yarn run test`

This runs tests.

### `yarn run prettier`

This command formats the code with the given rules/config.

### `yarn run prettier:verify`

This command lists all the files which are failing as per prettier config.
