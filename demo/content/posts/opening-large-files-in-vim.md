layout: pages/post.ts
type: post
draft: true
date: 2018-03-11
title: Opening large files in vim
---

Vim sometimes has trouble with files that have unusually long lines. It's a text editor, so it's designed for text files, with line lengths that are usually at most a few hundred characters wide.

Vim can swap changes to the disk as needed

*What is this article about?*

At times you need to edit or peruse a larger file. If you're anything like me, you've probably customized your vimrc to the likes of the TV show Pimp my ride.
For 99% of the time, it won't cause any issue, however for that 1% of the time when you need to open and perhaps edit a large file, you will most likely run into trouble, perhaps a `Not enough space in /var/tmp...` is what awaits you.

This post will demonstrate a couple of solutions to address the issue.

*What type of problem are we solving?*

## Example

For instance, run this command to create an unwieldly large file:
```sh
$ cat
```

*What is an example of the problem?*

*What is the solution to the problem?*

split command to split into multiple files
less, more, tail, head

Depending on your system, vi may enforce the default maximum line limit of 1,048,560. If the number of lines in your file exceeds this limit, start vi with the -yNumber option, which overrides the maximum line setting. You should set the maximum to twice the number of lines you need, because vi uses the extra lines for buffer manipulation.

  cd directory vi :set directory=/tmp :e filename

  df -k /var/tmp

The default directory (/var/tmp) for the vi editing buffer needs space equal to roughly twice the size of the file with which you are working, because vi uses the extra lines for buffer manipulation. If the /var/tmp directory does not have enough space for the editing buffer (e.g., you are working with a large file, or the system is running out of space), you will receive the following error message:

Not enough space in /var/tmp.

To identify the amount of space left in /var/tmp, use:

## Solution

To circumvent this I created an alias in my `.bashrc` which appends 3 flags to vim:

* -u NONE, skip all plugins
* -X, don't connect to the X server which will shorten the startup time
* -Z, restricted mode
* -R, read-only mode

`.bashrc`
```sh
alias vi='vim -u NONE -Z -X'
```

http://vim.wikia.com/wiki/Faster_loading_of_large_files

