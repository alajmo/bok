layout: pages/post.ts
type: post
draft: true
date: 2018-09-10
title: Best practise for standard ui web apps
---

Ask the question:

What are you building and take two extremes:

All part of the app is specific so it is impossible to develop a general encompassing template/object/component.
No part of the app is specific, all at least share 1 commonality with another object.

What makes a design a good design? How do we measure it?

Costs
The need of naming stuff

Atomic CSS

What's time complexity for each operation(by human)?

Read: O(sigh)

Insert: O(1)

Delete: O(n)

Update: O(n)

Pre-BEM era CSS

What's time complexity for each operation(by human)?

Read: kinda O(1)

Insert: O(1)

Delete: O(1) without garbage collect (unused css)

Update: kinda O(n^n)

That's a quick thought, maybe your operations are more arbitrary.

Probably when someone introduces new css framework/technique, showing some kind of complexity measurement (if possible) would be good idea?

To find best practise, what are we trying to optimize?

1. Speed of development
2. Minimize bugs

Developer Stories:

1. A lot of people jump in and out of the projects
2. Need to be adaptable & maintainable
3. Devs will need to map UI to code quickly
4. I want to change the style big time of the entire app (colors, paddings, etc)
5. I want to modify a small part of the app
6. What is developer friendly? (who remembers classnames)
7. App needs to be iterated upon

## 4. Devs will need to know that changing x does not affect y

### General Components

- make this hard
+ but less code
+ easy to refactor

### Specific Components

- but more code
- harder to refactor
+ make this easy

Specific Components make this easy - but more code

Caveats
We developers sometime in lack of better things to do, make working

Separate each element into it's own part, since new elements can come before, after, element can switch place and thus too tight layout coupling in css is dangerous

A good component / html / css class is one which does not depend on the semantic element it is placed on nor where that element is placed in the DOM

for instance, a media object which holds content in different ways

js-<name> prefix with js- to signal identifiers which are only used for js hooks


singleclass pattern
```css
.btn, .btn-primary { /* button template styles */ }
.btn-primary { /* styles specific to save button */ }

<button class="btn">Default</button>
<button class="btn-primary">Login</button>.btn, .btn-primary { /* bu
```

multiclass pattern
```css
.btn { /* button template styles */ }
.btn-primary { /* styles specific to primary button */ }

<button class="btn">Default</button>
<button class="btn btn-primary">Login</button>
```

todays devs don't want to think, and that's also somehow makes sense with how we work, being distracted all the time, shorter concentration spans,

Still, if we found ourselves in a new application, we have to take the time to scan the existing patterns
