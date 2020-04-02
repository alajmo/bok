layout: pages/post.ts
type: post
date: 2017-05-13
title: Generate Boilerplates with Bash
---

I often find myseld creating the same files over and over again. So, in the spirit of automation, I created a boilerplate generator in bash. No need for the old googling and **ctrl-c** + **ctrl-c** anymore.
You can find the project at [github](https://github.com/samiralajmovic/boilerplate-generator).

## Installation

Get the project from [github](https://github.com/samiralajmovic/boilerplate-generator) and to execute the script from any directory, you'll want to do 2 things:

* Set the scripts directory path to $PATH.
* Create a symlink to avoid writing bash extension `.sh`.

### Add Path

I'll assume that you downloaded the project and placed it in your home folder under `bin/boilerplate-generator`. In that case, you'll need to add:

```sh
export PATH="$HOME/bin/boilerplate-generator:$PATH"
```

to your .bashrc file. It's usually located in your home folder.

### Symlink

Create a symlink to bp.sh by running the following command:

```sh
$ ln -s ~/bin/boilerplate-generator/bp.sh ~/bin/boilerplate-generator/bp
```

## Usage

```bash
Bob boilerplate generator.

Usage:
  bp [options] [arguments]
  bp -h | --help

Options:
  -h --help         Print this help.
  -v --version      Print script version.

  -l, --list                       List all boilerplates.
  -b [file], --boilerplate [file]  Generate boilerplate file.
  -p [file], --preview [file]      Preview boilerplate.
  -d [path], --dest [path]         Optional new file destination.

Examples:
  bp -b index.html
  bp -b index.html -d /src/index-1.html
```

## Future

I consider the script feature complete. However, I might add some additional features in the future, such as:

* Directory generation.
* Variable substitution.
* Option -b, --boilerplate should be able to take multiple arguments.

## Inspiration

The structure of the bash script is heavily inspired by [alphabetum](https://github.com/alphabetum) github repo [bash-boilerplate](https://github.com/alphabetum/bash-boilerplate).
