layout: pages/post.ts
type: post
draft: true
date: 2017-05-28
title: Generate Lorem Ipsum text
---

Similar to the previous post in terms of automating reoccurring development tasks and avoid leaving the terminal. This post will explore how to generate lorem ipsum text with a bash script, using [http://lipsum.com/](http://lipsum.com/) as the data source. The [lipsum site](http://lipsum.com/) has a UI for generating lipsum text but there's an API as well, so you can avoid using their UI.

I created a small github repo around this project, check it out at [github](https://github.com/samiralajmovic/lipsum-generator). It's basically a wrapper around the curl requests made to [lipsum.com](http://lipsum.com/).

## Lipsum.com

The API offers 4 parameters for retrieving text:

1. Paragraphs
2. Words
3. Bytes
4. Lists

And an option for determining if we want to start with the following paragraph:

> Lorem ipsum dolor sit amet...

## Curl'ing lipsum.com

lipsum.com offers a simple API which we can curl to get results. The results are returned in form of json.

## lipsum-generator

Here's what you get if you run `lip -h`. I might add offline support in the future, since currently you need internet access to generate lipsum text.

```bash
Lipsum-generator.

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

