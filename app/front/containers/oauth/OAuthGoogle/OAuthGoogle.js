'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Button, Form } from 'antd'
import { I18n } from 'react-i18next'
import { message } from 'antd'

import { GoogleOAuthAction } from '../../../actions/index'

class GoogleLogin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: props.errors
        }
    }

    componentWillReceiveProps(nextProps) {
        const { errors } = nextProps

        if ( this.state.errors !== errors && nextProps.type === 'Google') {
            errors.forEach((elem) => {
                message.error(elem.message)
            })
        }
    }

    _onClick = () => {
        window.gapi.load('auth2', () => {
            let auth2 = window.gapi.auth2.init({
                client_id: '243124008000-fl4n830b14am42lq777e4a0d666fgmk2.apps.googleusercontent.com',
                fetch_basic_profile: false,
                scope: 'email'
            })

            auth2.signIn({
                ux_mode: 'popup',
                prompt: 'consent'
            })
            .then(() => {
                this.props.signinGoogle(auth2.currentUser.get().Zi.access_token)
            })
            .catch(() => { })
        })
    }

    render() {
        return (
            <I18n>
                { (t) => (
                    <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                        <Button className={ 'ant-btn google' } icon='google' onClick={ this._onClick } >{ t('Connect with') + ' Google'}</Button>
                    </Form.Item>
                )}
            </I18n>
        )
    }
}

GoogleLogin.defaultProps = {
    type: ''
}

GoogleLogin.propTypes = {
    signinGoogle: PropTypes.func.isRequired,
    errors: PropTypes.array,
    type: PropTypes.string
}

const mapStateToProps = (state) => {
    return {
        errors: state.auth.errors,
        type: state.auth.type,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signinGoogle: authResponse => { dispatch(GoogleOAuthAction(authResponse)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleLogin)