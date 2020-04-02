layout: pages/post.ts
type: post
date: 2015-07-18
title: Preparing for Angular 2.0
---

With Angular 2.0 coming later this year or early next year, we're approaching a more modular and consistent way of doing things
(with the help of webcomponents as well, paving the way for more standards).
This post will touch on how I structure my projects and what I'm doing to ease the transition to Angular 2.0 from Angular 1.3/1.4.

Generally when you're programming web apps, you're concerned with two overlaying themes: <b>views</b> and <b>data</b>.

## Views

I use directives for widgets / partials, pretty much all of my views except to bootstrap a layout, where I instead use a router to provide the
templateUrl and controller.

So instead of this:

```js

<div ng-controller="someWidgetCtrl" ng-include="'some-widget.html'"><div>

```


I do this:

```js

<some-widget></some-widget>

```


```js

function someCtrl(){

}

function someWidget() {
    return {
        templateUrl: 'some-widget.html',
        controllerAs: 'someCtrl'
        bindToController: true,
        link: function (scope, elem, attrs, ctrl) {

        }
    }
}

```



## Data

I use providers/services/factories for everything that has to do with data. The most time-consuming part of programming (at least for me) is about handling
your taxonomy, or how services should interact, who gets data from where and so on.


As much as possible, I try not to do any sort of slicing or dicing of data in the controller. Controllers should be thin, as they are the
middlehand between the view and the data. You could see it as the path between two railway tracks, if the path is crowded,
someone's going to be late (in this case, you, the programmer as it will take time to figure out exactly what is happening).

There is usually no business logic included in my controllers or any processing of data. For instance,

<b>Bad</b>

```js

function someController(dataService) {
    var vm = this;

    vm.dataForTheView = processData();

    function processData() {
        someProcess();
        anotherProcess()

        return dataService.stuff;
    }

    function someProcess() {
        var i;

        for (i = 0; i < dataService.stuff.length; i += 1) {
            if (data[i].name === 'undefined') {
                data[i].name = 'arbitrary name';
            }
        }
    }

    function anotherProcess() {
        var i,
            data = dataService.data;

        for (i = 0; i < dataService.stuff.length; i += 1) {
            if (data[i].name === 'undefined') {
                data[i].name = 'arbitrary name';
            }
        }
    }
}

```

<b>Better</b>

```js

function someController(dataService) {
    var vm = this;

    vm.dataForTheView = someProcess();

    function someProcess() {
        dataService.someProcess();
        dataService.anotherProcess();

        return dataService.stuff;
    }
}

function dataService() {
    var data = {
        stuff: [....]
    };

    data.someProcess() {
        for (i = 0; i < data.stuff.length; i += 1) {
            if (data.stuff[i].name === 'undefined') {
                data.stuff[i].name = 'arbitrary name';
            }
        }
    }

    data.anotherProcess() {
        for (i = 0; i < data.stuff.length; i += 1) {
            if (data.stuff[i].age === 'undefined') {
                data.stuff[i].age = 0;
            }
        }
    }

    return data;
}

```

<b>Best</b>

```js

function someController(dataService) {
    var vm = this;

    vm.dataForTheView = dataService.stuff;
}

function dataService() {
    var data = {
        stuff: [....]
    };

    init();

    function init(){
        someProcess();
        anotherProcess();
    }

    function someProcess() {
        for (i = 0; i < data.stuff.length; i += 1) {
            if (data.stuff[i].name === 'undefined') {
                data.stuff[i].name = 'arbitrary name';
            }
        }
    }

    function anotherProcess() {
        for (i = 0; i < data.stuff.length; i += 1) {
            if (data.stuff[i].age === 'undefined') {
                data.stuff[i].age = 0;
            }
        }
    }

    return data;
}

```


Now usually, this is done after fetching some data from the server. It's also a good thing to do, since you're abstracting stuff away from the controller
which makes the code source more framework agnostic.

## General thoughts

They're also getting rid of scope and controllers, and some people might get a bit worried and wonder, well what are we going to use then? Truth is,
they're just being removed in their current form.
Most people are familiar with scopes in other languages (or they have an idea of what it is), perhaps function scope rings a bell.
Well the Angular $scope element, instead of being a function scope, is simply a Javascript object that got the name $scope to give it a different semantic meaning
compared to other Javascript objects.

Now Javascript objects by nature have this inate property called prototypal inheritance, which at its core is very powerful, but can easily spin out of control,
and in my opinion is not really suited for the generic web apps we build. That's why we have all these questions at Stackoverflow regarding the different
kind of scopes (child/isolate/inherit scope etc). At first, it seems like a great feature (and it is true for some scenarios), however in reality,
it's not really that practical and causes more problems than it solves. This is especially true for beginners who have limited understanding
of the intrinsic details of javascript.

Also, as a program increases in complexity, it becomes more important to keep components separated, than have a
dwindling amount of connections between modules in which one change can propagate all the way to some far off corner implicitly. It's a lot easier to follow
the cookie path of explicit functions, than implicit data changes.
