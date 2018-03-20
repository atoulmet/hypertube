'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'


let console = {}
console.log = function () { }
window.console = console


const render = Component => {
    ReactDOM.render(
        <Component />,
        document.getElementById('root')
    )
}

render(App)