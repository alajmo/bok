layout: pages/post.ts
type: post
date: 2018-03-10
title: Validating BEM using regex
---

BEM (Block-Element-Modifier) is a naming pattern that helps you reason about your implementations. Any text that embeds a hierarchy or structure is a suitable candidate for BEM. For instance, it can be used to name your CSS components or even keys in your configuration files.
BEM consists of three elements that increase in specificity and precedence as you move to the right:

* **Block**, the most general identifier
* **Element**, identifier within a **Block**
* **Modifier**, modifies a **Block-Element**

You can read more about the methodology [here](http://getbem.com/).

To validate that our code follows correct BEM naming we can use regex. Since regex is quite hard to visualize, especially as it increases in length,  we can use an online tool [regexper](https://regexper.com) that draws diagrams of the regex.

The regex pattern for valid BEM is:

```regex
^((([a-z0-9]+(_[a-z0-9]+)?)+((--)([a-z0-9]+(-[a-z0-9]+)?)+)?)|(([a-z0-9]+(_[a-z0-9]+)?)+__([a-z0-9]+(_[a-z0-9]+)?)+((--)([a-z0-9]+(-[a-z0-9]+)?)+)?))$
```

Quite overwhelming! The next sections will feature a break down of the regex expression.

## Building Blocks

Below are the regex patterns for the three identifiers:

### Block

```regex
([a-z0-9]+(_[a-z0-9]+)?)+`
```

https://regexper.com/#([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B

### Element

```regex
__([a-z0-9]+(_[a-z0-9]+)?)$
```

https://regexper.com/#__([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%24

### Modifier

```regex
((--)([a-z0-9]+(-[a-z0-9]+)?)+)?$
```

https://regexper.com/#((--)([a-z0-9]%2B(-[a-z0-9]%2B)%3F)%2B)%3F%24

## Possible Combinations

And then we can combine the regex patterns to handle the various combinations:

### Block

```regex
([a-z0-9]+(_[a-z0-9]+)?)+
```

https://regexper.com/#([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B

### Block and Block modifier

```regex
([a-z0-9]+(_[a-z0-9]+)?)+(--)([a-z0-9]+(-[a-z0-9]+)?)+
```

https://regexper.com/#([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B(--)([a-z0-9]%2B(-[a-z0-9]%2B)%3F)%2B

### Block and optional Block modifier

```regex
([a-z0-9]+(_[a-z0-9]+)?)+((--)([a-z0-9]+(-[a-z0-9]+)?)+)?
```

https://regexper.com/#([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B((--)([a-z0-9]%2B(-[a-z0-9]%2B)%3F)%2B)%3F

### Block and Element

```regex
([a-z0-9]+(_[a-z0-9]+)?)+__([a-z0-9]+(_[a-z0-9]+)?)+
```

https://regexper.com/#([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B__([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B

### Block and Element and Element modifier

```regex
([a-z0-9]+(_[a-z0-9]+)?)+__([a-z0-9]+(_[a-z0-9]+)?)+(--)([a-z0-9]+(-[a-z0-9]+)?)+
```

https://regexper.com/#([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B__([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B(--)([a-z0-9]%2B(-[a-z0-9]%2B)%3F)%2B

### Block and Element and optional Element modifier

```regex
([a-z0-9]+(_[a-z0-9]+)?)+__([a-z0-9]+(_[a-z0-9]+)?)+((--)([a-z0-9]+(-[a-z0-9]+)?)+)?
```

https://regexper.com/#([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B__([a-z0-9]%2B(_[a-z0-9]%2B)%3F)%2B((--)([a-z0-9]%2B(-[a-z0-9]%2B)%3F)%2B)%3F

##  Result

Finally we end up with combined regex pattern for BEM:

```regex
^((([a-z0-9]+(_[a-z0-9]+)?)+((--)([a-z0-9]+(-[a-z0-9]+)?)+)?)|(([a-z0-9]+(_[a-z0-9]+)?)+__([a-z0-9]+(_[a-z0-9]+)?)+((--)([a-z0-9]+(-[a-z0-9]+)?)+)?))$
```

I wouldn't advise anyone to use this as the performance is quite lacking!
