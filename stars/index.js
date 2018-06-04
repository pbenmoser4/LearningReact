import React from 'react'
import { render } from 'react-dom'
import StarRating from './components/StarRating'

window.React = React

render(
  <StarRating totalStars={5}/>,
  document.getElementById("react-container")
)
