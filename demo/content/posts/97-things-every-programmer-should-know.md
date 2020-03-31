layout: post.ts
date: 2018-08-08
title: 97 Things Every Programmer Should Know
---

"97 things every programmer should know" is a rich book containing programming wisdom from famous software developers. The "things" range from practical advice on how to write code, to the more social aspect of coding and the importance of it.
I believe all points combined produce an accurate list of properties of a complete and accomplished programmer.

The objective of this post is to summarize each point in a few paragraphs and provide an encompassing summary of all points combined.

## Summary

Programming is often a social endeavor. You write code with and for other people, which means you should communicate often. Different languages offer different perspectives, learn other languages. Other people possess knowledge, be eager to learn from them. Code can be seen as a mathematical function, remove clutter. Code lives for a long time, have a future friendly perspective and pay technical debt. Coding takes time, automate whatever you can. Code should be structured, use tools to achieve structure. Build tools deserve the same attention as the software. There is a bunch of processes related to coding that are hidden, make them visible. Processes and knowledge degrade on their own, expend energy to maintain them. When designing user/developer facing software make right things obvious, wrong things impossible to perform. You spend a lot of time inside an IDE, memorize key commands. Resources are finite, take that into consideration when planning projects. Learn to estimate, it's an important part of decision making. Use functional programming to

## Favorites

Some favorites in no particular order:

- 18: Continuous Learning
- 50: Learn to Estimate
- 51: Learn to Say "Hello, World"
- 55: Make Interfaces Easy to Use Correctly and Hard to Use Incorrectly
- 56: Make the Invisible More Visible
- 67: The Professional Programmer
- 84: Thinking in States
- 95: Write Tests for People

## The Things

### 1: Act with Prudence

Pay of technical debt in the next iteration.

### 2: Apply Functional Programming Principles

Apply functional programming principles to attain favorable properties such as referential transparency.

### 3: Ask "What Would the User Do"?

Don't fall for false consensus bias, watch the user instead of making assumptions. Users do not have the same pattern of use as programmers; they tend to narrow down instead of broadening their view when attempting to solve a problem.

### 4: Automate Your Coding Standard

Ensure coding standards are part of the build process instead of vocally voicing them and attempting to enforce them that way.
Use static code analysis tools to scan the code for unwanted anti-patterns.
Break the build if test coverage is too low.

### 5: Beauty Is in Simplicity

Aim for simplicity. Doing so will result in the following code properties: readability, maintainability, faster speed of development and beauty.

### 6: Before you Refactor

Before refactoring, keep these things in mind:

- Learn from the current codebase and the tests written.
- Avoid the temptation to rewrite everything and reuse as much code as possible.
- Many incremental changes are better than one massive change.
- Don't introduce style changes without a valid reason.
- New technology refactoring is only warranted if the benefits outweigh the cost; for instance, improved functionality, usability, maintainability or productivity.

### 7: Beware the Share

Whether or not reusing code is favorably depends on the context. In the case two decoupled projects share code, it is not always advisable to reference the other projects code since it may introduce an unnecessary dependency. This case is especially true when the projects live on their own.

### 8: The Boy Scout Rule

When visiting code, always leave it in a better state. The definition of better might be a function or variable name improvement, breaking a circular dependency or splitting large functions into smaller ones.

### 9: Check Your Code First before Looking to Blame Others

When chasing a bug, it is far more likely the problem lies in the developer's code rather than the underlying codebase (OS, framework, compiler, interpreter, app server, database, memory manager or any other software).

### 10: Choose Your Tools with Care

Only choose the necessary tool to get a working MVP. This meaning uses as few tools and possible and abstracting the tools used as much as possible to enable changing the tools in the future if necessary.

### 11: Code in the Language of the Domain

Code is often about mapping from one domain to another. In order to ease the transition, it is necessary to use domain language terms when possible as people are often more familiar with the first domain rather than the second.

### 12: Code Is Design

