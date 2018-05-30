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

__Babel Presets__

Babel 6 (notice above we're using 5.8.\*) introduced presets - meaning that developers have to specify the types of transformations being made. The most common ones are:

`babel-preset-es2015`: ES2015 (ES6) into ES5
`babel-preset-es2016`: ES2016 to ES2015
`babel-preset-es2017`: ES2017 to ES2016
`babel-preset-env`: Catchall for the previous three
`babel-preset-react`: Compiles JSX to React.createElement calls

## Into to Webpack

There are many tools that have come out for bundling and packaging files, including Browserify, Gulp, and Grunt. Webpack is probably one of the most widely used.

Webpack takes all of our files, and turns them into a single file, which improves (1) modularity and (2) network performance. It also handles transpiling, code splitting (break up code for different pages or devices), minification (removes whitespace and lengthy variable names to reduce file size), feature flagging (sends code to specific environments when testing), and Hot Module Replacement (HMR, changes only modules that are updated immediately.)

### Webpack Loaders

Loaders are functions that handle the transformations we're interested in. We specify the necessary loaders in _`webpack.config.js`_. These loaders will translate things like ES6 and JSX into code that is readable by the browser.
The most common type of loader is a transpiler. We specify the types of files that Babel should run on, and webpack takes care of everything.

There are also laoders for styling. `css-loader` looks for _`.scss`_ files and compiles them to CSS.

### Recipes App with a Webpack Build

There are a bunch of things we gain by using a tool like Webpack.

__Modularity__: We want to be able to use the CommonJS module pattern to create pieces of code that can be reused by other parts of the application to make code more approachable.

__Composing__: With modules we can focus on small, reusable React components, which are easier to comprehend, test, and reuse (and replace when necessary)

__Speed__: Packing everything into a single file will reduce the number of HTTP requests you need to make.

__Consistency__: Allows developers to use cutting edge tech that still works in today's browsers.

#### Breaking components into modules

We could break up our previous `Recipe` component into smaller parts. For instance, we could have a dedicated `Instructions` component:

```js
const Instructions = ({ title, steps }) =>
  <section className="instructions">
    <h2>title</h2>
    {steps.map((s, i) =>
      <p key={i}>{s}</p>
    )}
  </section>

export default Instructions
```

We can now use this more modular `Instructions` component for any type of instructions list.

We can also update the ingredients representations as well, to make it a bit more modular:

```js
const Ingredient = ({ amount, measurement, name }) =>
  <li>
    <span className="amount">{amount}</span>
    <span className="measurement">{measurement}</span>
    <span className="name">{name}</span>
  </li>

export default Ingredient
```

Now the IngredientsList can take advantage of the more modular components:

```js
import Ingredient from './Ingredient'

const IngredientsList = ({ list }) =>
  <ul className="ingredients">
    {list.map((ingredient, i) =>
      <Ingredient key={i} {...ingredient} />
    )}
  </ul>

export default IngredientsList
```

We can now use these modular components in our Recipe component:

```js
import IngredientsList from './IngredientsList'
import Instructions from './Instructions'

const Recipe = ({ name, ingredients, steps }) =>
  <section id={name.toLowerCase().replace(/ /g, '-')}>
    <h1>{name}</h1>
    <IngredientsList list={ingredients} />
    <Instructions title="Cooking Instructions" steps={steps} />
  </section>

export default Recipe
```

Now let's put it all together into a `Menu` component.

```js
import Recipe from './Recipe'

const Menu = ({ recipes }) =>
  <article>
    <header>
      <h1>Delicious Recipes</h1>
    </header>
    <div className="recipes">
      {recipes.map((recipe, i) =>
        <Recipe key={i} {...recipe} />
      )}
    </div>
  </article>

export default Menu
```

To render everything, we compose an `index.js` file:

```js
import React from 'react'
import { render } from 'react-dom'
import Menu from './components/Menu'
import data from './data/recipes'

window.React = React

render(
  <Menu recipes={data} />,
  document.getElementById("react-container")
)
```

You can see we're no longer loading `react` or `react-dom` directly through a `<script>` tag. To actually make all of this work, we need to create a static build process with webpack.

#### Installing webpack dependencies

First, let's install webpack globally so that we can use it anywhere:

```bash
sudo npm install -g webpack
```

Then we need to install some babel dependencies for transpiling:

```bash
npm install babel-core babel-loader babel-preset-env babel-preset-react babel-preset-stage-0 --save-dev
```

And then finally React and ReactDOM

```bash
npm install react react-dom --save
```

We now have everything we need for a static build process with weback.

#### Webpack configuration

The default webpack config file is _`webpack.config.js`_. We want to start by accessing `index.js`, which imports the other necessary files. Whenever Webpack runs into an import statement, it will grab the appropriate files (follow the import tree) and put them into the bundle.

We also need to tell webpack to transpile our JSX into pure React elements, and convert any ES6 syntax into ES5 syntax.

Sample `webpack.config.js` file, that should be in the top-level directory (same as `index.js`)

```js
module.exports = {
  entry: "./src/index.js",
  output: {
    path: "dist/assets",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_models)/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'stage-0', 'react']
        }
      }
    ]
  }
}
```

So what the hell are we doing here? first, we tell webpack that our client entry file is _`./src/index.js`_ - it will build a dependency tree starting with that file. Then we declare where we want the bundle to be output.

Next, we deal with the loaders that we want to run on our modules. In this instance, we're only using `babel-loader`. We further define which files we should operate on through the `test` and `exclude` fields. Test states the files we should run the loader on, and exclude the files we should avoid.

And of course everything is breaking down now. It looks like something was installed globally that shouldn't have been (Babel) and I had to remove `/Users/pbenmoser4/.babelrc`. Who knows but it works.

#### Loading the bundle

Now that the bundle has been... bundled... we have to get it into our site:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>React Recipes App</title>
</head>
<body>
  <div id="react-container"></div>
  <script src="dist/assets/bundle.js"></script>
</body>
</html>
```

#### Source mapping

This allows us to debug using our original files

#### Optimizing the bundle
