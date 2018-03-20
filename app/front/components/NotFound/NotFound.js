'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Row, Col } from 'antd'

import { loadLayoutBackgroundAction } from '../../actions/index'

class UnvalidRoute extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount () {
        this.props.loadBackgroundImage('https://pbs.twimg.com/media/DCijqy-WsAIp3te.jpg')
    }

    render() {
        return (
            <I18n>
                { (t) => (
                    <Row>
                        <Col align={ 'middle' } className='not-found-box'>
                            <h2>404 {t('Not Found Title')}</h2>
                            <p>{t('Not Found Text')}</p>
                        </Col>
                    </Row>
                )}
            </I18n>
        )
    }
}

UnvalidRoute.propTypes = {
    loadBackgroundImage: PropTypes.func
}

const mapStateToProps = () => {
    return {
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadBackgroundImage: url => { dispatch(loadLayoutBackgroundAction(url)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnvalidRoute)