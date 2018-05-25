# Chapter 3: Functional Programming with JavaScript

John McCarthy took Lambda Calculus and created a new programming language - Lisp - in the late 50s. In Lisp, functions are _first-class members_ - can be declared as a variable and sent as an argument to a function.

## What It Means to Be Functional

Functions in JS are first-class citizens.

```javascript
// Old way of doing things
var log = function(message) {
  console.log(message)
};
log("In JavaScript functions are variables")

// New way
const log = message => console.log(message)
```

We can add functions to objects, since they are treated the same way as variables.

```javascript
const obj = {
  message: "They can be added to objects like variables",
  log(message) {
    console.log(message)
  }
}

obj.log(obj.message)
```

Functions can also be added to arrays right next to other items!

```javascript
const messages = [
  "They can be inserted into arrays",
  message => console.log(message),
  "like variables",
  message => console.log(message)
]

messages[1](messages[0]) // They can be inserted into arrays
```

We can also pass functions into other functions:

```javascript
const insideFn = logger => logger("They can be sent to other funcs as args")

insideFn(message => console.log(message))
```

They can also be _returned_ from functions, just like other variables.

```javascript
var createScream = function(logger) {
  return function(message) {
    logger(message.toUpperCare() + "!!!")
  }
}

const scream = createScream(message => console.log(message))
