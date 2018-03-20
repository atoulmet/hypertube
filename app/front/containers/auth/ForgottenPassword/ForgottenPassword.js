'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Button, Col, Form, Icon, Input, message, Row } from 'antd'

import './ForgottenPassword.scss'
import { forgottenPasswordAction, loadLayoutBackgroundAction } from '../../../actions/index'

class ForgottenPassword extends Component {
    constructor (props) {
        super(props)
        this.state = {
            data: props.data
        }
    }

    componentDidMount () {
        this.props.loadBackgroundImage('http://pm1.narvii.com/5902/25c1969d21dd2baaaaec95dba1e8ec510fe91c3f_hq.jpg')
    }

    componentWillReceiveProps(nextProps) {
        try {
            const token = localStorage.getItem('token')

            if (token) {
                this.props.history.push('/')
            }
        }
        catch (err) {
            console.log('Unable to get token in local storage')
        }
    }

    _handleSubmit = (e, t) => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                const notification = `${t(`Reinit password Notif`)}${values.email}`
                this.props.sendRequest(values)
                message.success(notification)
            }
        })
    }

    render () {
        const { getFieldDecorator } = this.props.form

        return (
            <Row className={ 'anonymous' }>
                <Col lg={ { offset: 8, span: 8 } } md={ { offset: 8, span: 8 } } xs={ { offset: 2, span: 20 } }>
                    <I18n>
                        { (t) => (
                            <div className='forgotten-page'>
                                <h2>
                                    { t('Forgot Password Title') }
                                </h2>
                                <p>
                                    { t('Forgot Password Text') }
                                </p>
                                <Form className='forgotten-form' onSubmit={ (e) => this._handleSubmit(e, t) }>
                                    <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                        { getFieldDecorator('email', {
                                            rules: [ {
                                                required: true,
                                                message: t('Forgot Password Message'),
                                            } ],
                                        })(
                                            <Input name='email' onChange={ this._onChange } placeholder='iwillnotforget@anymo.re' prefix={ <Icon type='mail'/> }  type={ 'email' }/>
                                        )}
                                    </Form.Item>
                                    <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                        <Button className='forgot-pwd-form-button large' htmlType='submit' type='primary'>{ t('Forgot Password Button') }</Button>
                                    </Form.Item>
                                </Form >
                            </div>
                            ) }
                    </I18n>
                </Col>
            </Row>
        )
    }
}

ForgottenPassword.defaultProps = {
    data: {
        email: null
    }
}

ForgottenPassword.propTypes = {
    data: PropTypes.shape({
        confirmation: PropTypes.string,
        email: PropTypes.string }),
    form: PropTypes.any,
    loadBackgroundImage: PropTypes.func.isRequired,
    sendRequest: PropTypes.func.isRequired
}

const mapStateToProps = () => {
    return {
        // success: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        sendRequest: data => { dispatch(forgottenPasswordAction(data)) },
        loadBackgroundImage: url => { dispatch(loadLayoutBackgroundAction(url)) }
    }
}

const WrappedForgottenPassword = Form.create()(ForgottenPassword)
const ConnectedForgottenPassword = connect(mapStateToProps, mapDispatchToProps)(WrappedForgottenPassword)

export default ConnectedForgottenPassword