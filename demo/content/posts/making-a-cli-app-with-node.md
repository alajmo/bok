layout: pages/post.ts
type: post
date: 2017-06-23
title: Building a Command Line Tool (CLT) in Node
---

Recently I published a command line tool (CLT) to the npm registry. The module in question was [pure-html](https://github.com/samiralajmovic/pure-html/tree/master), a development environment for creating standalone HTML files. I will detail some of the things I learned during that process, and what parts are necessary to publish your module to the npm registry.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Project Structure](#project-structure)
  - [package.json](#packagejson)
  - [npm-shrinkwrap.json](#npm-shrinkwrapjson)
  - [.npmignore/.gitignore](#npmignore/gitignore)
  - [bin/example-cli](#binexample-cli)
- [Before Publishing](#before-publishing)
- [The End](#the-end)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Project Structure

At a minimum, the project should contain these files:
```js
|-- package.json // The manifest of every node project.
|-- npm-shrinkwrap.json // Ensure a deterministic tree of dependencies.
|-- .npmignore / .gitignore // Only publish what's needed.
|-- bin
|   \ -- example-cli // Starting point for the command line tool.
```

### package.json

The package.json is the backbone to any node project, including command line tools. Now, there are some fields one should pay attention to regarding CLT's and which should always be included:

```json
{
  "name": "example-cli",
  "main": "bin/example-cli",
  "bin": {
    "example-cli": "./bin/example-cli"
  },
  "files": [
    "index.js",
    "lib.js"
  ],
  "devDependencies": {
    "tape": "^4.6.3"
  },
  "dependencies": {
    "gulp": "github:gulpjs/gulp#4.0"
  }
}
```

I think it's best practice to use the same value for the name property as for the main file. In this example, the name is `example-cli`. Installing this tool globally by running the following snippet

The **files** key refers to which files get included in the npm package you publish (you can test this by running `tar tvf $(npm pack)`).

```bash
$ npm install -g example-cli
```

would result in the following directory structure (wherever your global npm modules are installed, run `npm get prefix` to see where):

```js
|-- bin
|   \ -- example-cli
|     -- some-other-cli
|-- lib
|   \ -- node_modules
|       \ -- example-cli/
|         -- some-other-cli/
```

Then by entering `example-cli` in your terminal, `bin/example-cli` would reference `lib/example-cli/bin/example-cli`.

**devDependencies**

It's important to be aware of the main differences between the `package.json` fields `dependencies` and `devDependencies`:

> A module under devDependencies **will not** be installed whereas all modules under dependencies will be installed when a user runs npm install -g example-cli.

In my case, `gulp`, which is usually installed under `devDependencies`, was installed under `dependencies` since `pure-html` depends on it at runtime.

You can read more about `package.json` [here](https://docs.npmjs.com/files/package.json).

### npm-shrinkwrap.json

The `npm-shrinkwrap.json` file ensures a consistent tree of dependencies is installed. This is especially important in node projects since they often depend on many other modules. To generate `npm-shrinkwrap.json` run the following command:

```sh
$ npm shrinkwrap
```

In case a file called `package-lock.json` exists, it will rename that file to `npm-shrinkwrap.json`. One of the differences between `npm-shrinkwrap.json` and `package-lock.json` is that `package-lock.json` is ignored when you publish your module to the npm registry.

### .npmignore

Here you put everything that you don't want to get published. In my case, I had two entries:

1. A config file I used for development,
2. and the test folder.

### bin/example-cli

This is the main point of entry, the file which will be executed once the user enters `example-cli` in the terminal. Other than your business logic, make sure the following line is found at the top of the file:

```js
#!/usr/bin/env node
```

It tells the terminal that node should be executing your `CLT`.

## Before Publishing

To ensure the tool works, I recommend running the following command:

```bash
$ npm install . -g
```

inside the `example-cli` directory. Afterward, check that you can execute the CLT from some other directory.

Additionally, if you want to peruse what will be published, run the following command:

```bash
$ npm pack
```

This will produce an archive of your project, for instance, `example-cli-0.1.0.tgz`, assuming our node project name is `example-cli` and the version is `0.1.0`. The contents of `example-cli-0.1.0.tgz` will be the same as the one published to the npm registry.

## The End

Run `npm publish` and enjoy the fruits of your labor.