The pressure to skip out on quality since it can be improved later on is ever present as it helps to get to market early. To address quality deterioration, automate tests.

### 13: Code Layout Matters

More time is spent navigating and reading code than typing the changes; therefore the code layout should reflect this.

- Easy to scan - If code patterns produce the same result then it is easier for the human to navigate between code.
- Expressive layout - Code alignment can give away intended functionality and provide information on which part is of interest.
- Compact format - Maximize the size of the code (state kept) in a given frame to reduce a loss of context when scrolling or switching files.

### 14: Code Reviews

Code reviews increase code quality, reduce the defect rate, increases knowledge sharing and help establish common coding guidelines.

- Review by trying to learn about the code, not only find errors.
- Be Gentle during code reviews.
- Be constructive, not caustic.
- Have a regular code review each week.

### 15: Coding with Reason

Put effort into every piece of code such as to make it self-contained and expressive.

### 16: A Comment on Comments

Commenting is an integral part of programming and should be relevant and clarify the code, not be repetitive and obscure it. Include header comment and in-line comment; header comment provides information on how to use the code and in-line comments aide future developers in fixing or extending the code.

### 17: Comment Only What the Code Cannot Say

Code readability is about increasing the signal-to-noise ratio, and comments can attribute to the noise part if redundant.

### 18: Continuous Learning

Always keep learning. Read books, blogs, white-papers, and websites. Join a mail list or newsgroup to get updated on the latest. Write code, find a mentor, get to know frameworks or libraries. Teach, speak about problems and solutions. Join or start a study group. Listen to podcasts, go to a conference. Run a static analysis tool on a codebase and try to understand its result. Learn one new language, framework, library every year. Learn skills separate from programming. Go back to school.

### 19: Convenience Is not an -ility

Write multiple methods instead of writing if and switch statements. Design code as to please the caller instead of the implementer. Favor consistency over convenience. Design API's language as an expressive language that allows users to ask meaningful questions.

### 20: Deploy Early and Often

Deployment is an essential task of distributing software and care should be dedicated to ensuring multiple deployments are possible.

### 21: Distinguish Business Exceptions from Technical

Create a clear separation between business and technical exceptions; the former should be handled by business code and the latter by an application framework.

### 22: Do Lots of Deliberate Practise

The goal of deliberate practice is to master the skills required to complete the task, not to complete the task. It is, therefore, necessary to choose a task that is beyond the developer's current capacity to complete the task.

### 23: Domain-Specific Languages

DSL are languages that have been developed to accomplish specific tasks rather than serve as general purpose languages. There exist two types of DSL's; internal and external. Internal DSL's wrap around the host language or extend it. External DSL's provide a syntax on their own, such as CSS and regex or even XML configuration files in the Unix world. Choose between external and internal based on the target audience, their goals and the extensibility/flexibility desired.

### 24: Don't Be Afraid to Break Things

In order to improve the code state of a project, it is necessary to risk breaking the software while improving the long-term health of the project.

### 25: Don't Be Cute with Your Test Data

Developers should not add playful/tasteless placeholder comments or test data even when the aim is to remove them at a later stage as the risk of exposure to users, or other developers is a possibility.

### 26: Don't Ignore that Error!

Don't ignore errors as they tend to surface at a later stage and present issues.

### 27: Don't Just Learn the Language, Understand its Culture

A language is more than its syntax, and to grok a language, knowledge about the culture of the language is necessary.

### 28: Don't Nail Your Program into the Upright Position

Don't overuse exception handling and swallow errors which prevent the developer from fixing the bugs causing the errors and don't be religious about the fact that the user should never see an error exception.

### 29: Don't Rely on "Magic Happens Here"

All types of work, be it development, project management, etc. has hidden work that is sometimes invisible to spectators. It is essential to make that work visible to avoid process/role termination.

### 30: Don't Repeat Yourself

Keep the code clean of repetitive code through practice and abstractions which improves manageability and reduces the surface for bugs.

### 31: Don't Touch that Code

