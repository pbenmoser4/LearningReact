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
```

We need to start paying attention to the number of arrows used in a function. More than one arrow means we're looking at higher order functions.

## Imperative Versus Declarative

Functional programming is part of a larger _declarative programming_ paradigm. Focus is on describing what should happen over defining how it should happen. This is as opposed to _imperative programming_.

```javascript
// Imperative approach
var string = "This is the midday show with Cheryl Waters";
var urlFriendly = "";

for (var i=0; i<string.length; i++) {
  if (string[i] === " ") {
    urlFriendly += "-";
  } else {
    urlFriendly += string[i]
  }
}

// Declarative approach to the same problem
const string = "This is the midday show with Cheryl Waters"
const urlFriendly = string.replace(/ /g, "-")
```

In the second example we were describing what should happen - that white spaces should be replaced by hyphens, rather than describing how that should happen.

How should we take this approach and apply it to the creation of a DOM?

```javascript
// Imperative
var target = document.getElementById('target');
var wrapper = document.getElementById('div');
var headline = document.getElementById('h1');

wrapper.id = "welcome";
headline.innerText = "Hello World";

wrapper.appendChild(headline);
target.appendChild(wrapper);

// Declarative using React components
const { render } = ReactDOM

const Welcome = () => (
  <div id="welcome">
    <h1>Hello World</h1>
  </div>
)

render(
  <Welcome />,
  document.getElementById('target')
)
```

We create a `Welcome` component that describes the DOM that should be rendered. This abstracts the details of how things are rendered.

## Functional Concepts

Immutability, Purity, Data Transformation, Higher-Order Functions, and Recursion

### Immutability

Data is immutable in functional programming. Instead of changing the original data structures, we build changed copies of those structures and use them instead.

```javascript
var rateColor = function(color, rating) {
  return Object.assign({}, color, {rating: rating})
}

console.log(rateColor(color_lawn, 5).rating)  // 5
console.log(color_lawn.rating)                // 4
```

Here we use `Object.assign()` as a copy machine. Let's write the same function using ES6:

```javascript
const rateColor = (color, rating) =>
  ({
    ...color,
    rating
  })
```

Expanding arrays in an immutable way:

```javascript
// Not using Array.push, which mutates the original array
const addColor = (title, array) => array.concat({title})

// Using the spread operator
const addColor = (title, list) => [...list, {title}]
```

### Pure Functions

Functions that return values computed based on arguments; take at least one argument and always return a value or another function. They do not cause side effects, set global variables, or change anything about application state. They also treat args as immutable data.

```javascript
var frederick = {
  name: "Frederick Douglass",
  canRead: false,
  canWrite: false
}

function selfEducate() {
  frederick.canRead = true
  frederick.canWrite = true
  return frederick
}
```

This is not a pure function at all. Has nothing _but_ side effects, takes no arguments, does not return a value.

Let's try to make it pure:

```javascript
const frederick = {
  name: "Frederick Douglass",
  canRead: false,
  canWrite: false
}

const selfEducate = person =>
  ({
    ...person,
    canRead: true,
    canWrite: true
  })
```

Looking at impure functions that manipulate the DOM

```javascript
function Header(text) {
  let h1 = document.createElement('h1');
  h1.innerText = text;
  document.body.appendChild(h1);
}

Header("Header() caused side effect s");
```

This function creates a DOM object and then appends it to the existing DOM. I would definitely consider that a side effect. And, in spite of the fact that it takes an argument in, it does not return any value or function.

In React, DOM creation functions are (or try to be) pure:

```javascript
const Header = (props) => <h1>{props.title}</h1>
```

A few rules to think about when trying to write pure functions:
1. The function should take at least one argument
2. The function should return a value or another function
3. The function should not change or mutate any of its arguments

### Data Transformations

Two functions that are essential in data transformations following a functional paradigm: `Array.map` and `Array.reduce`.

There are many other important functions based on the `Array` data structure:

```javascript
// joining array items using `Array.join`
const schools = [
  "Yorktown",
  "Washington & Lee",
  "Wakefield"
]

schoolsString = schools.join(", ")
```

Using `.join()` leaves the original array intact, it just gives us a new version of the contents contained within.

We can also use functions like `Array.filter()` to get a new filtered list:

```javascript
const wSchools = schools.filter(school => school[0] === "W")
```

Note: a `predicate` is a function that always returns a Boolean value (`.filter()` takes a predicate as an argument).

When we want to trim down an array, we should use `Array.filter()` over `Array.pop()` or `Array.splice()` becase `.filter()` is immutable.

```javascript
const cutSchool = (cut, list) => list.filter(school => school != cut)

let newSchools = cutSchool("Washington & Lee", schools).join(" * "))
```

`Array.map()` is also incredibly important. It takes a function as its argument, which it applies to each item in the array to create a new array of the same length.

```javascript
const highSchools = schools.map(school => `${school} High School`)

console.log(highSchools.join("\n"))

// Yorktown High School
// Washington & Lee High School
// Wakefield High School

console.log(schools.join("\n"))

// Yorktown
// Washington & Lee
// Wakefield
```

Here's a quick function that can be used to edit a list of objects without mutating the original list:

```javascript
const editName = (oldName, newName, arr) =>
  arr.map(item => (item.name === oldName) ?
    ({...item, name}) :
    item
  )
```

`Array.reduce()` turns arrays into primitives and other objects. Here's an example of using `reduce()` to get the max number in an array of numbers:

```javascript
const ages = [21, 18, 42, 40, 64, 63, 34];

const maxAge = ages.reduce((max, age) => {
  console.log(`${age} > ${max} = ${age > max}`);
  if (age > max) {
    return age
  } else {
    return max
  }
}, 0)
```

`reduce()` takes two arguments: a callback function and an original value. The callback is invoked for each item in the array.

---
Syntax of `Array.reduce()`:

```javascript
arr.reduce(callback[, initialValue])
```

`callback`: function to execute on each element in the array, taking four arguments:
* `acumulator`: the accumulator accumulates the callback's return values; it is the accumulated value previously returned in the last invocation of the callback, or `initialValue`, if supplied (see below)
* `currentValue`: The current element being processed in the array
* `currentIndex`__[optional]__: The index of the current element being processed in the array. Starts at index 0, if an `initialValue` is provided, and at index 1 otherwise.
* `array`__[optional]__: The array `reduce()` was called upon.

`initialValue`__[optional]__: Value to use as the first argument to the first call of the `callback`. If no initial value is supplied, the first element in the array will be used. Calling `reduce()` on an empty array without an initial value is an error.
---

`Array.reduceRight()` does the same thing, but starts at the end of the array, rather than the beginning.

### Higher-Order Functions

Recall: higher-order functions are functions that can manipulate other functions. They can take functions in as arguments, or return functions, or both.

Higher order functions that return other functions help us deal with asynchronicity in JavaScript.

`Currying` is a formal technique:

```javascript
const userLogs = userName => message => console.log(`${userName} -> ${message}`)

const log = userLogs("grandpa23")

log("attempted to load 20 fake members")
getFakeMembers(20).then(
  members => log(`successfully loaded ${members.length} members`),
  error => log("encountered an error loading members")
)

// grandpa23 -> attempted to load 20 fake members
// grandpa23 -> successfully loaded 20 members

// grandpa23 -> attempted to load 20 fake members
// grandpa23 -> encountered an error loading members
```

### Recursion

Functions that recall themselves. But beware, too much recursion can case JavaScript errors in a browser by overloading the call stack. The authors say to use recursion wherever possible, but this isn't 100% true. Close enough though.

### Composition

You're eventually going to need to take all those tiny pure functions and do something with them... I guess... right?

Dot notation is one way to approach composition of multiple chained functions:

```javascript
const template = "hh:mm:ss tt"
const clockTime = template.replace("hh", "03")
      .replace("mm", "33")
      .replace("ss", "33")
      .replace("tt", "PM")
```

What happens when we need to chain 20 functions together? It's good to create a higher order function to compose them together:

```javascript
const both = date => appendAMPM(civilianHours(date))

// becomes

const both = compose(
  civilianHours,
  appendAMPM
)

both(new Date())
```

`compose()` is a higher order function that takes functions as arguments and returns a single value.

```javascript
const compose = (...fns) =>
  (arg) =>
    fns.reduce(
      (composed, f) => f(composed),
      arg
    )
```

`compose()` takes in multiple functions as arguments and returns one single function that takes (in the definition above) `arg` as an argument.

### Putting It All Together

JavaScript allows you to be non-functional, but you should try not to, by doing these things:
1. Keep data immutable
2. Keep functions pure - accept at least one argument, return data or another function
3. Use recursion over looping (wherever possible)

Challenge is to build a ticking clock that displays hours, minutes, seconds, and time of day in civilian time. Each field must always have double digits. The display must change every second.

```javascript
// Imperative solution to this:
setInterval(logClockTime, 1000);

function logClocktime() {
  var time = getClockTime();
  console.clear();
  console.log(time);
}

function getClockTime() {
  var date = new Date();
  var time = "";

  var time = {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    ampm: "AM"
  }

  if (time.hours == 12) {
    time.ampm = "PM";
  } else if (time.hours > 12) {
    time.ampm = "PM";
    time.hours -= 12;
  }

  if (time.hours < 10) {
    time.hours = "0" + time.hours;
  }

  if (time.minutes < 10) {
    time.minutes = "0" + time.minutes;
  }

  if (time.seconds < 10) {
    time.seconds = "0" + time.seconds;
  }

  return time.hours + ":" + time.minutes + ":" + time.seconds + ":" + time.ampm;
}
```

This is full of large and complicated functions, and we can probably make it work a bit better. Let's try to break it up into smaller parts. First, let's create some simple building blocks:

```javascript
const oneSecond = () => 1000
const getCurrentTime = () => new Date()
const clear = () => console.clear()
const log = message => console.log(message)

// Creating deeper functions
const serializeClockTime = date =>
  ({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  })

const civilianHours = clockTime =>
  ({
    ...clockTime,
    hours: (clockTime.hours > 12) ? clockTime.hours - 12 : clockTime.hours
  })

const appendAMPM = clockTime =>
  ({
    ...clockTime,
    ampm: (clockTime.hours >= 12) ? "PM" : "AM"
  })

// Displaying the information
const display = target => time => target(time)

const formatClock = format =>
  time => format.replace("hh", time.hours)
                .replace("mm", time.minutes)
                .replace("ss", time.seconds)
                .replace("tt", time.ampm)

const prependZero = key => clockTime =>
  ({
    ...clockTime,
    [key]: (clockTime[key] < 10) ? "0" + clockTime[key] : clockTime[key]
  })

const convertToCivilianTime = clockTime => compose(
  appendAMPM,
  civilianHours
)(clockTime)

const doubleDigits = civilianTime => compose(
  prependZero("hours"),
  prependZero("minutes"),
  prependZero("seconds")
)(civilianTime)

const startTicking = () => setInterval(
  compose(
    clear,
    getCurrentTime,
    serializeClockTime,
    convertToCivilianTime,
    doubleDigits,
    formatClock("hh:mm:ss tt"),
    display(log)
  ),
  oneSecond()
)


startTicking()
```
