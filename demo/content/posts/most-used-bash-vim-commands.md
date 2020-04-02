layout: pages/post.ts
type: post
draft: true
date: 2018-03-10
title: Bash, Vim tips and tricks
---

## Bash

https://explainshell.com/explain?cmd=ls+-al#

hr plugin
c-a to increment

<c-a> increment
<c-x> decrement

nnoremap <leader>td "=strftime("%Y-%m-%d")<cr>P
nnoremap <leader>ts "=strftime("%Y-%m-%d %H:%M:%S")<cr>P

hidden commands Common bash / vim / node tools used

inputrc
```sh
# Auto-complete on tab instead of tab-tab
set show-all-if-ambiguous on
```

vimrc

```
Generate current date
Increment / decrement
Toggle boolean
visql - edit sqlite files
```


bash process tldr instead of man pages for basic functionality

## Vim

; * #

fzf, especially alt - c to go to directory

:lopen, see error list, goes with :lnext, :lprev

@:, repeat last command, goes together with all commands!

capital I
capital A
search replace add newline \r
```vim
# Add ! at the end of a command to toggle a command (for instance, toggle spellcheck)
:set spell!

# Execute command from terminal without exiting vim (<command> can for instance be wc to count the number of words)
:! <command> %

# Reading command output (for instance read directory content)
:r ! ls -1 <path>

# Copy file content to current buffer
:r textfile

# Repeat last colon command
@:

# Display Word count
g + ctrl-g

# Show errors
:lopen

# Execute cmd in each valid entry in quickfix list (for instance find-replace)
: cdo s/pattern/newpattern/g
```

The <C-U> in the mapping tells vim that after the : is entered the Control+U combination should be used to clear the command line, eliminating the automatically inserted range leaving the command line looking like:

the command, :!
!{motion}{filter}       Filter {motion} text lines through the external
                        program {filter}.

## Misc

git config --global core.excludesfile '~/.gitignore'

https://regexper.com/#[aZ]
grammarly.com/
https://httpstatuses.com/
https://devdocs.io/
https://semver.npmjs.com/

ctrl-x ctrl-e, edit current line in bash in vim

g- g+, step backward/forward in time

run vim between pipes http://manpages.ubuntu.com/manpages/trusty/en/man1/vipe.1.html

***************************** vifm *****************************

***************************** grv git-repository-viewer *****************************

:read !ls -l

:norm

:undofile

; command

g+
g-

. command

Remove current file
:!rm %:p

''

gD global definition
gd local definition
gf file under cursor
g] go to tag definition
remapped to CTRL-B
CTRL-T go back

CTRL-e-escape, escape shell variables like !! becomes the last command (cat README.md for instance)
https://www.gnu.org/software/bash/manual/html_node/Miscellaneous-Commands.html

:vsplit
:split
open buffers

zc, zo, zM

Search replace all buffers
:bufdo %s/pattern/replace/ge | update
vim quickfix window

C-I to jump forward
C-O to jump backwards
works for both tags and navigation

vifm
vimdiff

:qa
ctrl - w - v open vertical split window