Limit quick fixes on production servers.

### 32: Encapsulate Behavior, not Just State

Encapsulate the methods of an object instead of creating long functions containing different method types.

### 33: Floating-point Numbers Aren't Real

Floating-point numbers are not real numbers, real numbers have infinitive precision and are therefore continuous and non-lossy. Don't use Floating-point for financial calculations.

### 34: Fulfill Your Ambitions with Open Source

Developers who work on programming projects that are not exciting should contribute to open source projects that are. It can serve as a stepping stone for future work openings.

### 35: The Golden Rule of API Design

When writing tests for API's, write from the perspective of the user, and not only internal implementation, as that will showcase the possible hurdles your API users experience.

### 36: The Guru Myth

When asking a question provide context and everything else that might be relevant to the person answering the question.

### 37: Hard Work Does not Pay Off

Productiveness is a finite resource, and one should use it sparingly.

### 38: How to Use a Bug Tracker

A good bug report needs three things; how to produce it, what should have happened and what happened.

### 39: Improve Code by Removing It

Don't add planned but currently unused code as it adds complexity to the codebase which hinders maintainability.

### 40: Install Me

Reduce friction for users to consume the software via proper documentation and minimization of the number of installation steps.

### 41: Inter-Process Communication Affects Application Response Time

Don't focus on data structures and algorithms to increase load performance, instead spend time structuring the communication between the frontend and backend via caching, minimizing the number of round trips and parallelizing.

### 42: Keep the Build Clean

Adopt a zero-tolerance policy for warnings in the build step (compile, lint, format etc.).

### 43: Know How to Use Command-line Tools

Using command-line tools and constructing makefiles, for instance, can provide in-depth knowledge of processes instead of relying on magic button pushing.

### 44: Know Well More than Two Programming Languages

Be exposed to multiple languages that have different computational models in order to become a better programmer.

### 45: Know Your IDE

Memorize key commands in IDE's to minimize context switching between working on code and looking for that buttons.

### 46: Know Your Limits

When designing projects be conscious of resources and limits (they are finite); the number of employees, the competence in the team, computing power available, time available, energy available etc.

### 47: Know Your Next Commit

Define atomic work commits instead of working on the overall user story because a defined commit can be estimated whereas the bigger picture workflow is hard to pin down code wise. However, it is fine to do speculative programming, which is experimenting in the code base without a particular path in mind.

### 48: Large Interconnected Data belongs to a Database

Store data inside a database instead of using classes or other constructs in the code. Databases scale better by optimizing queries and often have a better model for structuring the data and adding constraints.

### 49: Learn Foreign Languages

A project usually consists of multiple stakeholders (product, business, support, UX etc.) and it is necessary to communicate clearly with each party. Learning different languages will aid in this communication as it gives developers multiple perspectives.

### 50: Learn to Estimate

Differ between estimate, target, and commitment. People often mistakenly use them interchangeably. Estimates should be based on hard data and previous experience.

### 51: Learn to Say "Hello, World"

Be able to separate small subsets of code into a REPL when debugging/ experimenting with new code. Using REPL's are especially useful in large software projects as it narrows the focus.

### 52: Let Your Project Speak for Itself

Install physical devices that alert when some code barrier like below 21% test coverage breaks.

### 53: The Linker Is not a Magical Program

A linker maps out dependencies in a compiled language and the errors are of a simple nature even if they seem to be hidden behind a foreign language.

### 54: The Longevity of Interim Solutions

Interim solutions are a fact of life and need to be examined on a case by case; avoid them, change the mind of decision makers creating them, leave it as it is.

### 55: Make Interfaces Easy to Use Correctly and Hard to Use Incorrectly

Make correct behavior obvious; at the same time, prevent the user from misusing the API or UI by designing it in a way that is seen as unintuitive to use. Develop UI's and API's from the user's point of view by anticipating the use cases and observing actual users.

### 56: Make the Invisible More Visible

