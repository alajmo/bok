layout: pages/post.ts
type: post
date: 2018-11-16
title: Explaining SOLID through Code
---

Man</span> is a consumer and a producer, a <span class="border-black">pattern</span> interpreter and pattern producer; thus the code we produce and consume ought to have characteristics that favor such activities. So, how do we produce easily consumed code? We do so by following patterns and code principles that enable us to increase encapsulation (information hiding), modularity, maintainability, readability, etc., all properties of a well-designed system.

This post briefly covers **SOLID**, a set of design principles that provide guidance on structuring object-oriented programs. I'll provide examples of code that doesn't follow SOLID and then pointers of how to refactor the code to follow SOLID. All the examples are implemented in Kotlin but should be comprehensible to anyone with OOP programming experience.

## Table of Contents

- [Background](#background)
- [Code Example](#code-example)
  - [The Wrong Way](#the-wrong-way)
  - [S - Single Responsibility Principle](#s---single-responsibility-principle)
  - [O - Open/Closed Principle](#o---openclosed-principle)
  - [L - Liskov Substitution Principle](#l---liskov-substitution-principle)
  - [I - Interface Segregation Principle](#i---interface-segregation-principle)
  - [D - Dependency Inversion Principle](#d---dependency-inversion-principle)
  - [The Right Way](#the-right-way-5)
- [Summary](#summary)
- [Resources](#resources)

## Background

<span class="bordecitos">SOLID</span> is a mnemonic acronym for the following <span class="underline_blue">design principles</span>:

- **S** - Single responsibility principle
- **O** - Open/closed principle
- **L** - Liskov substitution principle
- **I** - Interface segregation principle
- **D** - Dependency inversion principle

While some of the principles sound complicated, they are quite easy to understand and readily applicable to your code.

## Code Example

The example we'll be covering is an application that enables people to register as users or non-users. Users are modeled as the class `User` and non-users as the class `NonUser`. The `User` class can buy items and is eligible for discounts, whereas the `NonUser` class can only purchase items. As the application is intended for production use, we'll include logging and persisting data to a database.

The application is first implemented in the "wrong" way and then step by step refactored to follow the SOLID principles.

### The Wrong Way

```kotlin
import java.io.File

class ApiLogService {
    fun log(content: String) { println(content) }
}

open class User(
        open val loggerType: String = "file",
        open val type: String = "user"
) {
    open val id: String? = java.util.UUID.randomUUID().toString()

    open fun calcPriceAfterDiscount(price: Double): Double {
        return if (type == "default") {
            price.toDouble() - price.toDouble() * 0.50
        } else if (type == "gold") {
            price.toDouble() - price.toDouble() * 0.75
        } else {
            price
        }
    }

    open fun buy(price: Double) {
        try {
            val db = DatabaseHandler()
            db.write(id, price)
        } catch (ex: Exception) {
            if (loggerType == "file")  {
                File("app.log").appendText(ex.toString())
            } else if (loggerType == "api") {
                val apiLogger = ApiLogService()
                apiLogger.log(ex.toString())
            }
        }
    }
}

class NonUser(
        override val loggerType: String = "file"
): User() {
    override val type: String = "non-user"
    override val id = null

    init {
        File("app.log").appendText("non-user created")
    }

    override fun calcPriceAfterDiscount(price: Double): Double {
        throw Exception("Can't get discount")
    }
}

interface IDatabaseHandler {
    fun query()
    fun read()
    fun write(id: String?, price: Double)
}

class DatabaseHandler: IDatabaseHandler {
    init {
        // Code to init a database
    }
    override fun query() { }
    override fun read() {
        // Database code for reading
    }
    override fun write(id: String?, price: Double) {
        // Database code for writing
    }
}

class DatabaseHandlerV2: IDatabaseHandler {
    init {
        // Code to init a database
    }
    override fun query() {
        // Database code for querying
    }
    override fun read() {
        // File code for reading
    }
    override fun write(id: String?, price: Double) {
        // File code for writing
    }
}

fun main() {
    val users: List<User> = listOf(
            User("file", "user"),
            User("file", "default"),
            User("file", "gold"),
            NonUser("file")
    )

    println("--- List of current users, their user type and id ---")
    users.forEach { user ->
        println("${user.id} (${user.type})")
    }

    println("")

    val price: Double = 100.0

    println("-- Each user buys an item worth 100 with no discount ---")
    users.forEach { user ->
        user.buy(price)
        println("${user.id} bought an item for the price of ${price}")
    }

    println("")

    println("--- Price discounts examples for different user types ---")
    users.forEach { user ->
        println("Price after discount for '${user.type}' is: ${user.calcPriceAfterDiscount(price)}, original price: ${price}")
    }
}

main()
```

### S - Single Responsibility Principle

> A class should have only a single responsibility (i.e., changes to only one part of the software's specification should be able to affect the specification of the class).

#### The Wrong Way

If we look at the `User` class we can see that the `buy` method has multiple responsibilities and thus violates the SOLID principles:

1. It's responsible for writing exceptions to a file
2. It instantiates a database object

```kotlin
open class User(
        open val loggerType: String = "file",
        open val type: String = "user"
) {
    open val id: String? = java.util.UUID.randomUUID().toString()

    open fun buy(price: Double) {
        try {
            val db = DatabaseHandler()
            db.write(id, price)
        } catch (ex: Exception) {
            if (loggerType == "file")  {
                File("app.log").appendText(ex.toString())
            } else if (loggerType == "api") {
                val apiLogger = ApiLogService()
                apiLogger.log(ex.toString())
            }
        }
    }
}

```

#### The Right Way

We can adhere to the single responsibility principle by delegating the responsibility to separate classes and instead call the methods of those classes:

```kotlin
open class User(
        logHandler: ILogger,
        database: DatabaseHandler
) : ICustomer {

    val db: DatabaseHandler = database
    val logger: ILogger = logHandler
    open val type: String = "user"
    val id: String = java.util.UUID.randomUUID().toString()

    override fun buy(price: Double) {
        try {
            db.write(id, price)
        } catch (ex: Exception) {
            logger.log(ex.toString())
        }
    }
}
```

### O - Open/Closed Principle

> Software entities such as classes, modules, functions, etc. should be open for extension, but closed for modification.

The Open/closed principle relates to structuring code such that when we add functionality, we should opt for writing new classes, modules or functions instead of modifying existing ones.

#### The Wrong Way

The function `calcPriceAfterDiscount` in the `User` class goes against this principle since it encourages modification of `conditional` statements when we want to add another user type.

```kotlin
open class User(
        open val loggerType: String = "file",
        open val type: String = "user"
) {
    open val id: String? = java.util.UUID.randomUUID().toString()

    open fun calcPriceAfterDiscount(price: Double): Double {
        return if (type == "default") {
            price.toDouble() - price.toDouble() * 0.50
        } else if (type == "gold") {
            price.toDouble() - price.toDouble() * 0.75
        } else {
            price
        }
    }
}
```

#### The Right Way

To follow the open/closed principle, we will refactor the `calcPriceAfterDiscount` function and create new subclasses. This way, whenever we create new user types, we extend code instead of modifying existing code.

```kotlin
open class User(
        logHandler: ILogger,
        database: DatabaseHandler
) : ICustomer {

    val db: DatabaseHandler = database
    val logger: ILogger = logHandler
    open val type: String = "user"
    val id: String = java.util.UUID.randomUUID().toString()

    open fun calcPriceAfterDiscount(price: Double): Double {
        return price
    }
}

class DefaultUser(
        val logHandler: ILogger,
        database: DatabaseHandler
): User(logHandler, database) {
    override val type: String = "default"

    override fun calcPriceAfterDiscount(price: Double): Double {
        return super.calcPriceAfterDiscount(price) - price * 0.50
    }
}

class GoldUser(
        val logHandler: ILogger,
        database: DatabaseHandler
): User(logHandler, database) {
    override val type: String = "gold"

    override fun calcPriceAfterDiscount(price: Double): Double {
        return super.calcPriceAfterDiscount(price) - price * 0.75
    }
}
```

### L - Liskov Substitution Principle

> Objects in a program should be replaceable with instances of their subtypes without altering the correctness of that program.

#### The Wrong Way

In our example, we have a parent class `User` and a child class `NonUser`. Imagine that we create a list of users and then call the `calcPriceAfterDiscount` method on each user. The aforementioned code would compile but would fail during runtime since the `NonUser` class doesn't have a valid (throws an exception) implementation for the `calcPriceAfterDiscount` method and thus we violate the Liskov substitution principle.

```kotlin
open class User(
        open val loggerType: String = "file",
        open val type: String = "user"
) {
    open val id: String? = java.util.UUID.randomUUID().toString()

    open fun calcPriceAfterDiscount(price: Double): Double {
        return if (type == "default") {
            price.toDouble() - price.toDouble() * 0.50
        } else if (type == "gold") {
            price.toDouble() - price.toDouble() * 0.75
        } else {
            price
        }
    }
}

class NonUser(
        override val loggerType: String = "file"
): User() {
    override val type: String = "non-user"
    override val id = null

    override fun calcPriceAfterDiscount(price: Double): Double {
        throw Exception("Can't get discount")
    }
}

fun main() {
    val users: List<User> = listOf(
            User("file", "user"),
            User("file", "default"),
            User("file", "gold"),
            NonUser("file")
    )

    val price: Double = 100.0
    println("--- Price discounts examples for different user types ---")
    users.forEach { user ->
        // This will fail on runtime!
        println("Price after discount for '${user.type}' is: ${user.calcPriceAfterDiscount(price)}, original price: ${price}")
    }
}
```

#### The Right Way

There are numerous ways to resolve this, and one of those ways is to use interfaces and create a new class for the `NonUser` instead of inheriting from the `User` class.

```kotlin
interface ICustomer {
    fun buy(price: Double)
}

open class User(
        logHandler: ILogger,
        database: DatabaseHandler
) : ICustomer {

    val db: DatabaseHandler = database
    val logger: ILogger = logHandler
    open val type: String = "user"
    val id: String = java.util.UUID.randomUUID().toString()

    open fun calcPriceAfterDiscount(price: Double): Double {
        return price
    }
}

class NonUser(
        val logHandler: ILogger,
        val database: IDatabaseHandlerV2
): ICustomer {
    val db: IDatabaseHandlerV2 = database
    val logger: ILogger = logHandler
    val type: String = "non-user"
}

fun main() {
    val users: List<User> = List([User(), User()])
    val nonUser = NonUser(dbErrorLogger, databaseV2Handler)
    users.forEach { user ->
        println("Price after discount for '${user.type}' is: ${user.calcPriceAfterDiscount(price)}, original price: ${price}")
    }
    println("Price after discount for '${nonUser.type}' is: ${price}, original price: ${price}")
}
```

### I - Interface Segregation Principle

> It's better to have many client-specific interfaces than one general-purpose interface.

#### The Wrong Way

The class `DatabaseHandler` implements two methods from the `IDatabaseHandler` interface: `read` and `write`. Similarly, the `DatabaseHandlerV2` class implements three of the methods, `read`, `write` and `query`. However, since the `query` method isn't required for the `DatabaseHandler` class, the interface segregation principle isn't followed.

```kotlin
interface IDatabaseHandler {
    fun query()
    fun read()
    fun write(id: String?, price: Double)
}

class DatabaseHandler: IDatabaseHandler {
    init {
        // Code to init a database
    }
    override fun query() { }
    override fun read() {
        // Database code for reading
    }
    override fun write(id: String?, price: Double) {
        // Database code for writing
    }
}

class DatabaseHandlerV2: IDatabaseHandler {
    init {
        // Code to init a database
    }
    override fun query() {
        // Database code for querying
    }
    override fun read() {
        // File code for reading
    }
    override fun write(id: String?, price: Double) {
        // File code for writing
    }
}
```

#### The Right Way

To follow the interface segregation principle we merely split the `IDatabaseHandlerV2` interface into distinct interfaces and let each class specify the interfaces it needs:

```kotlin
interface IDatabaseHandlerV2: IDatabaseHandler   {
    fun query()
}

class DatabaseHandler: IDatabaseHandler {
    init {
        // Code to init a database
    }
    override fun read() {
        // Database code for querying
    }
    override fun write(id: String?, price: Double) {
        // Database code for writing
    }
}

class DatabaseHandlerV2: IDatabaseHandlerV2 {
    init {
        // Code to init a database
    }
    override fun read() {
        // code for querying
    }
    override fun write(id: String?, price: Double) {
        // File code for writing
    }
    override fun query() {}
}
```

### D - Dependency Inversion Principle

> Depend on abstractions, not on concretions.

#### The Wrong Way

In this example, we can see that the `NonUser` class depends on a concrete method of the class `File` (belonging to the standard library) and not on an abstract method.

```kotlin
class NonUser(
        override val loggerType: String = "file"
): User() {
    override val type: String = "non-user"
    override val id = null

    init {
        File("app.log").appendText("non-user created")
    }

    override fun calcPriceAfterDiscount(price: Double): Double {
        throw Exception("Can't get discount")
    }
}
```

#### The Right Way

If we instead pass in an interface for the logger, then `NonUser` wouldn't be depending on a concretion but on an abstraction (the abstraction of logging something). In the future, if we want to change log medium (from file to database for instance), we can take a look at the abstraction instead of the class concretion.

```kotlin
class NonUser(
        val logHandler: ILogger,
        val database: IDatabaseHandlerV2
): ICustomer {
    val db: IDatabaseHandlerV2 = database
    val logger: ILogger = logHandler
    val type: String = "non-user"

    init {
        logger.log("non-user created")
    }

    override fun buy(price: Double) {
        try {
            db.write(null, price)
        } catch (ex: Exception) {
            logger.log(ex.toString())
        }
    }
}

```

### The Right Way

So in summary, when we combine all the refactored code, we get SOLID compliant code:

```kotlin
import java.io.File

interface ILogger {
    fun log(content: String) { println(content) }
}

class FileLogger(val filename: String): ILogger {
    val file = File(filename)

    override fun log(content: String) {
        file.appendText(content)
    }
}

class ApiLogService: ILogger {
    override fun log(content: String) {}
}

interface IDatabaseHandler {
    fun write(id: String?, price: Double)
    fun read()
}

interface IDatabaseHandlerV2: IDatabaseHandler   {
    fun query()
}

class DatabaseHandler: IDatabaseHandler {
    init {
        // Code to init a database
    }
    override fun read() {
        // Database code for querying
    }
    override fun write(id: String?, price: Double) {
        // Database code for writing
    }
}

class DatabaseHandlerV2: IDatabaseHandlerV2 {
    init {
        // Code to init a database
    }
    override fun read() {
        // code for querying
    }
    override fun write(id: String?, price: Double) {
        // File code for writing
    }
    override fun query() {}
}

interface ICustomer {
    fun buy(price: Double)
}

open class User(
        logHandler: ILogger,
        database: DatabaseHandler
) : ICustomer {

    val db: DatabaseHandler = database
    val logger: ILogger = logHandler
    open val type: String = "user"
    val id: String = java.util.UUID.randomUUID().toString()

    open fun calcPriceAfterDiscount(price: Double): Double {
        return price
    }

    override fun buy(price: Double) {
        try {
            db.write(id, price)
        } catch (ex: Exception) {
            logger.log(ex.toString())
        }
    }
}

class DefaultUser(
        val logHandler: ILogger,
        database: DatabaseHandler
): User(logHandler, database) {
    override val type: String = "default"

    override fun calcPriceAfterDiscount(price: Double): Double {
        return super.calcPriceAfterDiscount(price) - price * 0.50
    }
}

class GoldUser(
        val logHandler: ILogger,
        database: DatabaseHandler
): User(logHandler, database) {
    override val type: String = "gold"

    override fun calcPriceAfterDiscount(price: Double): Double {
        return super.calcPriceAfterDiscount(price) - price * 0.75
    }
}

class NonUser(
        val logHandler: ILogger,
        val database: IDatabaseHandlerV2
): ICustomer {
    val db: IDatabaseHandlerV2 = database
    val logger: ILogger = logHandler
    val type: String = "non-user"

    init {
        logger.log("non-user created")
    }

    override fun buy(price: Double) {
        try {
            db.write(null, price)
        } catch (ex: Exception) {
            logger.log(ex.toString())
        }
    }
}

fun main() {
    val fileLogger = FileLogger("err.log")
    val dbLogger = ApiLogService()

    // Database
    val databaseHandler = DatabaseHandler()
    val databaseV2Handler = DatabaseHandlerV2()

    val users: List<User> = listOf(
            User(fileLogger, databaseHandler),
            DefaultUser(fileLogger, databaseHandler),
            GoldUser(fileLogger, databaseHandler)
    )
    val nonUser = NonUser(dbLogger, databaseV2Handler)

    println("--- List of current users, their user type and id ---")
    users.forEach { user ->
        println("${user.id} (${user.type})")
    }
    println("<no id> (${nonUser.type})")

    println("")

    val price: Double = 100.0

    println("-- Each user buys an item worth 100 with no discount ---")
    users.forEach { user ->
        user.buy(price)
        println("${user.id} bought an item for the price of ${price}")
    }
    nonUser.buy(price)
    println("A non-user bought an item for the price of ${price}")

    println("")

    println("--- Price discounts examples for different user types ---")
    users.forEach { user ->
        println("Price after discount for '${user.type}' is: ${user.calcPriceAfterDiscount(price)}, original price: ${price}")
    }
    println("Price after discount for '${nonUser.type}' is: ${price}, original price: ${price}")
}

main()
```

## Summary

Following the SOLID principles leads to maintainable code and is not applicable only to OOP but functional programming as well.

## Resources

- [More examples of SOLID](https://www.codeproject.com/articles/703634/solid-architecture-principles-using-simple-csharp)
- [Summary of the SOLID Principles](https://team-coder.com/solid-principles/)
- [Wiki post about SOLID](https://en.wikipedia.org/wiki/SOLID)
