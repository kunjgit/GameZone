# Doppelkopf
[![Build status](https://circleci.com/gh/hamvocke/doppelkopf.svg?style=svg)](https://circleci.com/gh/hamvocke/doppelkopf)
[![codecov](https://codecov.io/gh/hamvocke/doppelkopf/branch/master/graph/badge.svg?token=00G78SO5HF)](https://codecov.io/gh/hamvocke/doppelkopf)

An in-browser implementation of the traditional German [Doppelkopf](https://en.wikipedia.org/wiki/Doppelkopf) card game.

## Live Demo
[![Screenshot](https://i.imgur.com/qQPyE3I.png)](https://doppelkopf.party)

<h3 align="center"><a href="https://doppelkopf.party/">Try the Live Demo at doppelkopf.party</a></h3>

## Features

This game has been in development for a while and still isn't feature complete. While you'll get a pretty solid experience of the basic game, you will see that some things you might expect from a Doppelkopf game are still missing. Also, note that this game is strictly desinged to be a single player game. You won't be able to play against real humans with this game.

Things that are not yet part of the game but are planned to be built eventually include:

* [ ] Playing solo
* [ ] Weddings ("Hochzeit")
* [ ] Custom rules: "Karlchen", "Zweite Dulle sticht die erste", "Schweinchen", etc.

## Development
The game is implemented using Typescript and [vue.js](https://vuejs.org/). It's a small, frontend-only standalone web application that can be hosted anywhere you can host static websites. It's using [Vite](https://vitejs.dev/) for building, bundling, and running the application locally.

### Getting Started

To work on the application, check out this repository and open the root of this repo in your terminal.`s

Make sure you use the latest node LTS version.

Install dependencies:

    npm install

Serve the development server on [localhost:5173](http://localhost:5173).

    npm run dev

Run the tests before and after making changes:

    npm run test

Format your code via:

    npm run format

Lint your code via:

    npm run lint

And build for production (with minification) using:

    npm run build

### Code Style
We're using vue's single-file components with `<script setup>`. Check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more about this pattern.

We're using [composition style API](https://vuejs.org/guide/introduction.html#api-styles) for vue components.

Vue components are strictly only doing UI work. The entire game logic lives outside of vue components and is completely framework-agnostic. The game code shouldn't know whether the game is running in a browser or any other environment. The `models/` directory is the home of the game logic exclusively. Separating UI from game logic allows us to test-drive our game logic's implementation and makes the game independent of any chosen frontend technology. There are no plans to use anything else than vue for the foreseeable future, but keeping that option is good and helps us keep the codebase healthy in the long-term.

### Testing
We're very serious about testing. All bug fixes and new features should come with new tests. Unit tests with [Jest](https://jestjs.io/) and frontend end-to-end tests with [nightwatch.js](https://nightwatchjs.org/).

### IDE Setup
If you want to set up your development environment, here are a few helpful pointers:

For [VSCode](https://code.visualstudio.com/), use the [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) plugin to work with vue seamlessly.

We're using [prettier](https://prettier.io/) to format the code. Either set up your editor of choice to integrate prettier or make sure to run prettier before committing changes via `npm run format`.

We're also using [eslint](https://eslint.org/) for static code analysis and to point out and find potential problems and inconsistencies. You can run it via `npm run lint` or by setting up your editor of choice correctly.

## Contributing
Contributions in the form of feature requests, bug reports, and small bug fixes are welcome. I am **not** looking for pull requests that introduce new or change existing functionality in a non-trivial way. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.
