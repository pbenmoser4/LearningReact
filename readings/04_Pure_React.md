# Chapter 4: Pure Reacts

Usually people just learn JSX and transpile it into pure React, but we're going to take a chapter to look at what the pure React actually looks like.

## Page Setup

`React` and `ReactDOM` are two libraries we need to include to use React in the browser. Splitting the DOM elements and the pure React elements into two separate modules makes it easier to create modules that you can share between projects.

## The Virtual DOM

HTML is a set of instructions that a browser uses to create the document object model. Elements in HTML relate to each other in a hierarchy that resembles a family tree.

Originally, HTML existed in independent pages, and then AJAX allowed people to load tiny bits of data independently, so single-paged apps were possible.

DOM API - a collection of objects that JavaScript can use to interact with the browser to modify DOM. E.g. `document.createElement`.

It's important to note that making changes to existing DOM elements is pretty fast, but inserting new ones is quite slow.

Keeping track of all of the changes can become cumbersome, which is exactly why we have React - to update the DOM for us. We interact with React, working with the virtual DOM, and React updates the actual DOM for us.

The virtual DOM consists only of JavaScript objects.

## React Elements

React elements are instructions for how the browser DOM should be created.

```javascript
React.createElement("h1", null, "Baked Salmon")
```

The first argument is the type of element, the second is its properties, and the third is its children. This React component gets translated into the following DOM element:

```html
<h1>Baked Salmon</h1>
```

Getting a little more complicated:

```javascript
React.createElement("h1",
  {id: "recipe-0", 'data-type': "title"},
  "Baked Salmon"
)
```
```html
<h1 data-reactroot id="recipe-0" data-type="title">Baked Salmon</h1>
```
`data-reactroot` will always appear as an attribute of the root element of your React components.

What does the actual React element look like though? I.e. what does `React.createElement()` actually create?

```javascript
{
  $$typeof: Symbol(React.element),
  "type": "h1",
  "key": null,
  "ref": null,
  "props": {"children": "Baked Salmon"},
  "_owner": null,
  "_store": {}
}
```

You'll never actually create literals that look like this, but there you go.

## ReactDOM

Contains all of the tools necessary to translate the virtual DOM into HTML. For instance, `ReactDOM.render()` will render a React element to the DOM:

```javascript
var dish = React.createElement("h1", null, "Baked Salmon")
ReactDOM.render(dish, document.getElementById('react-container'))
```

This would render the `dish` component in the following html:

```html
<body>
  <div id="react-container">
  </div>
</body>
```

## Children

ReactDOM allows you to render a single element to the DOM, all other elements will be children of this top-level `data-reactroot` element. This is why we'll hear the term _component tree_: there's one root, and many components that branch out from that root.

```html
<ul>
  <li> 1 lb Salmon</li>
  <li>1 cup Pine Nuts</li>
  <li>2 cups Butter Lettuce</li>
  <li>1 Yellow Squash</li>
  <li>1/2 cup Olive Oil</li>   
  <li>3 cloves of Garlic</li>
</ul>
```

This unordered list would be represented in React as

```javascript
React.createElement(
  "ul",
  {"className": "unordered-list"},
  React.createElement("li", null, "1 lb Salmon"),
  React.createElement("li", null, "1 cup Pine Nuts"),
  React.createElement("li", null, "2 cups Butter Lettuce"),
  React.createElement("li", null, "1 Yellow Squash"),
  React.createElement("li", null, "1/2 cup Olive Oil"),
  React.createElement("li", null, "3 cloves of Garlic"),
)
```
__Note__: when you're adding a `class` attribute to a React component, you have to use the `className` keyword, because `class` is a reserved keyword in JS.

## Constructing Elements with Data

Since React is just JavaScript, we can create things really easily with data. The example above could be created dynamically with an array of data.

