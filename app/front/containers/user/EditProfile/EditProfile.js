'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Button, Col, Form, Input, message, Row } from 'antd'

import { getUserProfileAction } from '../../../actions/index'
import { editProfileAction } from '../../../actions/index'


class EditProfile extends Component {
    constructor (props) {
        super(props)

        this.state = {
            userProfile: props.userProfile,
            editProfileStatus: props.editProfileStatus
        }
    }

    componentWillMount() {
        this.props.getUserProfile(localStorage.getItem('username'))
    }

    componentWillReceiveProps(nextProps) {
        const { userProfile, editProfileStatus } = nextProps
        let notification = ''

        localStorage.language === 'fr' ? notification = 'Votre profil a été mis à jour' : notification = 'Your profile has been updated'

        if (this.state.userProfile !== userProfile) {
            this.setState({ userProfile })
        }

        if (this.state.editProfileStatus !== editProfileStatus) {
            if (Array.isArray(editProfileStatus.errors) && editProfileStatus.errors.length) {
                editProfileStatus.errors.forEach((elem) => {
                    message.error(elem.message)
                })
            }
            else
                message.success(notification)

            this.setState({ editProfileStatus })
        }
    }

    _checkFields = (values, t) => {
        const firstName = values.firstName
        const lastName = values.lastName
        let errors = []

        if (firstName && firstName.length < 2) {
            errors.push(t('Edit user firstname error'))
        }

        if (lastName && lastName.length < 2) {
            errors.push(t('Edit user lastname error'))
        }

        return errors
    }

    _handleSubmit = (e, t) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            const errorsFields = this._checkFields(values, t)

            if (errorsFields !== null) {
                errorsFields.forEach((elem) => {
                    message.error(elem)
                })
            }

            if (!errors && !errorsFields.length && (values.firstName || values.lastName || values.photoURL)) {
                this.props.editProfile(values)
            }
        })
    }

    render() {
        const { firstName, lastName, photoURL } = this.state.userProfile
        const { getFieldDecorator } = this.props.form

        return (
            <Row className={ 'anonymous' }>
                <Col lg={ { offset: 8, span: 8 } } md={ { offset: 8, span: 8 } } xs={ { offset: 2, span: 20 } }>
                    <I18n>
                        { (t) => (
                            <Form className='edit-profile-form' onSubmit={ (e) => this._handleSubmit(e, t) }>
                                <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                    { getFieldDecorator('firstName', {
                                        initialValue: null,
                                        rules: [ {
                                            required: false,
                                            message: 'Please fill this field !',
                                        } ],
                                    })(
                                        <Input placeholder={ `${firstName}` } />
                                    )}
                                </Form.Item>
                                <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                    { getFieldDecorator('lastName', {
                                        initialValue: null,
                                        rules: [ {
                                            required: false,
                                            message: 'Please fill this field !',
                                        } ],
                                    })(
                                        <Input placeholder={ `${lastName}` } type='text'/>
                                    )}
                                </Form.Item>
                                <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                    { getFieldDecorator('photoURL', {
                                        initialValue: null,
                                        rules: [ {
                                            required: false,
                                            message: 'Please fill this field !',
                                        } ],
                                    })(
                                        <Input placeholder={ `${photoURL}` }  type='url' />
                                    )}
                                </Form.Item>
                                <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                                    <Button className='login-form-button large' htmlType='submit' type='primary'>{t('Confirm')}</Button>
                                </Form.Item>
                            </Form>
                        )}
                    </I18n>
                </Col>
            </Row>
        )
    }
}

EditProfile.defaultProps = {
    userProfile: PropTypes.object
}

EditProfile.propTypes = {
    editProfile: PropTypes.func,
    getUserProfile: PropTypes.func,
    form: PropTypes.any,
    userProfile: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
    }),
    editProfileStatus: PropTypes.shape({
        errors: PropTypes.array,
        hasSucceeded: PropTypes.bool,
    })
}

const mapStateToProps = (state) => {
    const userProfile = state.userProfile
    const editProfileStatus = state.editProfileStatus
    return { userProfile, editProfileStatus }
}

const mapDispatchToProps = dispatch => {
    return {
        editProfile: values => { dispatch(editProfileAction(values)) },
        getUserProfile: username => { dispatch(getUserProfileAction(username)) }
    }
}

const WrappedEditProfile = Form.create()(EditProfile)
const ConnectedEditProfile = connect(mapStateToProps, mapDispatchToProps)(WrappedEditProfile)

export default ConnectedEditProfile