layout: pages/post.ts
type: post
date: 2018-04-08
title: Project Status with Git
---

If you're anything like me, you have a lot of projects going on and at times find it difficult to sync everything. You're not sure which project you contributed to lately, which project has discrepancies between local and remote origin and so on.

To combat this problem, I wrote a short bash script that presents us with general git status delivered in table format. It includes local and remote commit differences, current branch name, last commit message and its commit date. A bonus feature is that the script also provides you with an overview of the current projects you have ongoing.

## project-status

**project-status** consists of only two commands:

* `project-status` - get git status from the current working directory
* `project-status --list` - get git status for multiple projects (read paths from .projects file in home folder)

The output will then be something like:

```sh
Project Name   | L / R Diff  | Branch   | Last Commit                       | Commit Date
-------------  | ----------  | -------  | -----------                       | ------------
project A      | 1 / 0       | fix-431  | chore: Add node and python files  | 26 feb 18 (6 weeks ago)
project B      | 1 / 0       | feat-5   | chore: Add bash snippets          | 06 mar 18 (5 weeks ago)
project C      | 2 / 9       | master   | chore: update package.json        | 09 mar 18 (4 weeks ago)
```

For the future I'd like to add new columns, such as unmerged branches and new features like colors and sort capabilities.

You can get the source code on [github](https://github.com/samiralajmovic/scripts/blob/master/gh.sh).
