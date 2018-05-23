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
