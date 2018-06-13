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

We also added `ref` fields to the components whose values we're going to want to reference later. By creating the `_title` and `_color` ref attributes, we can access those elements with `this.refs_title` and `this.refs_color` (I don't know why).

__Note__: when useing `React.createClass`, we don't need to deal with binding the `this` scope - React does that for us.

### Inverse Data Flow

This involves sending a callback function to the component as a property, which the component can then use to pass back data.

```js
const logColor = (title, color) => console.log(`New Color: ${title} | ${color}`)

<AddColorForm onNewColor={logColor} />
```

And then within the `AddColorForm` component:

```js
submit(e) {
  const {_title, _color} = this.refs
  this.props.onNewColor(_title.value, _color.value)
  _title.value = ''
  _color.value = '#000000'
  _title.focus()
}
```

### Refs in Stateless Functional Components

Here's `AddColorForm` as a stateless functional component:

```js
const AddColorForm = ({onNewColor=f=>f}) => {
  let _title, _color
  const submit = e => {
    e.preventDefault()
    onNewColor(_title.value, _color.value)
    _title.value = ''
    _color.value = "#000000"
    _title.focus()
  }
  return (
    <form onSubmit={submit}>
      <input ref={input => _title = input} type="text" placeholder="color..." required/>
      <input ref={input => _color = input} type="color" required/>
      <button>ADD</button>
    </form>
  )
}
```

## React State Management

React components' properties are immutable. React state is a built-in option for managing data that will change within a component. State can be expressed in React components with a single JavaScript object; when the state of a component changes, the component renders a new UI to reflect those changes.

### Introducing Component State

Looking at an example of a star-based rating UI.

```js
const Star = ({ selected=false, onClick=f=>f }) =>
  <div className={(selected) ? "star selected" : "star"} onClick={onClick}>
  </div>

Star.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func
}
```

`Star` here is a stateless functional component, which cannot have state, and is meant to be the child of a more complex, stateful component. It's good practice to keep as many components stateless as possible.

We're going to leverage `Star` now to create a `StarRating` component, which the user can interact with.

```js
const StarRating = createClass({
  displayName: 'StarRating',
  propTypes: {
    totalStarts: PropTypes.number
  },
  getDefaultProps() {
    return {
      totalStars: 5
    }
  },
  getInitialState() {
    return {
      starsSelected: 0
    }
  },
  change(starsSelected) {
    this.setState({starsSelected})
  },
  render() {
    const {totalStars} = this.props
    const {starsSelected} = this.state
    return (
      <div className="star-rating">
        {[...Array(totalStars)].map((n, i) =>
          <Star key={i}
              selected={i<starsSelected}
              onClick={() => this.change(i+1)} />
        )}
        <p>{starsSelected} of {totalStars} stars</p>
      </div>
    )
  }
})
```

Notice how we initialize (and therefore define the presence of) state by adding `getInitialState()` to the `StarRating` configuration. So looking at the setup, we can see that `props` is used for permanent, immutable properties, and `state` is used for temporary, mutable properties.

We can also use an ES6 component class to create this class:

```js
class StarRating extends Component {
  constructor(props) {
    super(props)
    this.state = {
      starsSelected: 0
    }
    this.change = this.change.bind(this)
  }

  change(starsSelected) {
    this.setState({starsSelected})
  }

  render() {
    const {totalStars} = this.props
    const {starsSelected} = this.state

    return (
      <div className="star-rating">
        {[...Array(totalStars)].map((n, i) =>
          <Star key={i} selected={i<starsSelected} onClick={() => this.change(i+1)} />
        )}
        <p>{starsSelected} of {totalStars} stars</p>
      </div>
    )
  }
}

StarRating.propTypes = {
  totalStars: PropTypes.number
}

StarRating.defaultProps = {
  totalStars: 5
}
```

### Initializing State from Properties

The most common use for this is when we create a reusable component that we want to use across applications in different component trees. When using `createClass()`, the best way to approach this is by using the `componentWillMount()` method definition:

```js

const StarRating = createClass({
  displayName: 'StarRating',
  ...,
  componentWillMount() {
    const { starsSelected } = this.props
    if (starsSelected) {
      this.setState({starsSelected})
    }
  },
  ...
})
```

`componentWillMount` is part of the component lifecycle, which we go over more deeply in the next chapter.

When you're using ES6 class components, things get even easier:

```js
constructor(props) {
  super(props)
  this.state = {
    starsSelected: props.starsSelected || 0
  }
  this.change = this.change.bind(this)
}
```

## State Within the Component Tree

In many applications, it's possible to store all of your state in the root component; this is called having a "single source of truth".

### Color Organizer App Overview

The entire state of the previous color organizer application could be represented with a single array:

```js
{
  colors: [
    {
      "id": "0175d1f0-a8c6-41bf-8d02-df5734d829a4",
      "title": "ocean at dusk",
      "color": "#00c4e2",
      "rating": 5
    },
    {
      "id": "83c7ba2f-7392-4d7d-9e23-35adbe186046",
      "title": "lawn",
      "color": "#26ac56",”
      "rating": 3
    },
    {
      "id": "a11e3995-b0bd-4d58-8c48-5e49ae7f7f23",
      "title": "bright red",
      "color": "#ff0000",
      "rating": 0
    }
  ]
}
```

When users add or remove colors, the will be added to or removed from this array. When users rate colors, their ratings will change in the array.

### Passing Properties Down the Component Tree

It makes more sense to use the `StarRating` component as a _presentational component_ and declare it as a stateless functional component, than to use it as we have in this chapter.

```js
const StarRating = ({starsSelected=0, totalStars=5, onRate=f=>f}) =>
  <div className="star-rating">
    {[...Array(totalStars)].map((n, i) =>
      <Star key={i} selected={i<starsSelected} onClick={() => onRate(i+1)} />
    )}
    <p>{starsSelected} of {totalStars} stars</p>
  </div>
```

We can see that starsSelected is no longer state, it's now a property. There's also a new `onRate()` callback function prop.

Using this approach means that all state is passed down to child components as properties. In the color organizer app, state is just an array of colors that is declared in the `App` component.

```js
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      colors: []
    }
  }
  render() {
    const {colors} = this.state
    return(
      <div className="app">
        <AddColorForm/>
        <ColorList colors={colors} />
      </div>
    )
  }
}
```

Initially, the list of colors held in `this.state` above is empty, but as users select colors, the array is updated, and the selected colors are passed on to `Color` components:

```js
const ColorList = ({ colors=[] }) =>
  <div className="color-list">
    {(colors.length === 0) ?
      <p>No Colors Listed. (Add a Color)</p> :
      colors.map(color => <Color key={color.id} {...color} />
      )
    }
  </div>

// Constructing the Color component
const Color = ({ title, color, rating=0 }) =>
  <section className="color">
    <h1>{title}</h1>
    <div className="color" style={{ backgroundColor: color }}>
    </div>
    <div>
      <StarRating starsSelected={rating} />
    </div>
  </selection>
```

### Passing Data Back Up the Component Tree

Use callbacks.
