layout: pages/post.ts
type: post
draft: true
date: 2016-09-24
title: Reactive Programming with Cycle.js
---

Recently I've been looking into a programming paradigm called FRP - functional reactive programming.

> Functional reactive programming (FRP) is a programming paradigm for reactive programming (asynchronous dataflow programming) using the building blocks of functional programming (e.g. map, reduce, filter).

Now I normally like to endulge directly with an implementation and learn as a go, instead of focusing on the theory behind it first. This time, it might have been the wrong approach as there are so many new concepts to learn and it differs from the good old imperative programming style.

In this post I'll just recap a bit about how you can get started with Cycle and help those coming from an imperative background, as I did. The official documentation does a marvellous job of explaining Cycle and FRP. However, I hope that this smallish introduction from a layman perspective can help you bridge the gap to going FRP. This post won't be structurally sound or anything like that, but rather I'll just throw out some important concepts like the design pattern used, doing normal stuff like creating static views not based on any state and how to approach learning Cycle.js.

## Cycle

Cycle is based on a pattern called the [Observeable Patter](https://en.wikipedia.org/wiki/Observer_pattern). The general gist is:

> The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods. https://en.wikipedia.org/wiki/Observer_pattern

I do enjoy one of the problems FRP is trying to solve and that's data flow between components. If you have a multitude of components, states and they all need to exchange data, then writing imperative code can quickly grow overwhelming and bothersome. This is because you are responsible for changing the state in each and every component which depends on a state not defined within its own boundaries.

Now, cycle.js introduces its own terminology for common doings when building applications and I must say that at first, I was a bit overwhelmed. There are so many new patterns and a whole new set of terminology to learn. I'll try to keep it short and show the essential parts to get started with building small components with Cycle.

It helps to learn the general approach to building cycle.js components:
> Expose everything as a stream.

### Approaching Cycle.js

I would advise that you take some time to adjust to the new terminology, and if you're anything like me, where it isn't sufficient to just implement something, but do it according to some sort of best practise and in an organized way, it will probably take even longer to start with FRP since so many questions pop up. Unless you're already familiar with FRP, coming from an imperative background this is probably not something you learn in a day or two. I would also suggest not to start with a huge project, but rather do a small part of your app with Cycle. From my understanding the framework still under development in terms of how to structure large applications.

### MVI

Cycle proposes a new design pattern called MVI (model, view, intent).

|             | Intent                                                                       | Model        | View              |
|-------------|------------------------------------------------------------------------------|--------------|-------------------|
| **Description** | Manage user intent (DOM events are usually how users interact with your app) | Manage State | Represent State   |
| **Input**       | Drivers (DOM for instance)                                                   | Stream       | Stream            |
| **Output**      | Stream                                                                       | Stream       | Virtual DOM Nodes |

The flow then becomes `View(Model(Intent(DOM)))`, or :

```js
let action$ = intent(DOM);
let state$ = model(action$);
let view$ = view(state$);
```

### Tips

* Isolate components using [Isolate module](https://github.com/cyclejs/cyclejs/tree/master/isolate) since by default drivers are globally scoped. For instance, doing `DOM.select('.some-class')` will look in the global DOM, not the local fragment you passed in.
* Leverage [collection module](https://github.com/cyclejs/collection) to get list of streams.

### Static HTML

You can use the `xs.of` operator:

```js
    let someStaticElement$ = xs.of(div('hello'));
```

### Debugging

In order to debug a stream you can do something like this:

```js
    const result$ = something$
        .startWith('list')
        .map(state => {
            console.log(state);
            return state;
        });
```

In order to actually print the inside statement, we need to attach a listener.

```js
    s$.addListener({
        next: i => console.log(i),
        error: err => console.error(err),
        complete: () => console.log('completed'),
    })
```

## Summary

FRP and cycle.js may not be the silverbullet (I'm far too inexperienced to even make such a suggestion in either direction anyway), if such thing even exists. I would recommend cycle.js to anyone who wants to dig deeper into FRP and doesn't mind getting their hands dirty. It will provide you with more understanding of where the web might be heading in the future and along the way you'll learn many useful concepts.

A couple of posts about FRP, Cycle.js that I drew inspiration from and that you should read to familiarize yourself further with FRP and Cycle.

* <http://www.zsiegel.com/2016/01/10/building-an-app-with-cyclejs-creating-components>
* <http://thenewstack.io/developers-need-know-mvi-model-view-intent/>
* <http://futurice.com/blog/reactive-mvc-and-the-virtual-dom)>


