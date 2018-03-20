'use strict'

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutAction } from '../../../actions/index'
import { PropTypes } from 'prop-types'

class Logout extends Component {
    componentWillMount() {
        localStorage.clear()
        sessionStorage.clear()
        this.props.logout(this.props)
    }

    render() {
        return (
            <Redirect to='/' />
        )
    }
}

Logout.propTypes = {
    logout: PropTypes.any
}

const mapStateToProps = () => {
    return {  }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => { dispatch(logoutAction()) }
    }
}

const ConnectedLogout = connect(mapStateToProps , mapDispatchToProps)(Logout)
export default ConnectedLogout