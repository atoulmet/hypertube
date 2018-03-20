'use strict'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Button, Col, Row } from 'antd'

import { loadLayoutBackgroundAction } from '../../../actions/index'

class Landing extends Component {

    constructor (props) {
        super(props)
    }

    componentDidMount () {
        this.props.loadBackgroundImage('https://wallpapertag.com/wallpaper/full/c/5/3/137396-free-negan-wallpaper-1920x1080-photos.jpg')
    }

    render () {
        return (
            <Row className={ 'anonymous' }>
                <Col offset={ 8 } span={ 8 } >
                    <I18n>
                        { (t) => (
                            <div>
                                <Row align='middle' className='loggedoff-landing-page' justify='space-around' type='flex'>
                                    <h1>
                                        { '|H|' }
                                    </h1>
                                </Row>
                                <Row align='middle' className='loggedoff-landing-page' justify='space-around' type='flex'>
                                    <h3>
                                        { t('LandingText') }
                                    </h3>
                                </Row>
                                <Row align='middle' className='loggedoff-landing-page' justify='space-around' type='flex'>
                                    <Link to='/register'>
                                        <Button className='register-btn' ghost type='danger'>
                                            { t(`Register`) }
                                        </Button>
                                    </Link>
                                </Row>
                            </div>
                        ) }
                    </I18n>
                </Col>
            </Row>
        )
    }
}

Landing.defaultProps = {
}

Landing.propTypes = {
    loadBackgroundImage: PropTypes.func.isRequired
}

const mapStateToProps = () => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        loadBackgroundImage: url => { dispatch(loadLayoutBackgroundAction(url)) }
    }
}

const ConnectedLanding = connect(mapStateToProps, mapDispatchToProps)(Landing)

export default ConnectedLanding
