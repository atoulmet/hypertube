'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Col, Icon } from 'antd'

import { connect42OAuthAction, loadLayoutBackgroundAction } from '../../../actions/index'
import './OAuth42.scss'

class OAuth42 extends Component {

    constructor(props) {
        super(props)
    }

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

OAuth42.propTypes = {
    connectOAuth: PropTypes.any,
    code: PropTypes.string,
    history: PropTypes.object.isRequired,
    loadBackgroundImage: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
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
        connectOAuth: code => { dispatch(connect42OAuthAction(code)) },
        loadBackgroundImage: url => { dispatch(loadLayoutBackgroundAction(url)) }
    }
}

const ConnectedOauth42 = connect(mapStateToProps, mapDispatchToProps)(OAuth42)

export default ConnectedOauth42