Make work visible by writing unit tests (evidence of system properties, robustness, correctness, ease of testing), using Kanban/Scrum boards (evidence of remaining work), practicing incremental development (evidence of development progress). Visibility strengthens the fact that work is genuine, intentional and repeatable.

### 57: Message Passing Leads to Better Scalability in Parallel Systems

Use message passing instead of shared memory when concurrency is necessary.

### 58: A Message to the Future

Write every line of code like you are writing a message that will be read in the future.

### 59: Missing Opportunities for Polymorphism

Prefer polymorphic classes/methods over conditional statements (most of the time).

### 60: News of the Weird: Testers Are Your Friends

Be kind to testers; they help improve the software by pointing out bugs.

### 61: One Binary

Build a single binary that can be identified and promoted through all the stages in the release pipeline.

### 62: Only the Code Tells the Truth

Any meta description about the code and its intended function is not an accurate description of the code and risks getting out of sync.

### 63: Own (and Refactor) the Build

The same passion that is devoted to the core software, should be devoted to everything used to build that software such as build scripts, configuration generation etc. as it is a vital part of delivering the software.

### 64: Pair Program and Feel the Flow

Pair programming brings multiple benefits such as reducing the truck factor (what if someone got hit by a truck), colleague to discuss immediate challenges with, direct benefit when integrating with software written by colleagues, bringing new team members up to speed etc.

### 65: Prefer Domain-Specific Types to Primitive Types

Use domain-specific types for improved readability and indirectly fewer type bugs.

### 66: Prevent Errors

Prevent errors by specifying the format for user input instead of leaving it as free text and then attempting to parse it. Enforce user interaction with software in a strict way instead of leaning on instructions and intuition.

### 67: The Professional Programmer

A professional programmer defining attribute is personal responsibility; responsibility for one's career, estimates, schedule commitments, mistakes, and work.

### 68: Put Everything Under Version Control

Keep everything under version control.

### 69: Put the Mouse Down and Step Away from the Keyboard

Coding activates the logical part of the brain, so whenever stuck on a problem, do something else for a while to activate the creative part.

### 70: Read Code

Read other peoples code and old legacy code you wrote, with the idea to scrutinize it and learn from it. What patterns are being used, is it easy or hard to read and why?

### 71: Read the Humanities

Programmers write software with people for other people. It is therefore in our interest to learn about how we best transfer knowledge to our colleagues and our users. An understanding between different parties comes from shared experience rather than shared definitions.

### 72: Reinvent the Wheel Often

As a programmer, it is both important to gather experience as it is to gather facts. The experience of reinventing the wheel will encompass the developer with more in-depth knowledge about how systems work than if system components (databases, memory management etc.) are treated as black boxes.

### 73: Resist the Temptation of the Singleton Pattern

While it is tempting to use a Singleton for its upfront simplicity, it is often not a great long-term solution. The reason is that its usage creates a tight coupling between components, makes unit testing difficult and hinders one of the foundational software tenets, maintainability.

### 74: The Road to Performance is Littered with Dirty Code Bombs

Before performance refactoring, evaluate the code complexity to estimate the time required for the refactorization. One way to evaluate code complexity is to measure the fan-out and fan-in metrics.

### 75: Simplicity Comes from Reduction

Have a minimalistic approach to writing code by including only what is necessary to get the point across.

### 76: The Single Responsibility Principle

Group code that changes for the same reason, and separates code that changes for different reasons. Avoid putting all methods that alter an object into the same class, rather divide into classes that operate on different parts of the object. The objective is to minimize the need for changing multiple parts of the code that reference an object.

### 77: Start from Yes

When approached with a problem, don't reject the proposal immediately, instead find ways to work with it by saying yes rather than no. A positive attitude is more likely to advance the conversation to something useful and beneficial to the product.

### 78: Step Back and Automate, Automate, Automate

Commands and scripts are cheaper than multiple mouse clicks and cumbersome setups. Automate anything that can be automated such as builds, deployment, documentation, reporting, testing, etc.

