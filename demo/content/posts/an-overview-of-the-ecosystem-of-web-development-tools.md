layout: pages/post.ts
type: post
date: 2015-06-24
title: An Overview of the Ecosystem of Web Development Tools
---

This post is directed to those who are new to web development and perhaps feel a bit overwhelmed with all the new tools/libraries/frameworks popping out
and want to know where they all fit in. I'll give a brief overview of some tools used along with the ones I use for each category.

## **Contents**

- [HTML](#html)
- [CSS](#css)
    - [File: main.css](#file-maincss)
    - [File: sub.css](#file-subcss)
    - [File: variables.css](#file-variablescss)
    - [File: main.css](#file-maincss-1)
    - [File: sub.css](#file-subcss-1)
- [JS](#js)
- [Automation Task Managers](#automation-task-managers)
    - [File: gulpfile.js](#file-gulpfilejs)
- [Text Editor](#text-editor)
- [Architecture](#architecture)
  - [In summary:](#in-summary)

First though, I feel it is important to know why we have all these new tools appearing:

It basically comes down to two variables:

1. Application quality.
2. Time spent developing.

The first one, you wish to maximize, and the second one, you wish to minimize. In short, you want the spend the minimum amount of time developing the best possible application.

So, most of the time a new library / framework / language (typescript, aTscript etc) is introduced, it is most likely introduced
with the point to either increase application quality or spend less time doing grunt work. These variables in turn effect each other, spend less time bug searching, and you spend more time improving the performance of the application,
adding features etc. Generally, the tools are aimed at the 3 building blocks of webdevelopment (who intertwine, you can have html code in
js and js code in html etc): <b>js</b>, <b>html</b> and <b>css</b>.

### HTML
This concernc how we present our user interface experience. Frameworks like (twitter) <i>bootstrap</i>, <i>angular material</i> (which uses flexbox), foundation are amongst other
things concerned with how our content is laid out. What they do is give you predefined building blocks that are concerned with how to display on screens of varying sizes (important
for mobile phones etc).

For instance, some example code from bootstrap layout:

```js

<div class="md-row">
    <div class="col-md-6"></div>
    <div class="col-md-6"></div>
</div>

```

This implemenets one row with 2 blocks laying next to each other, and alters behavior when screen is minimized below a certain pixel threshold, after which it pushes down the right block.

One of the benefits of using a framework like Bootstrap is because additional work has been done to assure the html behaves the same in the different browsers, which can be a very time
consuming task if you're doing it yourself.

Now frameworks like Bootstrap aren't one size fits them all, but rather a tool to produce generic kind of content. That's when they work best. However, if you stray away too much from
the intended use, you might end up struggling with the framework. Frameworks like Bootstrap include a ton of other stuff too, both CSS and JS parts, all from tooltips to general button
design.

### CSS
Then we have CSS processors such as <i>SASS</i>, <i>LESS</i>, <i>Stylus</i>, <i>PostCSS</i> and so on.
CSS processors give us additional ways to write code css and introduces a bit more of the general programming
techniques we're accustomed to in any programming language, such as variables, loops, extend and so on.

For instance, let's look at the use of variables (syntax might vary from processor to processor, but they all do something similar):

##### File: main.css
```css

.main {
    background: #e8e8e8;
}

```

##### File: sub.css
```css

.sub {
    background: #e8e8e8;
}

```

You could write this in a processor like:

##### File: variables.css

```css

$background-color-gray = #e8e8e8;

```

##### File: main.css
```css

.main {
    background: $background-color-gray;
}

```

##### File: sub.css
```css

.sub {
    background: $background-color-gray;
}

```

And so you only need to change it in a file to propogate the changes to other css files. Note though that in the end, each processor will spit out
regular css code.

### JS
JS is very much the secret sauce to an interactive website and which allows it to transcend to something useful rather than just being
a plain sheet of information. We find many different frameworks / libraries such as jQuery, AngularJS, Jade, handlebars, Mustache, Ember, React, underscore,
lodash and so on. Underscore and lodash are utility libraries, which provide helper functions for common data manipulation tasks, such as
finding the maximum value of an attribute in a array of objects:

Lodash:
```js

var arrOfObjs = [{'num': 5}, {'num': 6}];

_.max(arrOfObjs, function(obj) {
    return obj.num;
});

```

Then you have jQuery, which is another tool which has made a lot of developers life easier and saved us time (especially when we need to add support
for older webbrowser versions). jQuery basically adds a layer which makes handling of DOM elements easier, among many many other things.

You also have libraries like <i>Jade</i> which are templating engines who make it easier to display data from the javascript side. For instance:

handlebars:
```html

<div class="entry">
    {% raw linenos %}
    <h1>{{title}}</h1>
    <div class="body">
        {{body}}
    </div>
    {% endraw linenos %}
</div>

```

where title and body are variables defined in javascript.

Finally, in the last decade we've had a plethora of emerging architectural pattern frameworks such as Angular, Ember, Knockout, React which aim to add structure and
communication layers between what we present in our HTML and data. Where template engines such as jade and handlebars allow one to insert strings of data from javascript, implement
conditionals among other things, they don't pay any attention to update the data in the HTML file if the data changes, one would manually have to implement that feature.
This blog for instance uses a templating engine called Liquid.

In frameworks like Angular, that comes automatically. These heavier frameworks also usually gives you routing capabilities (how to switch from page to page),
amongt many other things. I'd say, if you're building an interactive application, use one of the heavier frameworks with more features (Angular, React, Ember etc),
and if you want something simple, use something like Jade, Liquid etc.

### Automation Task Managers

Automation task managers are what their name suggests, they automate tasks used during development. There exists several options here, Grunt, Gulp, Broccoli
and so on. I personally use Gulp simply because of its syntax, which I feel comes very naturally.

Below is an example of a gulp file I use for development. It accomplishes several things (not necessarily in this order):

1. Collects all content into 1 file per file type (goes for HTML files as well, so sub1.css, sub2.css -> app.css, js1.js, js2.js -> app.js).
2. Minifies said files.
3. Postcss does some vendor fixes and allows me to have variables and nesting.
4. Live reload whenever I change one of my files (css doesn't make page refresh). A huge timesaver, considering how many times I've pressed F5 in the past.
5. JSLint my js to check for errors and produce consistent code.
6. Unit testing / E2E testing.

##### File: gulpfile.js
```js

'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    minifyhtml = require('gulp-minify-html'),

    postcss = require('gulp-postcss'),
    atImport = require('postcss-import'),
    colorFunction = require('postcss-color-function'),
    calc = require('postcss-calc'),
    autoprefixer = require('autoprefixer-core'),
    nested = require('postcss-nested'),
    postvars = require('postcss-simple-vars'),

    jslint = require('gulp-jslint'),
    del = require('del'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    htmlreplace = require('gulp-html-replace'),
    ngAnnotate = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'),

    connect = require('gulp-connect'),
    server = require( 'gulp-develop-server' ),
    protractor      = require('gulp-protractor').protractor,
    webdriver       = require('gulp-protractor').webdriver,
    webdriverUpdate = require('gulp-protractor').webdriver_update,
    htmlOpts;

/**
* Variables
*/
htmlOpts = {
    conditionals: true,
    spare: true,
    empty: true,
    quotes: true
};

/**
* Development.
*/
gulp.task('dev', ['clean'], function () {
    gulp.start('watch', 'server');
});

/**
* Production.
*/
gulp.task('default', ['clean'], function () {
    gulp.start(
        'vendor:css', 'app:css',
        'vendor:js', 'app:js',
        'app:img','app:fonts',
        'app:templates', 'app:html'
    );
});

gulp.task('prod', ['clean'], function () {
    gulp.start(
    'vendor:css', 'app:css',
    'vendor:js', 'app:js',
    'app:img','app:fonts',
    'app:templates', 'app:html'
    );
});

/**
* Start server n Watch.
*/
gulp.task('watch', function () {
    // Templates.
    gulp.watch('client/app/**/*.html', ['app:templates']);

    // CSS.
    gulp.watch('client/**/*.css', ['app:css']);

    // JS.
    gulp.watch([
            'client/**/*.js',
            'client/index.html'
        ], ['app:js']);
});

/**
* App CSS.
*/
gulp.task('app:css', function() {
    var processors = [postvars({silent: true}),
        colorFunction(),
        calc(),
        atImport,
        nested,
        autoprefixer({ browsers: ['last 5 version'] })];

    return gulp.src([
            'client/assets/css/variables.css',
            'client/assets/css/*.css',
            'client/app/**/*.css'
        ])
        .pipe(postcss(processors))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('client/assets/css'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'));
});

/**
* App JS.
*/
gulp.task('app:js', function() {
    return gulp.src([
            'client/app/app.modules.js',
            'client/app/app.config.js',
            'client/app/**/*.js',
            'client/assets/js/*.js',
            '!client/app.templates.js',
            '!client/**/*.test.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
});

/**
* App Templates.
*/
gulp.task('app:templates', function() {
    return gulp.src('client/**/*.html')
        .pipe(minifyhtml(htmlOpts))
        .pipe(templateCache('app.templates.js', {
            module:'templateCache',
            standalone:true
            // root: './templates/'
        }))
        .pipe(ngAnnotate())
        .pipe(rename({
            basename: 'templates',
            prefix: 'app.',
            extname: '.js'
        }))
        .pipe(gulp.dest('client/app/'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
});

/**
* IMG.
*/
gulp.task('app:img', function () {
    return gulp.src(['client/assets/img/*'])
        .pipe(gulp.dest('dist/assets/img'));
});


/**
* FONTS.
*/
gulp.task('app:fonts', function() {
    return gulp.src([
                'bower_components/font-awesome/fonts/fontawesome-webfont.*'
            ])
        .pipe(gulp.dest('dist/fonts/'));
});

/**
* Vendor CSS.
*/
gulp.task('vendor:css', function() {
    return gulp.src([
            'bower_components/normalize.css/normalize.css',
            'bower_components/font-awesome/css/font-awesome.css'
        ])
        .pipe(concat('vendor.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'));
});

/**
* Vendor JS.
*/
gulp.task('vendor:js', function() {
    return gulp.src([
            'bower_components/javascript-detect-element-resize/jquery.resize.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
});


/**
* HTML.
*/
gulp.task('app:html', function () {
    return gulp.src('client/index.html')
        .pipe(htmlreplace({
            'css': [
                'styles/vendor.css',
                'styles/app.css'],
            'js': [
                'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.js',
                'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular.js',
                'scripts/vendor.js',
                'scripts/app.templates.js',
                'scripts/app.js'
            ]
        }))
        .pipe(gulp.dest('dist/'));
});

/**
* Server
*/
gulp.task('server', function () {
    connect.server({
        root: '',
        port: 5000,
        livereload: true
    });
});

/**
* JS Lint.
*/
gulp.task('lint', function () {
    return gulp.src([
            'client/app/app.js', 'client/assets/js/common.js',
            'client//**/*.js', '!client/app/app.templates.js',
            '!client/**/*.test.js'
        ])
        .pipe(jslint({
            global: ['angular', '$'],
            indent: 4,
            devel: true,
            browser: true,
        }))
        .on('error', function (error) {
            console.error(String(error));
        })
});

/**
* Clean.
*/
gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

```

### Text Editor

I personally use Sublime, which is a great free text editor which packs a lot of punch and is highly customizable. It suites web development perfectly. Two things one can do to
code faster:

1. Start using snippets for common code sequences.
2. Drop the mouse and build your navigation through keyboard shortcuts. For instance, ctrl + alt + k, deletes a line in sublime.

### Architecture
The most important thing though, is architecture. You can use all the tools in the world, but if your app is not built on a solid foundation, you're going to have trouble
mainting and extending your application. It's a lot more important to learn the inner workings of plain html, css and js than add layer of layer ontop of your code.

Anytime you want to do something other than a simple generic project, you're going to struggle making it your own as the complexity increases rather expontentially
of a big application, which makes it even more important to understand the intrinsic nature of the core languages you use.
For instance, with CSS: what takes precedence? JS and its prototypal inheritance, how does it work? In Angular, one of the most common problems
people have is with scope and its prototypal inheritance attribute.

#### In summary:

There exists a plethora of stuff out here, we're having some kind of cambrian explosion of web tools and it can get pretty overwhelming and perhaps you like me have felt the need
to learn a big chunk of them to be a "good" developer. If you're a beginner in web development, I'd encourage you to only pick one tool at the time, and preferably something that makes
things happen without much work, such as Angular, React etc. Then slowly (as you'll notice yourself, you start seeing areas where one could save time or make your application better,
like a css processor because you feel you are not being DRY), start adding additional tools that you feel add value to increasing application
quality and/or decreasing time spent programming.
