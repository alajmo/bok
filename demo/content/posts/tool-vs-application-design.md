layout: pages/post.ts
type: post
draft: true
date: 2018-09-10
title: CLI Tools vs Application Design
---

TLDR:

- Spend as little time as possible on product development.
- Ramp up product development as soon as proof of product usefulness emerges.
- Have a perfection (minimalism, modularity, simplicity) attitude when building tools, a pragmatic vision when building applications.

* _What is this article about?_

We're going to cover the different approaches one ought to design tools and applications. It's important to be concious about type of tool / application is designing, the context it will live in and its predicted lifetime. It's not uncommon to overestimate or underestimate a tool / application's lifetime, and so we wrongfully spend either too little or too much time designing an tool / application.
But how can we know what the expected lifecycle of a project? We can't, and so it becomes more important to limit the amount of time spent developing a product until we get proof, that the product is being used. When we do get proof, we should ramp up development time to ensure the product maximizes its usefulness.
While these types of articles usually contain more of a feeling or meta discussion on design processes, I will try to give concrete suggestions on how to improve software development processes.

- _What type of problem are we solving?_

It's going to help us in designing software with the appropiate approach. At some point, it is necessary to favor certain ism's, especially in the beginning of a project. While we want all software to be adaptable, modifiable, follow different concepts DRY, KISS etc. it is unreasonable in the age of finite resources.

- _What is an example of the problem?_

One example is designing something like curl, a simple tool to make http(s) requests. The other is designing an ad hoc admin application that is used to accomplish certain tasks which may change in the future.

- _What is the solution to the problem?_

For tools it's important to keep a simple and expressive API surface and avoid feature creep. Ask yourself if it's possible to solve intended problems utilizing other tools.

For production applications focus on modifiability and adaptability since the software is bound to change throughout its lifecycle.
