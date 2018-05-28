# Chapter 5: React with JSX

JSX is a JavaScript extension that allows us to define React elements in a syntax that is similar to HTML.

## React Elements as JSX

```javascript
React.createElement(IngredientsList, {list:[...]});
```

In JSX would look like

```html
<IngredientsList list={[...]}/>
```

Notice the curly braces around the list that we pass in as a property to `IngredientsList`. This is a JavaScript _expression_, and the braces are necessary when passing JS values into components as properties.

### JSX Tips

There are a few things to keep in mind when working with JSX, even though it looks like HTML.

#### Nested Components

Components can be children of other components.

```html
<IngredientsList>
  <Ingredient />
  <Ingredient />
  <Ingredient />
</IngredientsList>
```

#### className

`class` is a reserved keyword in JS, so we use `className`:

```html
<h1 className="fancy">Baked Salmon</h1>
```

#### JavaScript expressions

Wrapped in curly braces, JS expressions indicate where variables should be evaluated and their resulting values returned.

```html
<h1>{this.props.title}</h1>
```

Unless the value is a string, you treat it like a JS expression:

```html
<input type="checkbox" defaultChecked={false} />
```

#### Evaluation

The items inside curly braces will be evaluated as JS

```js
<h1>{"Hello" + this.props.title}</h1>

<h1>{this.props.title.toLowerCase().replace}</h1>

function appendtitle({this.props.title}) {
  console.log(`${this.props.title} is great!`)
}
```

#### Mapping arrays to JSX

You can incorporate JSX directly inside of JS functions

```js
<ul>
  {this.props.ingredients.map((ingredient, i) =>
    <li key={i}>{ingredient}</li>
  )}
</ul>
```

## Babel

Not all browsers support ES6 and ES7, and none support JSX, so we need a way to convert (transpile) our source into something the browser can interpret. Babel is basically the industry default at this point (Facebook, the creator of React, uses Babel in production).

The easiest way to get started with Babel is to use a CDN link to the `babel-core` transpiler directly in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>React Examples</title>
</head>
<body>
  <div id="react-container"></div>

  <!-- React Library & React DOM -->
  <script src="https://unpkg.com/react@15.4.2/dist/react.js"></script>
  <script src="https://unpkg.com/react-dom@15.4.2/dist/react-dom.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.29/browser.js"></script>

  <script type="text/babel">

  </script>

</body>
</html>
```

## Recipes as JSX

Consider we have the following data in our application, stored as an array of two JavaScript objects:

```js
var data = [
  {
    "name": "Baked Salmon",
    "ingredients": [
      { "name": "Salmon", "amount": 1, "measurement": "l lb" },
      { "name": "Pine Nuts", "amount": 1, "measurement": "cup" },
      { "name": "Butter Lettuce", "amount": 2, "measurement": "cups" },
      { "name": "Yellow Squash", "amount": 1, "measurement": "med" },
      { "name": "Olive Oil", "amount": 0.5, "measurement": "cup" },
      { "name": "Garlic", "amount": 3, "measurement": "cloves" }
    ],
    "steps": [
      "Preheat the oven to 350 degrees.",
      "Spread the olive oil around a glass baking dish.",
      "Add the salmon, garlic, and pine nuts to the dish.",
      "Bake for 15 minutes.",
      "Add the yellow squash and put back in the oven for 30 mins.",
      "Remove from oven and let cool for 15 minutes. Add the lettuce and serve."
    ]
  },
  {
    "name": "Fish Tacos",
    "ingredients": [
      { "name": "Whitefish", "amount": 1, "measurement": "l lb" },
      { "name": "Cheese", "amount": 1, "measurement": "cup" },
      { "name": "Iceberg Lettuce", "amount": 2, "measurement": "cups" },
      { "name": "Tomatoes", "amount": 2, "measurement": "large"},
      { "name": "Tortillas", "amount": 3, "measurement": "med" }
    ],
    "steps": [
      "Cook the fish on the grill until hot.",
      "Place the fish on the 3 tortillas.",
      "Top them with lettuce, tomatoes, and cheese."
    ]
  }
];
```

We can create the UI for these recipes with a `Menu` component for listing recipes and a `Recipe` component for the recipes themselves.

```js
// the data
var data = [ ... ];

// A stateless functional component for an individual Recipe
const Recipe = ({ name, ingredients, steps }) => (
  <section id={name.toLowerCase().replace(/ /g, "-")}>
    <h1>{name}</h1>
    <ul className="ingredients">
      {ingredients.map((ingredient, i) =>
        <li key={i}>{ingredient.name}</li>
      )}
    </ul>
    <section className="instructions">
      <h2>Cooking Instructions</h2>
      {steps.map((step, i) =>
        <p key={i}>{step}</p>
      )}
    </section>
  </section>
)

// A stateless function component for the Menu of Recipes
const Menu = ({ title, recipes }) => (
  <article>
    <header>
      <h1>{title}</h1>
    </header>
    <div className="recipes">
      {recipes.map((recipe, i) =>
        <Recipe key={i} {...recipe} />
      )}
    </div>
  </article>
)

// A call to ReactDom.render to render our Menu into the current DOM
ReactDOM.render(
  <Menu recipes={data} title="Delicious Recipes" />,
  document.getElementById("react-container")
)
```

We're using all sorts of new features above! Object destructuring to locally scope arg fields by name, object spreading to pass arguments to the `Recipe` component, and stateless function components for `Menu` and `Recipe`.
