'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Form, Input, Button } from 'antd'

import { editUsernameAction } from '../../../../actions/index'

class UsernameForm extends Component {
    constructor(props) {
        super(props)
    }

    _handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.props.editUsername(values)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <I18n>
                { (t) => (
                    <Form className='edit-username-form' onSubmit={ this._handleSubmit }>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            {getFieldDecorator('username', {
                                rules: [ {
                                    required: true,
                                    message: t('Field Message'),
                                } ],
                            })(
                                <Input placeholder={ t('Username') } />
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

UsernameForm.propTypes = {
    editUsername: PropTypes.func,
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
        editUsername: values => { dispatch(editUsernameAction(values)) },
    }
}

const WrappedUsernameForm = Form.create()(UsernameForm)
const ConnectedUsernameForm = connect(mapStateToProps, mapDispatchToProps)(WrappedUsernameForm)

export default ConnectedUsernameForm