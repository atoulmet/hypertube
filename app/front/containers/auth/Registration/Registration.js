'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Col, message, Row } from 'antd'

import './Registration.scss'
import { loadLayoutBackgroundAction } from '../../../actions/index'
import RegisterForm from './RegisterForm/RegisterForm'

class Registration extends Component {

    state = {
        isRegistering: false
    }

    componentDidMount () {
        this.props.loadBackgroundImage('http://bgfons.com/uploads/pattern/pattern_texture1197.jpg')
    }

    componentWillReceiveProps(nextProps) {
        try {
            const token = localStorage.getItem('token')

            if (token) {
                this.props.history.push('/')
            }
            else {
                const { registration } = nextProps
                const { isLoading, hasSucceeded, errors } = registration
                const { isRegistering } = this.state

                if (isLoading) {
                    message.loading('Registering your account, please wait...')
                    this.setState({ isRegistering: true })
                }
                else if (isRegistering && hasSucceeded === false && errors.length) {
                    message.destroy()
                    registration.errors.forEach((elem) => {
                        message.error(elem.message)
                    })
                    this.setState({ isRegistering: false })
                }
                else if (isRegistering && hasSucceeded) {
                    this.props.history.push('/login')
                    message.destroy()
                    message.success('Registration successfull')
                    this.setState({ isRegistering: false })
                }                
            }
        }
        catch (err) {
            console.log('Unable to get token in local storage')
        }
    }

    render() {
        return (
            <Row className={ 'anonymous' }>
                <Col lg={ { offset: 8, span: 8 } } md={ { offset: 8, span: 8 } } xs={ { offset: 2, span: 20 } }>
                    <I18n>
                        { (t) => (
                            <div className='register-page'>
                                <h2 offset={ 8 } span={ 8 }>
                                    { t('Register') }
                                </h2>
                                <RegisterForm />
                            </div>
                        )}
                    </I18n>
                </Col>
            </Row>
        )
    }
}

Registration.defaultProps = {
    registration: {
        errors: [],
        isLoading: false,
        hasSucceeded: false
    }
}

Registration.propTypes = {
    history: PropTypes.object.isRequired,
    loadBackgroundImage: PropTypes.func.isRequired,
    registration: PropTypes.shape({
        errors: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string,
            message: PropTypes.string,
            type: PropTypes.string
        })),
        isLoading: PropTypes.bool.isRequired,
        hasSucceeded: PropTypes.bool.isRequired
    })
}

const mapStateToProps = (state) => {
    const registration = state.auth
    return { registration }
}

const mapDispatchToProps = dispatch => {
    return {
        loadBackgroundImage: url => { dispatch(loadLayoutBackgroundAction(url)) }
    }
}

const ConnectedRegistration = connect(mapStateToProps, mapDispatchToProps)(Registration)

export default ConnectedRegistration