```javascript
var items = [
  "1 lb Salmon",
  "1 cup Pine Nuts",
  "2 cups Butter Lettuce",
  "1 Yellow Squash",
  "1/2 cup Olive Oil",
  "3 cloves of Garlic"
]

React.createElement(
  "ul",
  { className: "ingredients" },
  items.map((ingredients, i) =>
    React.createElement("li", {key: i}, ingredient)
  )
)
```

## React Components

React _components_ allow us to reuse the same DOM structure for different recipes or sets of data. There are three different ways to create components with React:

### createClass

__NOTE__ this may be deprecated in the future. But, then again, so may everything.

In the `render()` function, we can use `this` to refer to the component instance. The component's properties can be accessed through `this.props`:

```javascript
const IngredientsList = React.createClass({
  displayName: "IngredientsList",
  render() {
    return React.createElement("ul", {className: "ingredients"},
      this.props.items.map((ingredient, i) =>
        React.createElement("li", {key: i}, ingredient)
      )
    )
  }
})

const items = [
  "1 lb Salmon",
  "1 cup Pine Nuts",
  "2 cups Butter Lettuce",
  "1 Yellow Squash",
  "1/2 cup Olive Oil",
  "3 cloves of Garlic"
]

ReactDOM.render(
  React.createElement(IngredientsList, {items}, null),
  document.getElementById('react-container')
)
```

Notice above the `IngredientsList` is not surrounded with quotes. When we create elements with components, we pass in the component class directly; when we create elements with html, we quote the type of element, e.g. `"h1"`, that we want to create.

We can also build out `IngredientsList` using a custom method:

```javascript
const IngredientsList = React.createClass({
  displayName: "IngredientsList",
  renderListItem(ingredient, i) {
    return React.createElement("li", { key: i }, ingredient)
  },
  render() {
    return React.createElement("ul", {className: "ingredients"},
      this.props.items.map(this.renderListItem)
    )
  }
})
```

The idea here is similar to the idea of views in MVC languages. Everything associated withe the UI of `IngredientsList` is encapsulated into the one component.

### ES6 Classes

One of the biggest additions in ES6 is the class feature. `React.Component` is an abstract class that we can use to create custom components. Let's recreate IngredientsList using that syntax:

```javascript
class IngredientsList extends React.Component {
  renderListItem(ingredient, i) {
    return React.createElement("li", {key: i}, ingredient)
  }

  render() {
    return React.createElement("ul", {className: "ingredients"},
      this.props.items.map(this.renderListItem)
    )
  }
}
```

### Stateless Functional Components

Functions instead of objects - which means we'll be focusing on them here because of the functional approach we're taking. These should be pure functions, which (from previous chapters) means they should take in at least one argument (props), return a DOM element, and not cause any side effects.

__Note__: If you need to encapsulate functionality or have a `this` scope, you can't use stateless functional components.

```javascript
const IngredientsList = props =>
  React.createElement("ul", {className: "ingredients"},
    props.items.map((ingredient, i) =>
      React.createElement("li", {key: i}, ingredient)
    )
  )
```

We would render this component using the same `ReactDOM.render()` function used above. We can improve this slightly by destructuring the properties argument.

```javascript
const IngredientsList = ({items}) =>
  React.createElement("ul", {className: "ingredients"},
    items.map((ingredient, i) =>
      React.createElement("li", {key: i}, ingredient)
    )
  )
```

## DOM Rendering

React takes the underlying data model to reconstruct the DOM, but only makes a minimal number of changes. As many changes as possible are made by altering existing DOM elements; adding DOM elements is extremely costly, so React will only do so when necessary.

## Factories

Factories are special objects that abstract away the details of instantiating objects.

```javascript
// Creating an h1 with a factory
React.DOM.h1(null, "Baked Salmon")

// Creating a ul
React.DOM.ul({"className": "ingredients"},
  React.DOM.li(null, "1 lb Salmon"),
  React.DOM.li(null, "1 cup Pine Nuts"),
  ...
)
```

### Using Factories with Components

Who the funkhauser cares?
