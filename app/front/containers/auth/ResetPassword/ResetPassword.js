'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { resetPasswordAction } from '../../../actions/index'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Input, Button, Form, message, Row, Col } from 'antd'

class ResetPassword extends Component {
    constructor (props) {
        super(props)
        this.state = {
            password: '',
            confirmation: '',
            passwordHandling: this.props
        }
    }

    componentWillReceiveProps(nextProps) {
        try {
            const token = localStorage.getItem('token')

            if (token) {
                this.props.history.push('/')
            }
            else {
                const { passwordHandling } = nextProps
                let notification = ''

                localStorage.language === 'fr' ? notification = 'Votre mot de passe a été mis à jour' : notification = 'Your password has been updated'

                if (this.state.passwordHandling !== passwordHandling) {
                    if (Array.isArray(passwordHandling.errors) && passwordHandling.errors.length) {
                        passwordHandling.errors.forEach((elem) => {
                            message.error(elem.message)
                        })
                    }
                    else if (passwordHandling.resetSuccess === true) {
                        message.success(notification)
                    }

                    this.setState({ passwordHandling })
                }
            }
        }
        catch (err) {
            console.log('Unable to get token in local storage')
        }
    }

    _checkPassword = (password, confirmation, t) => {
        let errors = []

        if (password === confirmation) {
			if (password && (password.length < 8 || !/\d/.test(password))) {
                errors.push(t('Register email error'))
            }
        }
        else {
            errors.push(t('Register email confirmation error'))
        }

        return errors
    }

    _handleSubmit = (e, t) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            const errorsFields = this._checkPassword(values.password, values.confirmation, t)
            const location = this.props.location.search

            if (location && location !== undefined) {
                const search = location.slice(4)
                const split = search.split('&')
                const id = split[0]
                const token = split[1].slice(6)

                if (errorsFields.length) {
                    errorsFields.forEach((elem) => {
                        message.error(elem)
                    })
                }

                if (!errors && !errorsFields.length) {
                    this.props.resetPassword({ password: values.password, id, token })
                }
            }
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <I18n>
                { (t) => (
                    <Row className={ 'anonymous' }>
                        <Col lg={ { offset: 8, span: 8 } } md={ { offset: 8, span: 8 } } xs={ { offset: 2, span: 20 } }>

                            <Form className='reset-password' onSubmit={ (e) => this._handleSubmit(e, t) }>
                                <h2>
                                    { t('Reset Password Title') }
                                </h2>
                                <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                    { getFieldDecorator('password', {
                                        rules: [ {
                                            message: t('Please enter your'+t('Password')),
                                            required: true
                                        } ],
                                    })(
                                        <Input placeholder={ t('Password') } type={ 'password' } />
                                    )}
                                </Form.Item>
                                <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                    { getFieldDecorator('confirmation', {
                                        rules: [ {
                                            message: t('Confirmation password message'),
                                            required: true
                                        } ],
                                    })(
                                        <Input placeholder={ t('Password confirmation') } type={ 'password' } />
                                    )}
                                </Form.Item>
                                <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                    <Button className='login-form-button large' htmlType='submit' type='primary'>
                                        { t('Confirm') }
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    ) }
            </I18n>
        )
    }
}

ResetPassword.propTypes = {
    resetPassword: PropTypes.func.isRequired,
    form: PropTypes.any,
    location: PropTypes.any,
    passwordHandling: PropTypes.object
}

const mapStateToProps = (state) => {
    const { passwordHandling } = state
    return {
        passwordHandling
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetPassword: formData => { dispatch(resetPasswordAction(formData)) }
    }
}

const WrappedResetPassword = Form.create()(ResetPassword)
const ConnectedResetPassword = connect(mapStateToProps, mapDispatchToProps)(WrappedResetPassword)

export default ConnectedResetPassword
