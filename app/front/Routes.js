'use strict'

import React, { Component } from 'react'
import { Route, Redirect, withRouter, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Layout } from 'antd'

import OAuth42 from './containers/oauth/OAuth42/OAuth42'
import OAuthGithub from './containers/oauth/OAuthGithub/OAuthGithub'
import OAuthInstagram from './containers/oauth/OAuthInstagram/OAuthInstagram'

import Registration from './containers/auth/Registration/Registration'
import Signin from './containers/auth/Signin/Signin'
import ForgottenPassword from './containers/auth/ForgottenPassword/ForgottenPassword'
import ResetPassword from './containers/auth/ResetPassword/ResetPassword'
import LandingLoggedOff from './containers/auth/Landing/Landing'

import LandingLoggedIn from './containers/user/Landing/Landing'
import Search from './containers/user/Search/Search'
import Movie from './containers/user/Movies/Movies'
import Profile from './containers/user/Profile/Profile'
import EditAccount from './containers/user/EditAccount/EditAccount'
import EditProfile from './containers/user/EditProfile/EditProfile'
import Logout from './containers/user/Logout/Logout'

import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import NotFound from './components/NotFound/NotFound'

const StaticBackground = (Wrapped) => {

    return class WrappedComponent extends Component {

        render () {
            return (
                <Layout.Content style={ { backgroundColor: 'black', backgroundImage: '' } }>
                    <Wrapped { ...this.props } />
                </Layout.Content>
            )
        }
    }
}

const DynamicBackground = (Wrapped) => {

    class WrappedComponent extends Component {

        render () {
            return (
                <Layout.Content style={ { backgroundImage: `url(${ this.props.layoutBackground })` } }>
                    <Wrapped { ...this.props } />
                </Layout.Content>
            )
        }
    }

    WrappedComponent.defaultProps = {
        layoutBackground: ''
    }

    WrappedComponent.propTypes = {
        layoutBackground: PropTypes.string.isRequired
    }

    const ConnectedWrapped = withRouter(connect((state) => state.backgrounds)(WrappedComponent))

    return ConnectedWrapped
}

class Routes extends Component {

    render () {

        return (
            <Layout>
                <Header />
                <Switch>
                    <OAuth42Route component={ OAuth42 } exact path='/oauth/42/' />
                    <OAuthGithubRoute component={ OAuthGithub } exact path='/oauth/github/' />
                    <OAuthInstagramRoute component={ OAuthInstagram } exact path='/oauth/instagram/' />

                    { localStorage.token && <Route component={ StaticBackground(LandingLoggedIn) } exact path='/' /> }
                    { localStorage.token == undefined && <Route component={ DynamicBackground(LandingLoggedOff) } exact path='/' /> }

                    <Route component={ DynamicBackground(Signin) } exact path='/login' />
                    <Route component={ DynamicBackground(Registration) } exact path='/register' />
                    <Route component={ DynamicBackground(ForgottenPassword) } exact path='/forgot-password' />
                    <Route component={ DynamicBackground(ResetPassword) } exact path='/reset-password' />

                    <AuthenticatedRoute component={ StaticBackground(Movie) } exact path='/movies/:title' />
                    <AuthenticatedRoute component={ StaticBackground(Search) } exact path='/search' />
                    <AuthenticatedRoute component={ StaticBackground(Profile) } exact path='/users/:user' />
                    <AuthenticatedRoute component={ StaticBackground(EditAccount) } exact path='/edit/account' />
                    <AuthenticatedRoute component={ StaticBackground(EditProfile) } exact path='/edit/profile' />
                    <AuthenticatedRoute component={ StaticBackground(Logout) } exact path='/logout' />

                    <Route component={ NotFound }/>

                </Switch>
                <Footer />
            </Layout>
        )
    }
}

const OAuth42Route = ({ component: Component, ...rest }) => {
    return (
        <Route { ...rest } render={ (props) => {
            const { location } = props
            const search = (location) ? location.search : null
            const code = search.match(new RegExp(/\?.*=(.*)$/))

            return <Component { ...props } code={ (code && code.length > 1 ? code[1] : null) } />
        } } />
    )
}

const OAuthGithubRoute = ({ component: Component, ...rest }) => {
    return (
        <Route { ...rest } render={ (props) => {
            const { location } = props
            const search = (location) ? location.search : null
            const code = search.match(new RegExp(/\?.*=(.*)$/))

            return <Component { ...props } code={ (code && code.length > 1 ? code[1] : null) } />
        } } />
    )
}

const OAuthInstagramRoute = ({ component: Component, ...rest }) => {
    return (
        <Route { ...rest } render={ (props) => {
            const { location } = props
            const tokenString = location.hash
            const token = tokenString.slice(14, tokenString.length)

            return <Component { ...props } token={ (token && token.length > 1 ? token : null) } />
        } } />
    )
}

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
    if (localStorage.token) {
        return <Route { ...rest } render={ (props) => <Component { ...props } /> } />
    }
    else {
        return <Route { ...rest } render={ (props) => <Redirect to={ { pathname: '/login', state: { from: props.location } } } /> } />
    }
}

OAuth42Route.propTypes = {
    component: PropTypes.func,
    location: PropTypes.object
}

OAuthGithubRoute.propTypes = {
    component: PropTypes.func,
    location: PropTypes.object
}

OAuthInstagramRoute.propTypes = {
    component: PropTypes.func,
    location: PropTypes.object
}

AuthenticatedRoute.propTypes = {
    component: PropTypes.func,
    location: PropTypes.object
}

export default Routes
