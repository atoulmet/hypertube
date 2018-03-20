'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Col, Row } from 'antd'

import { loadLayoutBackgroundAction } from '../../../actions/index'
import SigninForm from './SigninForm/SigninForm'
import './Signin.scss'

class Signin extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount () {
        this.props.loadBackgroundImage('http://bgfons.com/uploads/pattern/pattern_texture1197.jpg')
    }

    componentWillReceiveProps(nextProps) {
        const { signin } = nextProps
        const { isAuthenticated } = signin

        try {
            const token = localStorage.getItem('token')

            if (token) {
                this.props.history.push('/')
            }
        }
        catch(err) {
            console.log('Unable to get token in local storage')
        }
    }

    render() {

        return (
            <Row className={ 'anonymous' }>
                <Col lg={ { offset: 8, span: 8 } } md={ { offset: 8, span: 8 } } xs={ { offset: 2, span: 20 } }>
                    <I18n>
                        { (t) => (
                            <div className='Signin-page'>
                                <h2>
                                    { t('Login') }
                                </h2>
                                <SigninForm { ...this.props } />
                            </div>
                        )}
                    </I18n>
                </Col>
            </Row>
        )
    }
}

Signin.propTypes = {
    history: PropTypes.any.isRequired,
    loadBackgroundImage: PropTypes.func.isRequired,
    signin: PropTypes.shape({
        errors: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string,
            message: PropTypes.string,
            type: PropTypes.string
        })),
        isLoading: PropTypes.bool.isRequired,
        hasSucceeded: PropTypes.bool.isRequired,
        isAuthenticated: PropTypes.bool.isRequired
    })
}

const mapStateToProps = (state) => {
    const signin = state.auth
    return { signin }
}

const mapDispatchToProps = dispatch => {
    return {
        loadBackgroundImage: url => { dispatch(loadLayoutBackgroundAction(url)) }
    }
}

const ConnectedSignin = connect(mapStateToProps, mapDispatchToProps)(Signin)

export default ConnectedSignin