### 79: Take Advantage of Code Analysis Tools

Code analysis tools can prevent bugs not caught by conventional testing as well as be a useful tool in code structuring. This is especially true for dynamic languages.

### 80: Test for Required Behavior, not Incidental Behavior

Define tests as contractual obligations rather than testing for the incidental implementation. For instance, in a UI, write tests that assert users can navigate between different states rather than hardwiring tests for button clicks that trigger the navigation, as the method/placement of the button may change.

### 81: Test Precisely and Concretely

Write accurate tests that test the assumption and not only a subtest (asserting the length of a sorted list is only a subtest for testing sorting algorithms) and provide examples to help developers understand what is being tested.

### 82: Test While You Sleep (and over Weekends)

For crowded or long-running tests, offload the testing on the weekend when the computing power is most likely idle.

### 83: Testing is the Engineering Rigor of Software Development

Software Engineering is a discipline where it is possible to build something and run tests on the actual construction, in contrast to other disciplines such as mechanics, where the first step is to build mathematical modules of the physical entity and maybe even run simulations before you can start to build the construction. Use that to your advantage and test rigorously.

### 84: Thinking in States

Whenever possible design your code to work as a state machine, going from one valid state to another. The mapping of code to state machine has the benefit of presenting the problem domain to developers as states, which can be easier to reason about.

### 85: Two Heads Are Often Better than One

It is beneficial to work on a problem with multiple people because you share knowledge, practice oral skills, and increase effectiveness and speed.

### 86: Two Wrongs Can Make a Right (And Are Difficult to Fix)

Be aware that two bugs can produce correct results when occurring in combination. This awareness should help you in fixing future bugs when one bug removed causes the other bug to come alive.

### 87: Ubuntu Coding for Your Friends

The quality of isolated code depends on the code it interacts with, and so programming becomes a social endeavor since a developer must think of other people when developing his isolated piece of code.

### 88: The Unix Tools Are Your Friends

Learn Unix tools as they are performant, language and task agnostic and will be relevant for many years to come.

### 89: Use the Right Algorithm and Data Structure

Use appropriate algorithms and data structures, even when prototyping, since the code may end up being deployed and cause significant error.

### 90: Verbose Logging Will Disturb Your Sleep

A log system should produce human-readable logs that expose the severity of events and allows the developers to locate errors. Furthermore, the error log should only contain error events that are deemed necessary enough to require immediate action, and thus a healthy system should show zero logs in the error log. Finally, for each significant event in the system log,log an INFO tag.

### 91: WET Dilutes Performance Bottlenecks

Each line of code should have a single representation. Not following the DRY principle will result in WET - Write Every time, which brings the issues of additional code growth, refactorization friction and difficulties locating bottlenecks.

### 92: When Programmers and Testers Collaborate

The feedback cycle between programmers and testers should start before the first line of code is written. Programmers and testers possess unique knowledge that should be shared as it benefits both parties.

### 93: Write Code as If You Had to Support It for the Rest of Your Life

Having the state of mind that you are to support the code you write today for the rest of your life will compel you to seek self-improvement and produce robust code.

### 94: Write Small Functions Using Examples

Minimize the representation of code written inside a function regarding the problem domain and the number of cases.

### 95: Write Tests for People

Tests should serve as documentation for the code you write as they contain the context required for code to execute, how the code is invoked and what the expected results are (specification). Therefore, it is important to write tests in a consumable fashion that can be interpreted by other people. This is achieved by having descriptive test names and a clear starting point of execution.

### 96: You Gotta Care about the Code

To produce good code you have to work for it and to work for something, you often need to care about it, therefore, care about what you produce.

### 97: Your Customers Do not Mean What They Say

Customers rarely know what they want and even when they do know, their assumptions may be off, or they may provide incomplete information. In order to combat this and deliver successful software, it is necessary to communicate often, utilize visual means of communication, challenge their ideas, ask them to repeat their ideas and speak with different people if possible.

