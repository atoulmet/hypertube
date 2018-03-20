'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Button, Form } from 'antd'
import { I18n } from 'react-i18next'
import { message } from 'antd'

import { FbOAuthAction } from '../../../actions/index'
import secret from '../../../config/secret'

class FacebookLogin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: props.errors
        }
    }

    componentWillReceiveProps(nextProps) {
        const { errors } = nextProps

        if ( this.state.errors !== errors && nextProps.type === 'FB') {
            errors.forEach((elem) => {
                message.error(elem.message)
            })
        }
    }

    componentDidMount() {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: secret.FB.APP_ID,
                xfbml: true,
                version: 'v2.12',
                cookie: true
            })
        };

        (function (d, s, id) {
            let fjs = d.getElementsByTagName(s)[0]
            let js = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) { return }
            js = d.createElement(s); js.id = id
            js.src = 'https://connect.facebook.net/en_US/all.js'
            fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'))
    }

    _checkStatus() {
        const that = this

        window.FB.getLoginStatus((response) => {
            if (response) {
                if (response.status === 'connected') {
                    that.props.signin(response.authResponse)
                }
            }
        })
    }

    _onClick() {
        window.FB.getLoginStatus((response) => {
            if (response) {
                if (response.status == 'connected') {
                    this.props.signin(response.authResponse)
                }
                else {
                    window.FB.login(this._checkStatus.bind(this))
                }
            }
        })
    }

    render() {
        return (
            <I18n>
                { (t) => (
                    <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                        <Button className={ 'ant-btn facebook' } icon='facebook' onClick={ () => { this._onClick() } } >{ t('Connect with') + ' Facebook'}</Button>
                    </Form.Item>
                )}
            </I18n>
        )
    }
}

FacebookLogin.defaultProps = {
}

FacebookLogin.propTypes = {
    signin: PropTypes.func.isRequired,
    errors: PropTypes.array,
    type: PropTypes.string,
}

const mapStateToProps = (state) => {
    return {
        errors: state.auth.errors,
        type: state.auth.type
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signin: authResponse => { dispatch(FbOAuthAction(authResponse)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacebookLogin)