layout: pages/post.ts
type: post
title: Using Angular $templateCache
date: 2015-06-28
---

If you're used to building application which are modular, you will probably end up with
a lot of HTML files, from layouts to partials and dialogs. And if you want to provide
a fluid user experience, meaning no loading of files during state change, you'd most likely want to preload the
templates.

One way to accomplish this is to use Angular $templateCache (which is just a service provided by Angular).
The syntax is really simple, to insert a template into the template cache write:

```js

    $templateCache.put('path/to/.html')

```

and to retrieve said template:

```js

    $templateCache.get('path/to/.html')

```

If you use a task automation tool, like gulp or grunt, you should automate this task. The output will be a template.js file which
finds HTML files and does the $templateCache.put command for you. Be sure to include the template.js file before you run your angular application.

One more small trick is to create variables for all your template files to easier be able to references them in your code and to avoid having to change
the path in all the places you reference the template when you inevitably refactor your folder and file structure. I usually use a basic module pattern to expose
my templates:

```js

var myTpl = (function () {
    return {
        board_sidebar: 'app/components/board/board-sidebar.partial.html',
        board_area: 'app/components/board/board-area.partial.html'
    }
}());

```

And then reference the variable instead of the path.

```js

$templateCache.get(myTpl.dialog_one);

```

You probably don't reference the same template in multiple files (though there are situations). However, whenever you do
a big refactor, it's easier to do changes in 1 file, than 10 files by doing ctrl + f for $templateCache.
