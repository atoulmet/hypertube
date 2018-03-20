'use strict'

import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Switch } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'
import Routes from './Routes'
import './dist/style.scss'

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

class App extends Component {
    render() {
        return (
            <Provider store={ store }>
                <Router >
                    <Switch>
                        <Routes />
                    </Switch>
                </Router>
            </Provider>
        )
    }
}
export default App