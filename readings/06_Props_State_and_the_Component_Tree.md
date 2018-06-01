# Chapter 6: Props, State, and the Component Tree

## Property Validation

JavaScript is loosely typed, so you have to keep track of the variables that you're declaring. React has built-in automatic property validation.

We're going to be creating a "summary" section for our recipes to show how all of this is done.

### Validating Props with createClass()

Consider the following implementation of `Summary`

```js
const Summary = createClass({
  displayName: "Summary",
  render() {
    const {ingredients, steps, title} = this.props
    return (
      <div className="summary">
        <h1>{title}</h1>
        <p>
          <span>{ingredients.length} Ingredients</span> |
          <span>{steps.length} Steps</span>
        </p>
      </div>
    )
  }
})
```

In this case we expect `ingredients` and `steps` to be arrays, but what if we accidentally pass in something like a string? In that case specifically, JavaScript would count the number of characters in the string.

Here's how it looks with built-in validation (we're also going to change the idea slightly so that `ingredients` and `steps` require a number, because that's what they're actually displaying):

```js
const Summary = createClass({
  displayName: "Summary",
  propTypes: {
    ingredients: PropTypes.number.isRequired,
    steps: PropTypes.number.isRequired,
    title: PropTypes.string
  },
  render() {
    const {ingredients, steps, title} = this.props
    return (
      <div className="summary">
        <h1>{title}</h1>
        <p>
          <span>{ingredients} Ingredients</span> |
          <span>{steps} Steps</span>
        </p>
      </div>
    )
  }
})
```

This will lead our application to throw an error if we pass in data with the incorrect type.

### Default Props

Same as specifying default values for functions. Let's say we want the `Summary` component to work even when props are not passed to it.

```js
const Summary = createClass({
  displayName: "Summary",
  propTypes: {
    ingredients: PropTypes.number,
    steps: PropTypes.number,
    title: PropTypes.string
  },
  getDefaultProps() {
    return {
      ingredients: 0,
      steps: 0,
      title: "[untitled recipe]"
    }
  },
  render() {
    const {ingredients, steps, title} = this.props
    return (
      <div className="summary">
        <h1>{title}</h1>
        <p>
          <span>{ingredients} Ingredients</span> |
          <span>{steps} Steps</span>
        </p>
      </div>
    )
  }
})
```

### Custom Property validation

You may want to validate more than just a prop being a number or a string. This is done by creating a validation function. This function should either return an error when a specific validation requirement is not met, or `null` when the property is valid.

```js
propTypes: {
  ingredients: PropTypes.number,
  steps: PropTypes.number,
  title: (props, propName) =>
    (typeof props[propName] !== 'string') ?
      new Error("A title must be a string") :
      (props[propName].length > 20) ?
        new Error("title is over 20 characters") :
        null
}
```

As you can see, during validation React injects the `props` and the `propName` into the validation function for you to use for validating the passed in prop.

### ES6 Classes and Stateless Functional Components

So far, we've only been using `React.createClass`. Here's how the same validation looks with ES6 Class syntax:

```js
class Summary extends React.Component {
  render() {
    const {ingredients, steps, title} = this.props
    return (
      <div className="summary">
        <h1>{title}</h1>
        <p>
          <span>{ingredients} Ingredients | </span>
          <span>{steps} Steps</span>
        </p>
      </div>
    )
  }
}

Summary.propTypes = {
  ingredients: PropTypes.number,
  steps: PropTypes.number,
  title: (props, propName) =>
    (typeof props[propName] !== 'string') ?
      new Error("A title must be a string") :
      (props[propName].length > 20) ?
        new Error("title is over 20 characters") :
        null
}

Summary.defaultProps = {
  ingredients: 0,
  steps: 0,
  title: "[recipe]"
}
```

As you can see, the `propTypes` and `defaultProps` declarations are defined on the class outside of the class body (after the class definition).

We can also add these validators to stateless functional components.

```js
const Summary = ({ ingredients, steps, title }) => {
  return <div>
    <h1>{title}</h1>
    <p>{ingredients} Ingredients | {steps} Steps</p>
  </div>
}

Summary.propTypes = {
  ingredients: React.PropTypes.number.isRequired,
  steps: React.PropTypes.number.isRequired
}

Summary.defaultProps = {
  ingredients: 1,
  steps: 1
}
```

We can also set the default values with a stateless functional component in the component definition:

```js
const Summary = ({ ingredients=0, steps=0, title='[recipe]' }) => {
  ...
}
```

## Refs

Refs are a feature that allows React components to interact with child elements. The most common use case is children that take in user input.

The app that we're working with allows users to save and manage specific hexadecimal colors.

```js
import { Component } from 'react'

class AddColorForm extends Component {
  render() {
    return (
      <form onSubmit={e=>e.preventDefault()}>
        <input type="text" placeholder="color title..." required/>
        <input type="color" required />
        <button>ADD</button>
      </form>
    )
  }
}
```

The form defined above has three fields: a text field for naming colors, a color field for picking colors, and an add button. We added in `e.preventDefault()` so that the default form behavior is ignored when the form is submitted.

Here's how we handle getting the information from the form:

```js
import { Component } from 'react'

class AddColorForm extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  submit(e) {
    const { _title, _color } = this.refs
    e.preventDefault();
    alert('New Color: ${_title.value} ${_color.value}')
    _title.value = '';
    _color.value = '#000000';
    _title.focus();
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <input ref="_title" type="text" placeholder="color title..." required/>
        <input ref="_color" type="color" required/>
        <button>ADD</button>
      </form>
    )
  }
}
```

We needed to add a constructor to this component because we moved `submit` to its own function, which means we must bind the scope of the component to `submit` (also any functions that need to access the component's scope with `this`).
