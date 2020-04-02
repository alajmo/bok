layout: pages/post.ts
type: post
date: 2018-06-14
title: Recording terminal commands and generating GIFS
---

In this post, we'll go through how to create a script that records commands on the command-line and generates GIFS (Graphics Interchange Format) without having to record them manually.

## Background

Now I can't think of anything more helpful than short and descriptive information about how something works. It is especially crucial in tech (and Github projects), where tech jargon is abounding and explaining something to a non-technical (or even technical for that matter) person, is an art form in itself. In this regard, visual media accompanied by textual bits can provide the best of both worlds and give an idea to someone in a few seconds what the software does.

## Example

An example of a program where it helps to provide a visual demo in the form of a video or image is [tap-report](https://github.com/samiralajmovic/tap-report). tap-report is a TAP reporter that converts TAP output to a friendly and compact format. While it might be self-evident to someone who's heard of TAP (Test Anything Protocol) and is familiar with the terms TAP-producer and -consumer, it becomes clear what it means when we provide visuals of the software:

![example output of tap-report](https://github.com/samiralajmovic/tap-report/blob/master/media/output.gif?raw=true)

## Generating GIFS from the command-line

To generate the above image, we use a program called [asciinema](https://asciinema.org/), which enables you to

> Record and share your terminal sessions, the right way.

However, if you're into automation as much as I am, you'll realize that manually having to type the same commands, wait x seconds between each command and so on can get tiresome. So, we use some bash magic and write a script that we can run anytime we want to generate the GIFS! As a bonus, I included generation of the last sequence in the GIF as a PNG (Portable Network Graphics).

```sh
#!/bin/bash

set -eum
IFS=$'\n\t'

_init() {
  rm media/* -rf
  mkdir media/png
}

_simulate_commands() {
  # list of the commands we want to record
  # the | pv -qL 30 part is used to simulate
  # typing
  local CMD='
    clear
    export PS1="\$ "
    sleep 2s
    echo "$ node scripts/tap-report-example.js | tap-report" | pv -qL 30
    node scripts/tap-report-example.js | tap-report
    sleep 5s
    echo 1
  '

  asciinema rec -c "$CMD" --max-wait 100 --title tap-report --quiet media/output.json &
  fg %1
}

_generate_gif() {
  # Convert to gif
  docker run --rm -v "$PWD":/data asciinema/asciicast2gif -h 30 media/output.json media/output.gif
}

_generate_png() {
  # Generate png's from gif
  convert -verbose -coalesce media/output.gif media/png/output.png

  # Remove all png's except last sequence
  find media/png/*.png | sort -n -t "-" -k 2 | head -n -1 | xargs rm

  mv media/png/*.png media/output.png
  rm media/png -r
}

_main() {
  _init
  _simulate_commands
  _generate_gif
  _generate_png
}
_main

```
