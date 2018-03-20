'use strict'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Button, Form, Icon, Input, message } from 'antd'

import { registrationFormAction } from '../../../../actions/index'

class RegisterForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            data: props.data
        }
    }

    _checkFields = (values, t) => {
        const password = values.password
        const confirmation = values.confirmation
        const username = values.username
        const firstName = values.firstName
        const lastName = values.lastName
        const photoURL = values.photoURL
        let errors = []


        if (password && confirmation) {
            if (password === confirmation) {
                if (password.length < 8 || password.length > 128 || !/\d/.test(password)) {
                    errors.push(t('Register email error'))
                }
            }
            else {
                errors.push(t('Register email confirmation error'))
            }
        }

        if (username && (username.length < 6 || username.length > 32)) {
            errors.push(t('Register username error'))
        }

        if (firstName && (firstName.length < 2 || firstName.length > 32)) {
            errors.push(t('Register firstname error'))
        }

        if (lastName && (lastName.length < 2 || lastName.length > 32)) {
            errors.push(t('Register lastname error'))
        }

        if (photoURL && photoURL.length > 256) {
            errors.push(t('Register photo url error'))
        }

        return errors
    }

    _handleSubmit = (e, t) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            const errorsFields = this._checkFields(values, t)

            if (errorsFields.length) {
                errorsFields.forEach((elem) => {
                    message.error(elem)
                })
            }
            if (!errors && !errorsFields.length) {
                this.props.sendRequest(values)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <I18n>
                { (t) => (
                    <Form className='register-form' onSubmit={ (e) => this._handleSubmit(e, t) }>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('photoURL', {
                                rules: [ {
                                    message: 'Hint: https://your-beautiful-photo.com/cute-human.jpg',
                                    required: true
                                } ],
                            })(
                                <Input placeholder='https://something.com/you.jpg' prefix={ <Icon type='camera-o'/> } type={ 'url' } />
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('email', {
                                rules: [ {
                                    message: t('Email Message'),
                                    required: true
                                } ],
                            })(
                                <Input placeholder='Hello@nerverland.tb' prefix={ <Icon type='mail'/> } type={ 'email' } />
                            )}
                        </Form.Item>
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
                            { getFieldDecorator('firstName', {
                                rules: [ {
                                    message: t('Firstname Message'),
                                    required: true
                                } ],
                            })(
                                <Input placeholder={ t('First name') } prefix={ <Icon type='idcard'/> } />
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('lastName', {
                                rules: [ {
                                    message: t('Lastname Message'),
                                    required: true
                                } ],
                            })(
                                <Input placeholder={ t('Last name') } prefix={ <Icon type='idcard'/> } />
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('password', {
                                rules: [ {
                                    message: t('Please enter your')+t('Password'),
                                    required: true
                                } ],
                            })(
                                <Input placeholder={ t('Password') } prefix={ <Icon type='lock'/> } type={ 'password' } />
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('confirmation', {
                                rules: [ {
                                    message: t('Confirmation password message'),
                                    required: true
                                } ],
                            })(
                                <Input placeholder={ t('Password confirmation') } prefix={ <Icon type='lock'/> } type={ 'password' } />
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <Link className='register-form-signin-link' to='/login'>{ t('Already have an account ?') }</Link>
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <Button className='login-form-button large' htmlType='submit' type='primary'>
                                { t('Confirm') }
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </I18n>
        )
    }
}

RegisterForm.defaultProps = {
    data: {
        confirmation: null,
        email: null,
        firstName: null,
        lastName: null,
        password: null,
        photoURL: 'https://cdn.intra.42.fr/users/medium_abanvill.jpg',
        username: null
    }
}

RegisterForm.propTypes = {
    data: PropTypes.shape({
        confirmation: PropTypes.string,
        email: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        password: PropTypes.string,
        photoURL: PropTypes.string,
        username: PropTypes.string
    }),
    form: PropTypes.any,
    sendRequest: PropTypes.func.isRequired
}


const mapDispatchToProps = dispatch => {
    return {
        sendRequest: formData => { dispatch(registrationFormAction(formData)) }
    }
}

const WrappedRegisterForm = Form.create()(RegisterForm)
const ConnectedRegisterForm = connect(() => ({}), mapDispatchToProps)(WrappedRegisterForm)

export default ConnectedRegisterForm