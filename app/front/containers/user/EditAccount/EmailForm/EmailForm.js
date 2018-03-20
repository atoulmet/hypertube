'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Form, Input, Button } from 'antd'

import { editEmailAction } from '../../../../actions/index'

class EmailForm extends Component {
    constructor(props) {
        super(props)
    }

    _handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.props.editEmail(values)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <I18n>
                { (t) => (
                    <Form className='edit-email-form' onSubmit={ this._handleSubmit }>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('email', {
                                rules: [ {
                                    message: t('Field Message'),
                                    required: true
                                } ],
                            })(
                                <Input placeholder={ t('Email') } type={ 'email' }/>
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

EmailForm.propTypes = {
    editEmail: PropTypes.func,
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
        editEmail: values => { dispatch(editEmailAction(values)) },
    }
}

const WrappedEmailForm = Form.create()(EmailForm)
const ConnectedEmailForm = connect(mapStateToProps, mapDispatchToProps)(WrappedEmailForm)

export default ConnectedEmailForm