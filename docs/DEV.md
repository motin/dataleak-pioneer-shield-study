# Developing this add-on

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Contents**

- [Preparations](#preparations)
- [Getting started](#getting-started)
- [Details](#details)
- [Loading the Web Extension in Firefox](#loading-the-web-extension-in-firefox)
- [Seeing the add-on in action](#seeing-the-add-on-in-action)
- [Format code using prettier and eslint --fix](#format-code-using-prettier-and-eslint---fix)
- [General Shield Study Engineering](#general-shield-study-engineering)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Preparations

- Download Developer and Nightly versions of Firefox (only Developer/Nightly will allow bundled web extension experiments, and Developer is the default target for the automated tests)

## Getting started

```shell
# install dependencies
npm install

## run
npm start

## run and reload on filechanges
npm run watch

## lint
npm run lint

## build
npm run build
```

Use [../web-ext-config.js](../web-ext-config.js) to configure testing preferences and which Firefox flavor the above commands should use. (Pioneer studies note: web-ext can not be used to launch Pioneer studies - refer to the Manual testing section below for Pioneer studies).

## Details

First, make sure you are on NPM 8+ installed:

```shell
npm install -g npm
```

Clone the repo:

```shell
git clone https://github.com/mozilla/jestr-pioneer-shield-study.git
```

After cloning the repo, you can run the following commands from the top level directory, one after another:

```shell
npm install
npm run build
```

This packages the add-on into an zip file which is stored in `dist/`. This file is what you load into Firefox.

## Loading the Web Extension in Firefox

You can have Firefox automatically launched and the add-on installed by running:

```shell
npm start
```

Note: This runs in a recently created profile, where no changes will be saved. For more information, see <https://developer.mozilla.org/Add-ons/WebExtensions/Getting_started_with_web-ext>

To automatically reload the extension on file changes:

```shell
npm run watch
```

To load the extension manually instead, open (preferably) the [Developer Edition of Firefox](https://www.mozilla.org/firefox/developer/) and load the `.zip` using the following steps:

- Navigate to _about:debugging_ in your URL bar
- Select "Load Temporary Add-on"
- Find and select the latest zip file you just built.

## Seeing the add-on in action

To debug installation and loading of the add-on, check the Browser Console that is automatically opened on start. (Usually accessible using Firefox's top menu at `Tools > Web Developer > Browser Console`).

This will display Shield (loading/telemetry) and log output from the add-on as long as the preference `shieldStudy.logLevel` is set to `All` or similar.

See [TESTPLAN.md](./TESTPLAN.md) for more details on how to see this add-on in action and hot it is expected to behave.

## Format code using prettier and eslint --fix

```shell
npm run format
```

## Generate stub code and API docs

```shell
npm run generate
```

Generates stub code and API docs from `src/privileged/*/schema.yaml` using <https://github.com/motin/webext-experiment-utils>.

## Manual testing

Launch the built add-on as already expired study:

```shell
EXPIRED=1 npm run test:manual
```

Launch the built add-on as expiring within a few seconds:

```shell
EXPIRE_IN_SECONDS=5 npm run test:manual
```

Launch the built add-on as with a specific variation set:

```shell
BRANCH=control npm run test:manual
```

Launch the built add-on with a very early and very short slumber period for testing purposes:

```shell
SLUMBER_START_DAY=0.0001 SLUMBER_END_DAY=0.0002 npm run test:manual
```

For more options, see the code at [./run-firefox.js](./run-firefox.js).

## Automated testing

```shell
npm test
```

Runs unit tests using Karma.

Code at [./test/unit/](./test/unit/). Configuration at [./karma.conf.js](./karma.conf.js).

Code coverage is instrumented by the istanbul babel plugin and is only enabled and reported for those files that use the babel preprocessor in [./karma.conf.js](./karma.conf.js).

Note: [The karma firefox launcher](https://github.com/karma-runner/karma-firefox-launcher) expects that the firefox binaries are located in slightly different places than `web-ext`. Example on how to workaround this on OSX:

```shell
cd /Applications/
ln -s FirefoxBeta.app FirefoxAurora.app
ln -s Firefox\ Nightly.app FirefoxNightly.app
```

## General Shield Study Engineering

Shield study add-ons are web extensions (`src/`) with at least one background script (`src/background.js`) and one or more embedded Web Extension Experiments (`src/privileged/*/api.js`) that allows them to run privileged code.

Privileged code allows access to Telemetry data, user preferences etc that are required for collecting relevant data for [Shield Studies](https://wiki.mozilla.org/Firefox/Shield/Shield_Studies).

It is recommended to build necessary logic and user interface using in the context of the web extension whenever possible and only utilize privileged code when strictly necessary.

For more information, see <https://github.com/mozilla/shield-studies-addon-utils/> (especially <https://github.com/mozilla/shield-studies-addon-utils/blob/master/docs/engineering.md>).
