'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserProfileAction } from '../../../actions/index'
import { PropTypes } from 'prop-types'

import { Row, Col } from 'antd'

class Profile extends Component {
    constructor (props) {
        super(props)
        const { userProfile } = this.props
        this.state = {
            userProfile,
        }
    }

    componentWillMount() {
        let username = this.props.match.params.user
        this.props.getUserProfile(username)
    }

    componentWillReceiveProps(nextProps) {
        const { userProfile } = nextProps
        if (this.state.userProfile !== userProfile) {
            this.setState({ userProfile })
        }
    }

    render() {
        const { firstName, photoURL } = this.state.userProfile
        let lastName
        this.state.userProfile.lastName === 'none' ? lastName = null : lastName = this.state.userProfile.lastName
        const styleDiv = {
            backgroundImage: `url('${ photoURL }')`,
        }

        return (
            <Col className='profile-page' justify='center' type='flex'>
                <Row className='profile-picture-container' span= { 24 }>
                    <div className='user-profile-picture' style={ styleDiv }>
                    </div>
                </Row>
                <Row className='user-names' justify='center' type='flex'>
                    <div className='user-details' >
                        { firstName } { lastName }
                    </div>
                </Row>
            </Col>
        )
    }
}

Profile.propTypes = {
    getUserProfile: PropTypes.func,
    match: PropTypes.object,
    userProfile: PropTypes.shape({
    })
}

const mapStateToProps = (state) => {
    const userProfile = state.userProfile
    return { userProfile }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserProfile: username => { dispatch(getUserProfileAction(username)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)