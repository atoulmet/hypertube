'use strict'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import InfiniteScroll from 'react-infinite-scroller'
import _ from 'lodash'
import { BackTop, Col, Row } from 'antd'

import { getMoviesAction } from '../../../actions/Movies/listMovies'
import { resetMoviesAction } from '../../../actions/Movies/listMovies'
import { getUserProfileAction } from '../../../actions/index'
import FilterBar from '../../../components/FilterBar/FilterBar'

class Landing extends Component {

    constructor (props) {
        super(props)

        this.state = {
            movies: [],
            filtered: [],
            scroll: true,
            viewedMovies: props.viewedMovies
        }
    }

    componentWillUnmount() {
        this.props.resetMoviesStore()
    }

    componentWillMount() {
        this.props.getUserProfile(localStorage.username)
    }

    _triggerMovieList = (page) => {
        this.props.getMovieList(page)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ scroll: false })
        const { movieList, viewedMovies } = nextProps
        let previousArray = this.state.movies

        if (movieList.length > 0 ) {
            if (previousArray.length > 0 && previousArray[0].title === movieList[0].title) {
                previousArray = []
            }

            const newArray = previousArray.concat(movieList)
            const filtered = _.cloneDeep(newArray)

            this.setState( { movies: newArray, filtered, scroll: true, viewedMovies })
        }
    }

    _applyFilter = (filtered) => {
        this.setState( { filtered: filtered, scroll: false } )
    }

    _mapJSX = (movies) => {
        const { viewedMovies } = this.state
        let viewedCorner = null

        return movies.map((element, index) => {
            viewedCorner = null
            let style = {
                backgroundImage:`url('${ element.poster } ')`
            }

            if (viewedMovies.indexOf(element.title) >= 0) {
                style = {
                    backgroundImage:`url('${ element.poster } ')`,
                    filter: 'brightness(0.60)',
                }
                viewedCorner = <div className='viewed-corner'></div>
            }

            return (
                <Link key={ `Movie.Link.${ element.title }.${ index }` } onClick={ () => { sessionStorage.setItem('magnet', element.magnet) } } to={ `/movies/${ element.title }` }>
                    <Col key={ `Movie.Col.${ element.title }.${ index }` } className='movie-thumbnail' span= { 6 } style={ style }>
                        { viewedCorner }
                        <div className={ 'movie-infos' }>
                            <span key={ `Movie.Title.${ element.title }.${ index }` } className={ 'movie-title' }>
                                { element.title }
                            </span>
                            <span key={ `Movie.Year.${ element.title }.${ index }` } className={ 'movie-year' }>
                                { element.year }
                            </span>
                            <span key={ `Movie.Rating.${ element.title }.${ index }` } className={ 'movie-rating' }>
                                <img className='logo-img' src='https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg' />
                                { element.rating }
                            </span>
                        </div>
                    </Col>
                </Link>
            )
        })
    }

    render () {
        const { movies, scroll } = this.state

        if (this.state.filtered)
        {
            const filtered = this.state.filtered
            const mappedMovies = this._mapJSX(filtered)
            return (
                <div>
                    <BackTop />
                    <FilterBar _applyFilter={ this._applyFilter } movieList= { movies }/>
                    <InfiniteScroll
                        hasMore={ scroll }
                        loadMore={ this._triggerMovieList }
                        pageStart= { -1 }
                    >
                        <Row justify='center' type='flex'>
                            { mappedMovies }
                        </Row>
                    </InfiniteScroll>
                </div>
            )
        }
        else {
            return ( <div>No movie available</div> )
        }
    }
}

Landing.defaultProps = {
    movieList: []
}

Landing.propTypes = {
    getMovieList: PropTypes.func.isRequired,
    movieList: PropTypes.array,
    getUserProfile: PropTypes.func.isRequired,
    viewedMovies: PropTypes.array,
    resetMoviesStore: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    return {
        movieList: state.movies.list,
        viewedMovies: state.userProfile.movies
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getMovieList: page => { dispatch(getMoviesAction(page)) },
        getUserProfile: username => { dispatch(getUserProfileAction(username)) },
        resetMoviesStore: () => { dispatch(resetMoviesAction()) }
    }
}

const ConnectedLanding = connect(mapStateToProps, mapDispatchToProps)(Landing)

export default ConnectedLanding