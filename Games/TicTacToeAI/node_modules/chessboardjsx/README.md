# UNMAINTAINED



<div align="center" markdown="1">

<img src="./src/img/lucena.png" alt="lucena position" width="200">
<img src="./src/img/carlsenWorldChampionship2016.png" alt="Carlsen 2016 Championship" width="200">
<img src="./src/img/sicilian.png" alt="sicilian defense" width="200">

**A chessboard for React inspired by [chessboard.js](https://github.com/oakmac/chessboardjs)**

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![PRs Welcome][prs-badge]][prs]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]
[![Commitizen friendly][commitzen-badge]][commitzen]
[![semantic-release][semantic-release-badge]][semantic-release]

</div>


## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save chessboardjsx
```

The package also depends on [React](https://reactjs.org/). Make sure you have that installed as well.

## Usage

* [Props](https://www.chessboardjsx.com/props): get started with Chessboard.jsx
* [With move validation](https://www.chessboardjsx.com/integrations/move-validation): how to integrate [chess.js](https://github.com/jhlywa/chess.js)
* [Integrating with chess engines](https://www.chessboardjsx.com/integrations/stockfish): how to integrate with Stockfish, the ~~world's strongest~~ [world's second strongest](https://www.chess.com/news/view/google-s-alphazero-destroys-stockfish-in-100-game-match) chess engine
* [Custom](https://www.chessboardjsx.com/custom): customize the board and pieces

## Contributing

Please take a look at CONTRIBUTING.md to find out how to contribute.

## What is Chessboard.jsx?

Chessboard.jsx is a React component with a flexible "just a board" API modeled from [chessboard.js](https://github.com/oakmac/chessboardjs). It's compatible with touch as well as standard HTML5 drag and drop.

## What can Chessboard.jsx **not** do?

The scope of Chessboard.jsx is limited to "just a board." This is intentional and
makes Chessboard.jsx flexible for handling a multitude of chess-related problems.

Specifically, Chessboard.jsx does not understand anything about how the game of
chess is played: how a knight moves, who's turn is it, is White in check?, etc.

Fortunately, the powerful [chess.js](https://github.com/jhlywa/chess.js) library deals with exactly this sort of
problem domain and plays nicely with Chessboard.jsx's flexible API.

Here is a list of things that Chessboard.jsx is **not**:

* A chess engine
* A legal move validator
* A PGN parser

Chessboard.jsx is designed to work well with any of those software components, but the idea
behind the library is that the logic that controls the board should be
independent of those other domains.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/10157307?v=4" width="100px;"/><br /><sub><b>Will</b></sub>](https://github.com/willb335)<br />[💻](https://github.com/willb335/chessboardjsx/commits?author=willb335 "Code") [📖](https://github.com/willb335/chessboardjsx/commits?author=willb335 "Documentation") [💡](#example-willb335 "Examples") [⚠️](https://github.com/willb335/chessboardjsx/commits?author=willb335 "Tests") | [<img src="https://avatars3.githubusercontent.com/u/146082?v=4" width="100px;"/><br /><sub><b>Andrew Bashelor</b></sub>](https://github.com/a-bash)<br />[📖](https://github.com/willb335/chessboardjsx/commits?author=a-bash "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/25490975?v=4" width="100px;"/><br /><sub><b>yougotgotyo</b></sub>](https://chadburg.com/)<br />[🤔](#ideas-yougotgotyo "Ideas, Planning, & Feedback") | [<img src="https://avatars0.githubusercontent.com/u/385366?v=4" width="100px;"/><br /><sub><b>Roger Knapp</b></sub>](http://csharptest.net)<br />[🤔](#ideas-csharptest "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/37779?v=4" width="100px;"/><br /><sub><b>Tiago Serafim</b></sub>](https://github.com/slig)<br />[💻](https://github.com/willb335/chessboardjsx/commits?author=slig "Code") [📖](https://github.com/willb335/chessboardjsx/commits?author=slig "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/536006?v=4" width="100px;"/><br /><sub><b>Kef Schecter</b></sub>](http://www.furrykef.com/)<br />[🐛](https://github.com/willb335/chessboardjsx/issues?q=author%3Afurrykef "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/42919?v=4" width="100px;"/><br /><sub><b>Nils-Helge Garli Hegvik</b></sub>](http://www.lånekalkulatoren.no)<br />[💻](https://github.com/willb335/chessboardjsx/commits?author=nilsga "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/10798199?v=4" width="100px;"/><br /><sub><b>Levi Durfee</b></sub>](https://levi.lol/)<br />[💻](https://github.com/willb335/chessboardjsx/commits?author=levidurfee "Code") [📖](https://github.com/willb335/chessboardjsx/commits?author=levidurfee "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/12105346?v=4" width="100px;"/><br /><sub><b>Chris</b></sub>](https://github.com/altruisticsoftware)<br />[💻](https://github.com/willb335/chessboardjsx/commits?author=altruisticsoftware "Code") | [<img src="https://avatars.githubusercontent.com/u/43761176?v=4" width="100px;"/><br /><sub><b>Harrison Kerr</b></sub>](https://hwkerr.github.io/)<br />[💻](https://github.com/willb335/chessboardjsx/commits?author=hwkerr "Code") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/willb335/chessboardjsx.svg?style=flat-square
[build]: https://travis-ci.org/willb335/chessboardjsx
[coverage-badge]: https://img.shields.io/codecov/c/github/willb335/chessboardjsx.svg?style=flat-square
[coverage]: https://codecov.io/github/willb335/chessboardjsx
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[version-badge]: https://img.shields.io/npm/v/chessboardjsx.svg?style=flat-square
[package]: https://www.npmjs.com/package/chessboardjsx
[license-badge]: https://img.shields.io/npm/l/chessboardjsx.svg?style=flat-square
[license]: https://github.com/willb335/chessboardjsx/blob/master/LICENSE
[commitzen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitzen]: http://commitizen.github.io/cz-cli/
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
