'use strict'

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Affix, Col, Input, Layout, Row } from 'antd'

import { getUserProfileAction } from '../../actions/index'
import { searchMoviesAction } from '../../actions/Movies/searchMovies'
import { HeaderDropdown } from './HeaderDropdown'

const Search = Input.Search

class Header extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isAuthenticated: props.isAuthenticated,
            redirect: false
        }
    }

    componentWillReceiveProps(nextProps) {
        const { isAuthenticated } = nextProps

        try {
            const token = localStorage.getItem('token')

            if (isAuthenticated && !token) {
                this.setState({ isAuthenticated: false })
            }
            else if (!isAuthenticated && token) {
                this.setState({ isAuthenticated: true })
            }
            else {
                this.setState({ isAuthenticated })
            }
        }
        catch(err) {
            console.log('Unable to get token in local storage')            
        }
    }

    _search = (value) => {
        const history = this.props.history

        if (/\S/.test(value)) {
            const trimmed = value.trim()
            const validFormat = trimmed.toLowerCase()

            this.props.searchMovies(validFormat, history)
        }
    }

    render() {

        const { isAuthenticated } = this.state

        if (isAuthenticated === true) {
            return (
                <I18n>
                    { (t) => (
                        <Affix>
                            <Layout.Header>
                                <Row>
                                    <Col span={ 4 }>
                                        < Link to='/'>
                                            <img className={ 'logotype' } src={ '/public/Logotype.svg' } />
                                        </Link>
                                    </Col>
                                    <Col span={ 14 }>
                                        <Search
                                            onSearch={ value => this._search(value) }
                                            placeholder={ t('Header Search') }
                                        />
                                    </Col>
                                    <Col className={ 'header-dropdown-wrapper' } span={ 6 }>
                                        <HeaderDropdown />
                                    </Col>
                                </Row>
                            </Layout.Header>
                        </Affix>
                        )}
                </I18n>
            )
        }
        else {
            return (
                <I18n>
                    { (t) => (
                        <Layout.Header>
                            <Row>
                                <Col span={ 20 }>
                                    < Link to='/'>
                                        <img className={ 'logotype' } src={ '/public/Logotype.svg' } />
                                    </Link>
                                </Col>
                                <Col className={ 'header-link-wrapper' } span={ 4 }>
                                    <Link to='/login'>
                                        { t('Sign-in') }
                                    </Link>
                                </Col>
                            </Row>
                        </Layout.Header>
                    )}
                </I18n>
            )
        }
    }
}

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    username: PropTypes.string,
    getUserProfile: PropTypes.func,
    searchMovies: PropTypes.func,
    history: PropTypes.object
}

const mapStateToProps = (state) => {
    const { isAuthenticated } = state.auth
    return { isAuthenticated }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserProfile: username => { dispatch(getUserProfileAction(username)) },
        searchMovies: (title, history) => { dispatch(searchMoviesAction(title, history)) }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))