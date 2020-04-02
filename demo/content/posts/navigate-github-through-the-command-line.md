layout: pages/post.ts
type: post
date: 2017-07-02
title: Navigate Github Through the Command Line
---

Anytime you catch yourself repeating the same action over and over again, you should consider automating that process.
In one particular case, I found myself frequently navigating to pull-request's associated with the branch I was on. This action is rather tedious as I had to open a new tab on my browser and browse to the corresponding section on Github.
I needed a new, quick and hassle free way to access the pull-request from the command line. And so, project [github-cli](https://github.com/samiralajmovic/github-cli) was born.

My goal was not to replace Github's GUI, in fact, I find it pretty decent, and I don't  want to do everything from the terminal. Furthermore, GUI's are better suited for certain applications. Therefor, [github-cli](https://github.com/samiralajmovic/github-cli) doesn't create pull-requests, issues, etc., it only positions you inside Github's own GUI to do so.

## github-cli

> A way to navigate to specific `github.com` sections from the command-line. `github-cli` is context aware and allows one to navigate to issues, commits, branches and pull-requests effortlessly.

### Examples

For instance, let's take the case I mentioned earlier: navigating to a pull-request that's associated with a branch. Assume that we have repository `example-repo`, which has pull-request `11` associated with it. The pull-request, in turn, is based on branch `example-branch`.

If we are standing under said repository and branch `example-repo`, running the following command in the terminal:

```sh
samir ~/example-repo/ (example-branch) $ gh p
```

Will result in a new browser tab with URL

`https://github.com/samiralajmovic/example-repo/pull/11`.

On the other hand, if there is no pull-request associated with the branch, you will be navigated to

`https://github.com/samiralajmovic/github-cli/compare/master...example-branch-2`,


one click away from creating a pull-request.

There are a bunch of other commands used to quickly navigate Github; you can check them out at [github-cli](https://github.com/samiralajmovic/github-cli).

## Lessons learned

* Github treats all pull-requests as issues, whereas all issues are not pull-requests.
* If no match is found grep exits with error code 1.
* Pretty hard to write integration tests for these kinds of CLI programs!

## Roadmap

For now, `github-cli` feels about 95 % feature complete. However, I'd like to add bash auto-completion and if I find myself repeating some task related to Github and the terminal, I'll add it.
