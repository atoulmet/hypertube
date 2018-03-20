'use strict'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Input, Button, Form, Icon, message } from 'antd'
import { I18n } from 'react-i18next'

import './SigninForm.scss'
import { signinFormAction } from '../../../../actions/index'
import FacebookLogin from '../../../oauth/OAuthFB/OAuthFB'
import GoogleLogin from '../../../oauth/OAuthGoogle/OAuthGoogle'

class SigninForm extends Component {
    constructor (props) {
        super(props)

        this.state = {
            data: props.data,
            signin: props.signin
        }
    }

    componentWillReceiveProps(nextProps) {
        const { signin } = nextProps
        const { isLoading, hasSucceeded, isAuthenticated } = signin

        if (this.state.signin !== signin) {
            if (this.state.signin.isLoading && Array.isArray(signin.errors) && signin.errors.length && signin.type === 'Signin') {
                signin.errors.forEach((elem) => {
                    message.error(elem.message)
                })
            }
            this.setState( { signin: { isLoading, hasSucceeded, isAuthenticated } } )
        }
    }

    _handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            if (!errors)
                this.props.sendRequest(values)
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <I18n>
                { (t) => (
                    <Form className='register-form' onSubmit={ this._handleSubmit }>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('username', {
                                rules: [ {
                                    message: t('Please enter your ')+t('username'),
                                    required: true
                                } ],
                            })(
                                <Input placeholder={ t('Username') } prefix={ <Icon type='user'/> } />
                        )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('password', {
                                rules: [ {
                                    message: t('Please enter your ')+t('password'),
                                    required: true
                                } ],
                            })(
                                <Input placeholder={ t('Password') } prefix={ <Icon type='lock'/> } type={ 'password' } />
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <Button className='login-form-button large' htmlType='submit' type='primary'>{ t('Confirm') }</Button>
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <Link to='/forgot-password'>{ t('Password forgotten ?') }</Link>
                        </Form.Item>
                        <FacebookLogin />
                        <GoogleLogin />
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <a href='https://github.com/login/oauth/authorize?scope=user&client_id=d258f1bb5521e519feb4'>
                                <Button className={ 'ant-btn github' } icon='github'>{t('Connect with') + ' Github'}</Button>
                            </a>
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <a href='http://api.instagram.com/oauth/authorize/?client_id=1a28812669a8491aa7890cb28d24d6a2&redirect_uri=http://localhost:8080/oauth/instagram/&response_type=token'>
                                <Button className={ 'ant-btn instagram' } icon='instagram'>{t('Connect with') + ' Instagram'}</Button>
                            </a>
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <a href='https://api.intra.42.fr/oauth/authorize?client_id=bcbec73e930f075dcd1c7295fc647d93a27bda3b5a53333c068c40383e3b2f2f&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2F42%2F&response_type=code'>
                                <Button className={ 'ant-btn forty-two' } icon='api'>{ t('Connect with') + ' 42' }</Button>
                            </a>
                        </Form.Item>
                    </Form>
                    )}
            </I18n>
        )
    }
}

SigninForm.defaultProps = {
    data: {
        username: null,
        password: null
    },
    signin: {
        errors: [],
        isLoading: false,
        hasSucceeded: false,
        isAuthenticated: false
    }
}

SigninForm.propTypes = {
    form: PropTypes.any,
    data: PropTypes.shape({
        username: PropTypes.string,
        password: PropTypes.string,
    }),
    signin: PropTypes.shape({
        errors: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string,
            message: PropTypes.string,
            type: PropTypes.string
        })),
        isLoading: PropTypes.bool.isRequired,
        hasSucceeded: PropTypes.bool.isRequired,
        isAuthenticated: PropTypes.bool.isRequired
    }),
    sendRequest: PropTypes.func.isRequired,
    history: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    const signin = state.auth
    return { signin }
}

const mapDispatchToProps = dispatch => {
    return {
        sendRequest: formData => { dispatch(signinFormAction(formData)) }
    }
}

const WrappedSigninForm = Form.create()(SigninForm)
const ConnectedSigninForm = connect(mapStateToProps, mapDispatchToProps)(WrappedSigninForm)

export default ConnectedSigninForm