# Chapter 2: Emerging JavaScript

## Declaring Variables in ES6

### const
Constant variables cannot be changed.
```javascript
const pizza = true
pizza = false       // leads to an error
```

### let
"Lexical variable scoping" - allows us to scope variables to any code block.
```javascript
var topic = "JavaScript"

if(topic) {
  let topic = "React"
  console.log('block', topic)   // React
}

console.log('global', topic)    // JavaScript
```

We can also create variables scoped within a `for` loop:

```javascript
var div, container = document.getElementById('container')
for (let i=0; i<5; i++){
  div = document.createElement('div')
  div.onclick = function() {
    alert('this is box #: ' + i)
  }
  container.appendChild(div)
}
```

If we hadn't been using `let` here, `i` would have been scoped globally, and every div that you clicked on would have displayed `5`, because that is the global value of `i`.

### Template Strings

Alternative approach to string concatenation.

```javascript
// traditional:
console.log(lastName + ", " + firstName + " " + middleName)

// ECMAScript
console.log(`${lastName}, ${firstName} ${middleName}`)
```

Any javascript that returns a calue can be added to a template string between `${}`. These strings __honor whitespace__ allowing you to create awesome templates:

```javascript
`
  Hello ${firstName},

  Thanks for ordering ${qty} tickets to ${event}.

  Order Details
    ${firstName} ${middleName} ${lastName}
    ${qty} x $${price} = $${qty * price} to ${event}

  You can pick your tickets up at will call 30 minutes before
  the show.

  Thanks,

  ${ticketAgent}
`
```

This makes it easier to insert formatted HTML into your sites.

### Default Parameters

Think Python - supplying default values in a function declaration.

```javascript
function logActivity(name="Ben Moser", activity="fun") {
  console.log(`${name} loves ${activity}`)
}
```

These default values are not limited to strings. They can be any type.

## Arrow Functions

You can now create functions without `function`.

```javascript
// A traditional function
var lordify = function(firstname) {
  return `${firstname} of Canterbury`
}

// Arrow function
var lordify = firstname => `${firstname} of Canterbury`

// Arrow function with more than one argument
var lordify = (firstname, land) => `${firstname} of ${land}`
```

Arrow functions can be used in multi-line situations as well

```javascript
// Old
var lordify = function(firstName, land) {
  if (!firstName) {
    throw new Error('A firstName is required to lordify')
  }

  if (!land) {
    throw new Error('A lord must have a land')
  }

  return `${firstName} of ${land}`
}

// New
var lordify = (firstName, land) => {
  if (!firstName) {
    throw new Error('A firstName is required to lordify')
  }

  if (!land) {
    throw new Error('A lord must have a land')
  }

  return `${firstName} of ${land}`
}
```

We can use arrow function syntax to protect the scope of `this`:

```javascript
var tahoe = {
  resorts: ["Kirkwood", "Squaw", "Alpine", "Heavenly", "Northstar"],
  print: function(delay=1000) {
    setTimeout(() => {
      console.log(this.resorts.join(", "))
    }, delay)
  }
}

tahoe.print()
```

## Transpiling ES6

The only way to be sure that every browser will support the code that you've lovingly written using ES6 syntax is to transpile it into vanilla JavaScript. `Babel` does a great job of this.

You can technically allow your browser to do the transpiling, by including a CDN link for `babel-core` in your HTML, but this is slow and cumbersome. Will go over how to approach this for production pages in ch5.

## ES6 Objects and Arrays

### Destructuring Assignment

Allows us to locally scope fields within an object and to declare which values will be used.

```javascript
var sandwich = {
  bread: "dutch crunch",
  meat = "tuna",
  cheese: "swiss",
  toppings: ["lettuce", "tomato", "mustard"]
}

var {bread, meat} = sandwich // creates new local variables bread and meat

// changing the local variables
bread = "garlic"
meat = "turkey"

console.log(sandwich.bread, sandwich.meat) // dutch crunch tuna
```

Can also destructure incoming function arguments:

```javascript
// Not destructuring
var lordiy = regularPerson => {
  console.log(`${regularPerson.firstname} of Canterbury`)
}

var regularPerson = {
  firstname: "Bill",
  lastname: "Wilson"
}

lordify(regularPerson)  // Bill of Canterbury

// With destructuring
var lordify = ({firstname}) => {
  console.log(`${firstname} of Canterbury`)
}

lordify(regularPerson)  // Bill of Canterbury
```

This makes it more decalrative - we're saying that we explicitly only want the `firstname` variable from the input.

You can also destructure values from an array:

```javascript
var [firstResort] = ["Kirkwood", "Squaw", "Alpine"]
console.log(firstResort) // Kirkwood

var [,,thirdResort] = ["Kirkwood", "Squaw", "Alpine"]
console.log(thirdResort) // Alpine
```

### Object Literal Enhancement

Grabbing variables from the global scope and putting them back into objects.

```javascript
var name = "Tallac"
var elevation = 9738

var funHike = {name, elevation}

console.log(funHike) // {name: "Tallac", elevation: 9738}
```

We can extend the same approach to functions:

```javascript
var name = "Tallac"
var elevation = 9738
var print = function() {
  console.log(`Mt. ${this.name} is ${this.elevation} feet tall`)
}

var funHike = {name, elevation, print}

funHike.print() // Mt. Tallac is 9738 feet tall
```

New object literal enhancement version of declaring Objects:

```javascript
// OLD
var skier = {
  name: name,
  sound: sound,
  powderYell: function() {
    var yell = this.sound.toUpperCase()
    console.log(`${yell} ${yell} ${yell}!!!`)
  },
  speed: function(mph) {
    this.speed = mph
    console.log('speed:', mph)
  }
}

//NEW
const skier = {
  name,
  sound,
  powderYell() {
    let yell = this.sound.toUpperCase()
    console.log(`${yell} ${yell} ${yell}!!!`)
  },
  speed(mph) {
    this.speed = mph
    console.log('speed:', mph)
  }
}
```

Pulling global variables into objects.

### The Spread Operator

Three dots `...` that perform several different tasks:
