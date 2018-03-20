'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { message } from 'antd'

import EmailForm from './EmailForm/EmailForm'
import UsernameForm from './UsernameForm/UsernameForm'
import PasswordForm from './PasswordForm/PasswordForm'

import { Col, Row } from 'antd'

class EditAccount extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editAccountStatus: props.editAccountStatus
        }
    }

    componentWillReceiveProps(nextProps) {
        const { editAccountStatus } = nextProps
        let notification = ''

        localStorage.language === 'fr' ? notification = 'Votre compte a été mis à jour' : notification = 'Your profile has been updated'

        if (this.state.editAccountStatus !== editAccountStatus) {
            if (Array.isArray(editAccountStatus.errors) && editAccountStatus.errors.length) {
                editAccountStatus.errors.forEach((elem) => {
                    message.error(elem.message)
                })
            }
            else {
                message.success(notification)
            }

            this.setState({ editAccountStatus })
        }
    }

    render() {
        return (
            <Row className={ 'anonymous' }>
                <Col lg={ { offset: 8, span: 8 } } md={ { offset: 8, span: 8 } } xs={ { offset: 2, span: 20 } }>
                    <EmailForm />
                    <UsernameForm />
                    <PasswordForm />
                </Col>
            </Row>
        )
    }
}

EditAccount.propTypes = {
    editAccountStatus: PropTypes.shape({
        errors: PropTypes.array,
        hasSucceeded: PropTypes.bool,
    })
}

const mapStateToProps = (state) => {
    const editAccountStatus = state.editAccountStatus
    return {
        editAccountStatus
    }
}

export default connect(mapStateToProps)(EditAccount)