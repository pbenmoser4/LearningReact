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
  null,
  React.createElement("li", null, "1 lb Salmon"),
  React.createElement("li", null, "1 cup Pine Nuts"),
  React.createElement("li", null, "2 cups Butter Lettuce"),
  React.createElement("li", null, "1 Yellow Squash"),
  React.createElement("li", null, "1/2 cup Olive Oil"),
  React.createElement("li", null, "3 cloves of Garlic"),
)
