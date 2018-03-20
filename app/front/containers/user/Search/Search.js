'use strict'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Row, Col, Spin } from 'antd'

import { getUserProfileAction } from '../../../actions/index'
import FilterBar from '../../../components/FilterBar/FilterBar'

class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {
            movies: props.movieList,
            filtered: props.movieList,
            isLoading: props.isLoading,
            hasSucceeded: props.hasSucceeded,
            viewedMovies: props.viewedMovies
        }
    }

    componentWillMount() {
        this.props.getUserProfile(localStorage.username)
    }

    componentWillReceiveProps(nextProps) {
        const { movieList, isLoading, hasSucceeded, viewedMovies } = nextProps
        this.setState( { movies: movieList, filtered: movieList, isLoading, hasSucceeded, viewedMovies })
    }

    _applyFilter = (filtered) => {
        this.setState( { filtered: filtered } )
    }

    _mapJSX = (movies) => {
        const { viewedMovies } = this.state
        let viewedCorner = null

        return movies.map((element, index) => {
            viewedCorner = null
            let style = {
                backgroundImage:`url('${ element.poster } ')`
            }

            if (viewedMovies.indexOf(element.title.toLowerCase()) >= 0) {
                style = {
                    backgroundImage:`url('${ element.poster } ')`,
                    filter: 'brightness(0.60)'
                }

                viewedCorner = <div className='viewed-corner'></div>
            }
            return (
                <Link key={ `Movie.Link.${ element.title }.${ index }` } onClick={ () => { sessionStorage.setItem('magnet', element.magnet) } } to={ `/movies/${ element.title }` }>
                    <Col key={ `Movie.Col.${ element.title }.${ index }` } className='movie-thumbnail' span= { 6 } style= { style } >
                        { viewedCorner }
                        <div className={ 'movie-infos' }>
                            <span key={ `Movie.Title.${ element.title }.${ index }` } className={ 'movie-title' }>
                                { element.title }
                            </span>
                            <span key={ `Movie.Year.${ element.title }.${ index }` } className={ 'movie-title' }>
                                { element.year }
                            </span>
                            <span key={ `Movie.Rating.${element.title}.${index}` } className={ 'movie-rating' }>
                                <img className='logo-img' src='https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg' />
                                {element.rating}
                            </span>
                        </div>
                    </Col>
                </Link>
            )
        })
    }

    _mapEmpty = () => {
        let jsxArray = [ 0, 0, 0, 0, 0 ]
        return jsxArray.map((elem, index) => {
            return (
                <Col key={ `isLoading.${index}` } className='movie-thumbnail'>
                    <Spin className='search-spin' size='large'/>
                </Col>
            )
        })
    }

    render() {
        const { movies, isLoading, hasSucceeded } = this.state
        const loading = this._mapEmpty()

        if (this.state.filtered.length !== 0) {
            const filtered = this.state.filtered
            const mappedMovies = this._mapJSX(filtered)

            return (
                <div>
                    <FilterBar _applyFilter={ this._applyFilter } movieList= { movies }/>
                    <Row justify='center' type='flex' > { mappedMovies } </Row>
                </div>
            )
        }
        else if (isLoading === true) {
            return (
                <Row justify='center' type='flex' >
                    {loading}
                </Row>)
        }
        else if (hasSucceeded === true) {
            return (
                <I18n>
                    { (t) => (
                        <div>
                            <FilterBar _applyFilter={ this._applyFilter } movieList= { movies }/>
                            <Row className='no-movie-available' justify='center' type='flex'>
                                {t('Search Movie List')}
                            </Row>
                        </div>)
                    }
                </I18n>)
        }
        else {
            return (
                <div></div>
            )
        }
    }
}

Search.defaultProps = {
    movieList: []
}

Search.propTypes = {
    movieList: PropTypes.array,
    isLoading: PropTypes.bool,
    hasSucceeded: PropTypes.bool,
    viewedMovies: PropTypes.array,
    getUserProfile: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        movieList: state.movies.searchList,
        isLoading: state.movies.isLoading,
        hasSucceeded: state.movies.hasSucceeded,
        viewedMovies: state.userProfile.movies
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUserProfile: username => { dispatch(getUserProfileAction(username)) }
    }
}

const ConnectedSearch = connect(mapStateToProps, mapDispatchToProps)(Search)

export default ConnectedSearch