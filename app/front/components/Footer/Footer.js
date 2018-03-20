'use strict'

import React, { Component } from 'react'
import { Col, Layout, Row, Switch } from 'antd'
import { I18n } from 'react-i18next'

import i18n from '../../tools/i18n'

class Footer extends Component {

    constructor(props) {
        super(props)

        this.state = {
            checked: false
        }
    }
    componentWillMount() {
        if (localStorage.language === 'fr') {
            i18n.changeLanguage('fr')

            this.setState({ checked: true })
        }
        else {
            i18n.changeLanguage('en')

            this.setState({ checked: false })
        }
    }

    _onChange = () => {
        if (this.state.checked === false) {
            localStorage.language = 'fr'
            i18n.changeLanguage('fr')

            this.setState({ checked: true })
        }
        else {
            i18n.changeLanguage('en')
            localStorage.language = 'en'

            this.setState({ checked: false })
        }
    }

    render() {
        const { checked } = this.state
        return (
            <I18n>
                { () => (
                    <Layout.Footer>
                        <Row>
                            <Col span={ 8 }>
                                EN <Switch defaultChecked={ checked } onChange={ this._onChange } size='small' /> FR
                            </Col>
                            <Col span={ 10 }>
                            </Col>
                            <Col className={ 'header-dropdown-wrapper' } span={ 6 }>
                            </Col>
                        </Row>
                    </Layout.Footer>
                    )}
            </I18n>
        )
    }
}
export default Footer