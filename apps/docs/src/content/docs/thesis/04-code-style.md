---
title: Code Style
---

The previous chapter discussed the architecture of the Datadive platform, which refers to the high-level structure of a software system. It focused on how components interact and the design choices, such as microservices versus monolithic systems. Within this framework, code style plays a crucial role by establishing conventions and guidelines for writing code, including formatting and naming conventions. While architecture shapes the overall performance and reliability of the software, a consistent code style ensures clarity and coherence at the code level, enhancing readability and maintainability within a project. Companies or large projects often have a code style guide to ensure that all contributors follow the same conventions, two notable examples are Google and Deno but there also many recommendations which are based on the code style of open source code bases. [][#GOOGLE_TS_STYLE_GUIDE] [][#DENO_STYLE_GUIDE] [][#TS_STYLE_GUIDE]

This chapter introduces the code style used in the Datadive platform, outlining conventions and guidelines. It covers various aspects of code style, such as formatting, naming, documentation, and testing. By adhering to these guidelines, Datadive contributors can write code that is consistent, readable, and maintainable, facilitating collaboration and ensuring the quality of the software. The chapter starts with a brief discussion of the tools and processes that support code style enforcement in the Datadive codebase.

### Code Style Enforcement

Although it is recommended that the process of contributing to Datadive includes a code review by a maintainer, it is unlikely that all maintainers will be able to catch every style violation. Therefore, maintaining a consistent code style across a project requires tools that automate the enforcement of style guidelines. These tools help ensure that all contributors follow the same conventions, reducing the likelihood of inconsistencies and errors. The Datadive platform uses several tools to support code style enforcement, the most important being ESLint and Prettier.
ESLint is a static code analysis tool that identifies problematic patterns in JavaScript and TypeScript code. In Datadive, it also enforces a consistent code style. Datadive includes several ESLint configurations stored in the `@datadive/eslint` package, based on a `base` configuration described in more detail below. The other configurations mainly consist of framework-specific rules for React and Playwright, which will not be discussed in this chapter.

<figure id="table-eslint-plugins">

| Plugin                          | Purpose                                                        | Link                                                                                                               |
| ------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `eslint-plugin-jsdoc`           | Enforces consistent JSDoc comments for functions and variables | [github.com/gajus/eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc)                               |
| `eslint-plugin-security`        | Identifies security vulnerabilities in the codebase            | [github.com/eslint-community/eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security)   |
| `eslint-plugin-eslint-comments` | Enforces consistent comments in the codebase                   | [github.com/mysticatea/eslint-plugin-eslint-comments](https://github.com/mysticatea/eslint-plugin-eslint-comments) |
| `eslint-plugin-turbo`           | Includes rules for managing monorepos                          | [github.com/vercel/turborepo](https://github.com/vercel/turborepo)                                                 |

  <figcaption>
    ESLint plugins used in the Datadive codebase.
  </figcaption>
</figure>

Most stylistic ESLint rules used in Datadive are based on the `typescript-eslint` ESLint plugin, which extends ESLint to support TypeScript-specific rules. It offers three shared configurations that serve as presets for sets of rules. Datadive uses the recommended, strict, and stylistic configurations, each in their type-checked version. The rules are detailed in the plugin's documentation. Notably, Datadive prefers using TypeScript interfaces over types, as this can improve type-checking performance. It also uses the `Array<>` syntax instead of `[]` for array declarations, which generally enhances readability and maintains consistency with other generic types. Additionally, it favors the index signature syntax `{ [key: string]: string }` over the `Record<string, string>` syntax because it allows for defining recursive types and is closer to the mapped type syntax `{ [K in keyof T]: U }`, making it less confusing for contributors when first encountered. In addition to the `typescript-eslint` plugin, Datadive uses the recommended shared configurations of several other ESLint plugin, which are detailed in table <a class="ref" href="#table-eslint-plugins">1</a>. [][#TSESLINT] [][#TS_PERFORMANCE_INTRO] [][#TS_PERFORMANCE] [][#ARRAY_TYPE_IN_TS]

Prettier is a code formatter that automatically applies a predefined style guide to code. It ensures consistent formatting across the Datadive codebase, regardless of individual developer preferences. As an opinionated formatter, Prettier limits configuration options to keep setup simple and avoid unnecessary debates and bikeshedding.

The term "bikeshedding" refers to the tendency of people to spend an inordinate amount of time discussing trivial or unimportant details which is often seen in software development when developers focus on minor details like code formatting instead of addressing critical issues like architecture or performance. [][#BIKESHEDDING_SOURCE]

The Datadive Prettier configuration is stored at the root of the Datadive repository in `prettier.config.js`. Notable deviations from the default Prettier configuration include using single quotes for strings, adding trailing commas in arrays and objects, and omitting semicolons at the end of statements. Single quotes have become the standard in the JavaScript ecosystem, trailing commas simplify code reviews by ensuring that adding or removing an item from an array or object does not affect surrounding lines. The absence allows for easier line swapping without worrying about semicolon placement. [][#PRETTIER_OPTION_PHILOSOPHY] [][#CODE_STYLE_MATTERS] [][#TS_STYLE_GUIDE]

### Tests

The Datadive codebase follows the principle of locality of behavior, which groups related code together to enhance understanding and maintenance. This principle is based on the idea that code that works together should be close together. Following this principle, tests are located in the same directory as the code they test, ensuring that tests are easy to find and maintain. The Datadive codebase uses Vitest as the testing framework for unit and integration tests. The test file is named after the file it tests, with a `.test.ts` extension. For example, tests for `parse-cookie.ts` would be in the same directory in a file named `parse-cookie.test.ts`. This naming convention makes it easy to associate tests with the code they cover and ensures that tests are located near the code they test.

### Functional Programming

While Datadive does not enforce a strict functional programming paradigm, it encourages functional programming principles where appropriate. Functional programming emphasizes the use of pure functions and immutability to improve code quality and maintainability. Pure functions have no side effects and always return the same output for the same input, making them easier to reason about and test. Immutability ensures that data cannot be changed after it is created, reducing the risk of bugs caused by unintended modifications. [][#FUNCTIONAL_PROGRAMMING]

Datadive employs functional programming principles by minimizing the use of classes and prioritizing functions and modules. Classes are used sparingly and only when necessary, such as for creating instances of objects with state or for custom errors. Many files in Datadive export only a single function and may include non-exported utilities to break the implementation into smaller parts. This approach mirrors the structure of React applications, where files often export a single component. Modules encapsulate related functionality and promote code reuse. By adhering to functional programming principles, Datadive aims to produce code that is predictable, maintainable, and testable.

### Error Handling

Error handling is a crucial aspect of writing robust and reliable software. Proper error handling ensures that applications respond gracefully to unexpected conditions and provide meaningful feedback to users. Modern languages like Swift and Rust support typesafe errors, a highly requested feature in TypeScript. Typesafe errors enable developers to define a set of error types that can be thrown by a function or method, see figure <a class="ref" href="#fig-ts-typesafe-errors">10</a>. [][#TYPED_ERRORS] [][#SWIFT_ERRORS] [][#RUST_ERRORS] [][#HASKELL_MONADS]

<figure id="fig-ts-typesafe-errors">

```ts
function divide(a: number, b: number) throws DivisionByZeroError: number {
  if (b === 0) {
    throw new DivisionByZeroError("Can't divide by zero");
  }
  return a / b;
}
```

  <figcaption>
    Function that uses an non-existent syntax to include the thrown error in it's signature.
  </figcaption>
</figure>

This approach enables developers to identify potential errors and manage them effectively. Additionally, the TypeScript compiler can enforce the handling of all possible errors. However, due to its design and compatibility with JavaScript, TypeScript does not support type-safe errors and likely never will. Instead, Datadive uses the neverthrow package to handle errors in a type-safe way. Neverthrow adopts an "errors as values" approach to error management. Instead of throwing exceptions, functions return a `Result` type that can be either `Ok` or `Err`. See the example in figure <a class="ref" href="#fig-neverthrow-example">11</a>. [][#TYPED_ERRORS]

<figure id="fig-neverthrow-example">

```ts
function divide(a: number, b: number): Result<number, DivisionByZeroError> {
  if (b === 0) {
    return err(new DivisionByZeroError("Can't divide by zero"))
  }
  return ok(a / b)
}

const result = divide(10, 0)
if (result.isErr()) {
  console.error(result.error.message)
} else {
  console.log(result.value)
}
```

  <figcaption>
    Function that returns a `Result` type to manage errors in a type-safe manner.
  </figcaption>
</figure>

This is essentially an implementation of the either monad, which is a functional programming construct that represents a value that can be either a success or a failure [][#HASKELL_MONADS]. It is commonly used for error handling in functional programming languages. By using neverthrow, Datadive ensures that errors are managed consistently and safely throughout the codebase.

To maintain consistency in error handling across the codebase, Datadive defines custom error classes for common scenarios. These classes extend the `DatadiveError` class provided by the `@datadive/utils` package. Each error class must specify a unique error code, which should be a lowercase string.

<figure id="fig-datadive-error">

```ts
class DivisionByZero extends DatadiveError<
  'division_by_zero',
  { numerator: number; denominator: 0 }
> {
  public readonly code = 'division_by_zero'
}

const error = new DivisionByZero(
  // Required error data
  { numerator: 1, denominator: 0 },
  // Optional message
  `Can't divide by zero`,
  // Optional cause
  { cause: undefined },
)
```

  <figcaption>
    Example custom error class that extends the `DatadiveError` class.
  </figcaption>
</figure>

As in the example in figure <a class="ref" href="#fig-datadive-error">12</a>, the errors may provide additional context and information by including a `data` property, which must be a JSON-serializable object. This `data` property often contains details such as the input that triggered the error or the context in which it occurred. Errors may also have a `message` property, used for logging purposes, which should be a concise, human-readable description of the error and its cause. The options passed to a Datadive error class include a `cause` property, indicating the error that led to the current one. This property is useful for tracking the chain of errors that resulted in the current error, especially when a third-party library's error is wrapped in a custom error.

### Dependency Injection

Dependency injection is a design pattern that promotes loose coupling between components by injecting dependencies from the outside instead of creating them internally. This approach makes components more modular and easier to test, as dependencies can be mocked or replaced with stubs. Datadive employs a straightforward, functional approach to dependency injection for managing dependencies between modules and components. By convention, dependencies are passed as the first argument to functions, as illustrated in figure <a class="fig-ref" href="#fig-dependency-injection">13</a>. [][#DEPENDENCY1] [][#DEPENDENCY2]

<figure id="fig-dependency-injection">

```ts
function divide(
  dependencies: { logger: (message: string) => void },
  a: number,
  b: number,
): Result<number, DivisionByZeroError> {
  dependencies.logger(`Dividing ${a} by ${b}`)
  if (b === 0) {
    return err(new DivisionByZeroError("Can't divide by zero"))
  }
  return ok(a / b)
}
```

  <figcaption>
    Function using dependency injection to manage the `logger` dependency.
  </figcaption>
</figure>

This method allows for easy replacement or mocking of dependencies during testing. For instance, when testing the `divide` function, console output may not be desired. By passing a mock logger function as a dependency, the test can capture and verify log messages without affecting the console. See figure <a class="ref" href="#fig-dependency-injection-test">14</a>.

<figure id="fig-dependency-injection-test">

```ts
const logger = vi.fn()
const result = divide({ logger }, 10, 0)

expect(logger).toHaveBeenCalledWith('Dividing 10 by 0')
```

  <figcaption>
    Example test using a mock logger provided using dependency injection.
  </figcaption>
</figure>

Figure <a class="ref" href="#fig-dependency-injection-runtime">15</a> shows how the `console.log` function can be injected as a dependency to create a new function that can be used during runtime.

<figure id="fig-dependency-injection-runtime">

```ts
const runtimeDivide = (...params: Tail<Parameters<typeof divide>>) => {
  return divide({ logger: console.log }, ...params)
}
```

  <figcaption>
    Injecting a dependency to a function during runtime.
  </figcaption>
</figure>

Since manually injecting dependencies requires more complex type helpers, which can be verbose and confusing for less experienced contributors, Datadive offers utility functions to simplify this process. See figure <a class="ref" href="#fig-injection-utilities">16</a> for an example. These utility functions ensure that only `Result` or `ResultAsync` for asynchronous operations can be returned from the function. This enforces both dependency injection conventions and a consistent error handling strategy.

<figure id="fig-injection-utilities">

```ts
interface MathInjection {
  logger: (message: string) => void
}

const [define, inject] = createInjectionUtilities<MathInjection>()

const divide = define((dependencies, a: number, b: number) => {
  dependencies.logger(`Dividing ${a} by ${b}`)
  if (b === 0) {
    return err(new DivisionByZeroError("Can't divide by zero"))
  }
  return ok(a / b)
})

const runtimeDivide = inject({ logger: console.log }, divide)
```

  <figcaption>
    Example, using utility functions to simplify dependency injection.
  </figcaption>
</figure>

### Factory Functions

Factory functions are functions that create and return objects. They are commonly used to encapsulate object creation logic and provide a way to customize object creation without exposing the underlying implementation. [][#FACTORY]

Datadive uses factory functions to create instances of objects with complex initialization logic and to abstract object creation from the calling code. Like in figure <a class="fig-ref" href="#fig-factory-function">17</a>, factory functions typically have the `create` prefix and accept configuration options as arguments. Datadive packages that rely heavily on dependency injection use factory functions to create objects that include all their methods with injected dependencies.

 <figure id="fig-factory-function">

```ts
const createUser = define((dependencies, name: string) => {
  dependencies.db.insertUser({ name })
})

const createNotebook = define((dependencies, path: string) => {
  dependencies.db.insertNotebook({ path })
})

export function createCore(config: { db: { url: string } }) {
  const db = createDb(config.db.url)
  return {
    createUser: inject({ db }, createUser),
    createNotebook: inject({ db }, createNotebook),
  }
}
```

  <figcaption>
    Example factory function used to create an object of methods with injected dependencies.
  </figcaption>
</figure>

### Enum Like Objects

Enum-like objects are collections of related constants. They resemble enums in other languages but are implemented as objects. This pattern is common in TypeScript, where enums can have certain pitfalls. One issue is that their transpilation to JavaScript may lead to unexpected behavior, particularly when iterating over the values. As shown in figure <a class="fig-ref" href="#fig-enum-like-objects">18</a>, enum-like objects are typically constant objects with string primitive values. They also have a type of the same name that is a union of the object's values [][#ENUM]. In Datadive, enum-like objects define a set of related values used throughout the codebase. For example, the `LandlordTable` and `TenantTable` objects specify the names of all tables available in the landlord and tenant databases, respectively.

<figure id="fig-enum-like-objects">

```ts
const LandlordTable = {
  User: 'user',
  Notebook: 'notebook',
} as const

// 'user' | 'notebook'
type LandlordTable = ValueOf<typeof LandlordTable>

function printTable(table: LandlordTable) {
  // used as type
  console.log(table)
}

printTable(LandlordTable.User) // used as value
printTable(LandlordTable.Notebook) // used as value
```

  <figcaption>
    Example enum-like object defining the names of tables in the landlord database.
  </figcaption>
</figure>
