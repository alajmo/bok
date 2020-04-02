layout: pages/post.ts
type: post
draft: true
date: 2018-03-10
title: Huel, a web development tool
---

Frontend development is cumbersome. Its representation is often a constellation of loosely held strings holding an abstract object in the air, just waiting to come crashing down upon us. So what landed us here? In my opinion, this pain is not self-inflicted and is caused by multiple reasons.

1.  The underlying architecture of the web is moving forward at an incredible rate
2.  The web belongs to no one
3.  The web consists of multiple browsers, each with their own peculiarities
4.  Previous build systems had their fair share of flaws
5.  Previous build systems rested on the shoulders of a single developer, often developed as open-source and without a revenue stream
6.  There are many types of web applications with different requirements

The community has gone through multiple build tools, from Grunt, Gulp, Browserify, Webpack and most recently Parcel. Each and everyone has their pains and gains. Mostly they differ in how they approach the problem. **Grunt** and **Webpack** use **configuration over code** while **Gulp** uses **code over configuration**. One thing they all have in common though is configuration bloat that comes with 3rd party plugins like *babel*, *eslint*, *prettier*, *postcss* etc. This bloat shows in form of additional files (either JSON, YAML or Javascript) or keys in your `package.json`.

For me it's important to be able to have clear view over a project and the introduction of multiple configuration files often skew this view. So my motivation for Huel came from that area, I attain to get rid of all the configuration files that clutter the file structure and have simple scripts in my package.json that uses huel behind the scene and sane defaults. A project should as much as possible focus on the business logic and its implementation and not have build tool residues sprinkled over the project which obfuscate our perception.
There are many ways we can gage a project structure, get information and become familiar with it. One option is to peruse the file structure and thus it plays an important role how we get familiar with a particular project. Another one is to look at the router files (for web projects).

## The Solution, Huel

A highly opinionated build and development tool for the web. A wonderful concatenation
of the following tools, hidden behind a minimalistic command-line-interface:

* Module bundler, [webpack](https://github.com/webpack)
* Next-gen javascript, [babel](https://github.com/babel/babel)
* Next-gen css, [postcss](https://github.com/postcss/postcss)
* Code formatter, [prettier](https://github.com/prettier/prettier)
* Code linter, [eslint](https://github.com/eslint/eslint)
* Git commit hooks, [husky](https://github.com/typicode/husky)
* Commit message linter, [commitlint](https://github.com/marionebl/commitlint)
* Changelog generator, [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)
* Sync dependencies between node_modules and package.json and check for unused modules, [depcheck](https://github.com/depcheck/depcheck)
* package.json validator, [package-json-validator](https://github.com/gorillamania/package.json-validator)
* Size limit checker, [size-limit](https://github.com/ai/size-limit)
* Check that modules are synced between package.json and package[check-dependencies](https://github.com/mgol/check-dependencies)
* Browser based Webpack dashboard, [jarvis](https://github.com/zouhir/jarvis)
* Webpack plugin time measure, [speed-measure-webpack-plugin](speed-measure-webpack-plugin)
* Validate node versions
* Enforce strict module versioning for dependencies in package.json

You can find code at [github/samiralajmovic/huel](https://github.com/samiralajmovic/huel/issues/15).

## Usage

So this is the package.json script (which will most likely change in the future as I use it in production), you get it this when you run `huel init --scripts --git-hooks`, or add the `--dry-run` flag to see what would be executed:

```json
  "scripts": {
    "start": "huel build --env development --debug -w -p 1337 -t test/examples/app/src/index.html -e test/examples/app/src/index.js -o test/examples/app/dist/",
    "start-prod": "huel build --env production --debug -w -p 1337 -t test/examples/app/src/index.html -e test/examples/app/src/index.js -o test/examples/app/dist/",
    "build": "huel build --env production -t test/examples/app/src/index.html -e test/examples/app/src/index.js -o test/examples/app/dist/",
    "build-debug": "huel build --env production --debug -t test/examples/app/src/index.html -e test/examples/app/src/index.js -o test/examples/app/dist/",
    "build-dev": "huel build --env development --debug -t test/examples/app/src/index.html -e test/examples/app/src/index.js -o test/examples/app/dist/",
    "eslint-check": "eslint --print-config config/.eslintrc | eslint-config-prettier-check",
    "lint": "huel lint --src src",
    "lint-watch": "huel lint -w",
    "format": "huel format --src src",
    "format-watch": "huel format -w",
    "commitlint": "huel commitmsg",
    "test": "huel test --pjv --strict-version --size --nodecheck --moduleversioncheck --modulenodecheck --extraneous-modules --update-check",
    "changelog": "huel changelog && git add CHANGELOG.md && git commit -m \"chore: update changelog\""
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run format",
      "pre-push": "npm test",
      "pre-publish": "npm test",
      "commit-msg": "npm run commitlint"
    }
  }
```

Also in there is the husky scripts which define git hooks that execute whenever I interact with git. I only test when I push and I only format code when I commit. While not yet implemented I plan on adding linting whenever I merge with master as I want to be able to commit code that doesn't pass eslint rules for faster development iterations.

## Lessons Learned

### Feature Implementation

For a while I used to get ideas and then implement them. This method of feature implementation is flawed is what I have come to see as an idea does not mean it's actually useful or will be used in production.

### Complexity Removal

Remove complexity, I started with adding --format and --lint flags to the build command but soon realized that it's uneccessary complexity since I already have lint and format commands which can be used in conjunction with huel build and so it's uneccessary.

#### MUP

Use MVP or MUP (minimal usable product), start using as soon as possible

#### Avoid Micro Edits

Avoid easy changing feeling productive inducing changes such as name changes, grammar editing etc.

## Roadmap

Currently Huel is in alpha mode and will advance to beta once it's [feature complete](https://github.com/samiralajmovic/huel/issues/15) and testing is set up. In beta mode I will focus on tests and making sure it's robust. My plan is to develop this module as I use it in production and most likely feature additions will stem from production use.
