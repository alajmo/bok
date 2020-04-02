layout: pages/post.ts
type: post
date: 2015-09-29
title: A bit About forEach, every and some
---

I've been slowly replacing my **for** and **while** loops with **forEach**, **some** and **every** method. This mainly stems from the functional
programming hysteria, as well as using libraries such as D3 which uses a functional style of programming.

## Content

- [for-loop](#for-loop)
- [every](#every)
- [for-loop](#for-loop-1)
- [some](#some)


Its origin I wouldn't be surprised if it came from the fact that we as programmers often stumble upon common problem formulation and ways we need to solve a problem.
For instance: we need to break out of this loop when we hit this condition, or we need to check that all the items pass this test and so on.
This is especially important when we have long chain of events, which need to be laid out in a readable way to make us more productive.

I recently encountered a part of my code where I needed to check collisions with other objects and return false if move was invalid.

Using a regular for-loop, I initially did something like this:

## for-loop

```js
for (let i = 0; i < intersectedBoxes.length; i += 1) {
    movePossible = isMovePossible({
        box: box,
        boxB: boxB,
        excludeBox: excludeBox,
        movedBoxes: movedBoxes
    });
    if (!movePossible) {
        return false;
    }
}
return true;
```

The same segment written with the every method:

## every

```js

return intersectedBoxes.every(function (boxB) {
    return handleBoxCollision({
        box: box,
        boxB: boxB,
        excludeBox: excludeBox,
        movedBoxes: movedBoxes
    });
});

```

For me this is a more succinct way of writing it because the **every** method already implies that each function call for each item of intersectedBoxes must be
true for it to return true. Basically some of the logic is placed at the top which is much better than having to read through the loop content to derive
the intended functionality. And lastly, we get an additional bonus point for writing less code.

In the same way, we can use **some** for the same benefits as above, albeit in a different situation, when we want to evaluate if one or more of the elements in the
array pass a condition.

Using a regular for-loop we would have to write something similar to:

## for-loop

```js

for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] > 10) {
        return true;
    }
}
return false;

```

The same segment written with the some method:

## some

```js

return arr.some(function (i) {
    return i > 10;

});
```

Less code, logic at the top, win win.

Do note that the function call can take three parameters, namely element, index and array.
However, it is not necessary and if you only specify one, then it will be the element.

```js

let arr = [{id: 5}, {id: 3}];
return arr.some(function (obj, i, arr) {
    console.log(obj, i, arr);
});

```

```js

Object {id: 5} 0 [Object, Object]
Object {id: 3} 1 [Object, Object]

```


Finally, the forEach. It follows the same pattern as **every** and **some** but it is important to be aware that forEach goes through each element in the array
and that it is not possible to return from it early without doing some ugly exception stuff,
so if you need to break from a forEach, you're best option is to actually use **every** or **some** instead.

```js

arr.forEach(function (obj, i, arr) {
    stuff...
});

```

Concerning the performance, some of the tests of I've found online shows that forEach is slower than the regular for-loop. But as they say, premature optimization is the
root of all evil :\)

You can read more about the array methods at mozilla:

- [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [some](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

