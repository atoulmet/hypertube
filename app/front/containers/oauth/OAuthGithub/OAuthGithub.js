'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Col, Icon } from 'antd'

import { connectGithubOAuthAction, loadLayoutBackgroundAction } from '../../../actions/index'
import './OAuthGithub.scss'

class OAuthGithub extends Component {

    componentDidMount() {
        const { code } = this.props
        this.props.loadBackgroundImage('https://desktopwalls.net/wp-content/uploads/2014/11/Morpheus%20Matrix%20Choose%20Pill%20Desktop%20Wallpaper.jpg')

        if (code && code.length) {
            this.props.connectOAuth(code)
        }
    }

    componentWillReceiveProps(nextProps) {
        const { props } = this

        if (nextProps.signin.isAuthenticated) {
            props.history.push('/')
        }
        else {
            props.history.push('/login')
        }
    }

    render() {
        return (
            <Col className={ 'oauth-loading-wrapper' } offset={ 4 } span={ 16 }>
                <Icon className={ 'oauth-loading-icon' } type='loading' />
            </Col>
        )
    }
}

OAuthGithub.propTypes = {
    connectOAuth: PropTypes.func.isRequired,
    loadBackgroundImage: PropTypes.func.isRequired,
    code: PropTypes.string,
    history: PropTypes.object.isRequired,
    signin: PropTypes.shape({
        errors: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string,
            message: PropTypes.string,
            type: PropTypes.string
        })),
        isLoading: PropTypes.bool.isRequired,
        hasSucceeded: PropTypes.bool.isRequired,
        isAuthenticated: PropTypes.bool.isRequired
    })
}

const mapStateToProps = (state) => {
    const signin = state.auth
    return { signin }
}

const mapDispatchToProps = dispatch => {
    return {
        connectOAuth: code => { dispatch(connectGithubOAuthAction(code)) },
        loadBackgroundImage: url => { dispatch(loadLayoutBackgroundAction(url)) }
    }
}

const ConnectedOauthGithub = connect(mapStateToProps, mapDispatchToProps)(OAuthGithub)

export default ConnectedOauthGithub