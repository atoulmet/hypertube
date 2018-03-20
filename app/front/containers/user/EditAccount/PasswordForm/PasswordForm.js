'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Button, Form, Input, message } from 'antd'

import { editPasswordAction } from '../../../../actions/index'

class PasswordForm extends Component {
    constructor(props) {
        super(props)
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

        let notification
        localStorage.language === 'fr' ? notification = 'Les deux mot de passe ne sont pas identiques' : notification = 'Different passwords'

        this.props.form.validateFields((errors, values) => {
           const errorsFields = this._checkPassword(values.password, values.confirmation, t)

            if (errorsFields.length) {
	        	errorsFields.forEach((elem) => {
					message.error(elem)
		   		})
		    }

		    if (!errors && !errorsFields.length) {
				this.props.editPassword(values)
			}
        })
    }

    render () {
        const { getFieldDecorator } = this.props.form

        return (
            <I18n>
                { (t) => (
                    <Form className='edit-password-form' onSubmit={ (e) => this._handleSubmit(e, t) }>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } } >
                            {getFieldDecorator('password', {
                                rules: [ {
                                    required: true,
                                    message: t('Field Message'),
                                } ],
                            })(
                                <Input placeholder={ t('Password') } type='password'/>
                                )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } } >
                            {getFieldDecorator('confirmation', {
                                rules: [ {
                                    required: true,
                                    message: t('Field Message'),
                                } ],
                            })(
                                <Input placeholder= { t('Password confirmation') } type='password'/>
                                )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <Button className='login-form-button large' htmlType='submit' type='primary'>{ t('Confirm') }</Button>
                        </Form.Item>
                    </Form>
                     ) }
            </I18n>
        )
    }
}

PasswordForm.propTypes = {
    editPassword: PropTypes.func,
    form: PropTypes.any,
    editAccountStatus: PropTypes.shape({
        errors: PropTypes.array,
        hasSucceeded: PropTypes.bool,
    })
}

const mapStateToProps = (state) => {
    return {
        state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        editPassword: values => { dispatch(editPasswordAction(values)) },
    }
}

const WrappedPasswordForm = Form.create()(PasswordForm)
const ConnectedPasswordForm = connect(mapStateToProps, mapDispatchToProps)(WrappedPasswordForm)

export default ConnectedPasswordForm
