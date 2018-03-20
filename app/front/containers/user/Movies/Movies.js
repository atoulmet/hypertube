'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import { PropTypes } from 'prop-types'
import ReactPlayer from 'react-player'
import base64 from 'base-64'
import md5 from 'md5'
import { Col, Icon, Row } from 'antd'
import { Spin } from 'antd'

import CommentBox from './Comments/Comments'
import { movieInfosAction } from '../../../actions/Movies/movieInfos'
import { playAction } from '../../../actions/Movies/playMovie'

class Movie extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isPlaying: false,
            movie: props.movie,
            magnet: props.magnet,
            play: props.play,
            isLoading: props.isLoading,
            noMagnet: false
        }
    }

    componentWillMount() {
        const title = this.props.match.params.title
        const magnet = sessionStorage.getItem('magnet')

        if (magnet && magnet !== undefined) {
            const hash = md5(magnet)

            this.props.getMovieDetails(title, hash)
        }
        else {
            this.setState({ noMagnet: true })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { movie, isLoading } = nextProps

        this.setState({ movie, isLoading })
    }

    _renderMovieDetails(details, views) {
        return (
            <I18n>
                { (t) => (
                    <Col className='movie-details' span={ 24 }>
                        <Row className='movie-base-details-wrapper' span={ 24 }>
                            <Col span={ 12 }>
                                <div className='movie-title'>
                                    { `${ details.Title } (${ details.Year })` }
                                </div>
                            </Col>
                            <Col span={ 12 }>
                                <div className='movie-duration'>
                                    { details.Runtime }
                                </div>
                            </Col>
                        </Row>
                        <Row className='movie-views-wrapper' span={ 24 }>
                            <Col className='movie-views' span={ 24 }>
                                <Icon type='eye-o' /> { views }
                            </Col>
                        </Row>
                        <Row className='movie-details-wrapper' span={ 24 }>
                            <div className='movie-synopsis'>
                                <span className='movie-label'>{ t('Synopsis') + ' : ' }</span> { details.Plot }
                            </div>
                            <div className='movie-casting'>
                                <span className='movie-label'>{ t('Casting') + ' : ' }</span> { details.Actors }
                            </div>
                            <div className='movie-genre'>
                                <span className='movie-label'>{ t('Genres') + ' : ' }</span> { details.Genre }
                            </div>
                        </Row>
                    </Col>
                )}
            </I18n>
        )
    }

    _setMagnet(details) {
        const omdbTitle = details.Title
        const urlTitle = this.props.match.params.title
        const magnet = sessionStorage.getItem('magnet')
        const encoded = base64.encode(magnet)

        this.setState({
            magnet: encoded,
            play: true
        })

        const data = {
            title: '',
            magnet: ''
        }

        if (omdbTitle !== undefined) {
            data.title = omdbTitle
            data.magnet = magnet
        }
        else {
            data.title = urlTitle
            data.magnet = magnet
        }

        if (data.title !== undefined && data.magnet !== undefined) {
            this.props.playMovie(data)
        }
    }

    render() {

        if (this.state.play) {
            const { details, views, subtitles } = this.state.movie
            const tracks = []

            Object.keys(subtitles).forEach((key) => {
                if (subtitles[key]) {
                    tracks.push({
                        kind: 'subtitles',
                        src: `http://localhost:3000/${subtitles[key]}`,
                        srcLang: key.toUpperCase()
                    })
                }
            })

            return (
                <Col className='movie-page' md={ { offset: 4, span: 16 } } xs={ { offset: 1, span: 22 } }>
                    <div className='movie-placeholder'>
                        <ReactPlayer
                            className='movie-video'
                            config={ {
                                file: {
                                    attributes: {
                                        crossOrigin: 'anonymous'
                                    },
                                    tracks: tracks
                                },
                                showSpinner: true
                            } }
                            controls
                            onPlay={ () => { this.setState({ isPlaying: true }) } }
                            playing
                            url={ `http://localhost:3000/api/stream/${this.state.magnet}&${this.props.match.params.title}` }
                            width={ '100%' }
                        />
                        { this.state.isPlaying === false && <Icon className={ 'video-loading-icon' } type='loading' /> }
                    </div>
                    { this._renderMovieDetails(details, views) }
                    <CommentBox movie={ this.props.match.params.title }/>
                </Col>
            )
        }
        else {
            if (this.state.noMagnet === true ||
                (this.state.movie.details != undefined
                    && this.state.movie.details
                    && this.state.movie.details.Response === 'False')) {
                return (
                    <I18n>
                        {(t) => (
                            <div>
                                <Row className='no-movie-available' justify='center' type='flex'>
                                    {t('Movie infos error')}
                                </Row>
                            </div>)
                        }
                    </I18n>
                )
            }
            if (this.state.movie.details != undefined && this.state.movie.details) {
                const { details, views } = this.state.movie

                return (
                    <Col className='movie-page' md={ { offset: 4, span: 16 } } xs={ { offset: 1, span: 22 } }>
                        <div className='movie-placeholder' onClick={ () => { this._setMagnet(details) } }>
                            <div className='movie-placeholder-btn' />
                        </div>
                        <Row>
                            { this._renderMovieDetails(details, views) }
                        </Row>
                        <CommentBox movie={ this.props.match.params.title }/>
                    </Col>
                )
            }
            else {
                return (
                    <Row>
                        <Col align={ 'center' } className='spin-col'>
                            <Spin size='large' />
                        </Col>
                    </Row>
                )
            }
        }
    }
}

Movie.defaultProps = {
    movie: {},
    magnet: '',
    play: false
}

Movie.propTypes = {
    getMovieDetails: PropTypes.func.isRequired,
    playMovie: PropTypes.func.isRequired,
    movie: PropTypes.object,
    match: PropTypes.object,
    magnet: PropTypes.string,
    isLoading: PropTypes.bool,
    play: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
    return {
        movie: state.movies.movie,
        isLoading: state.movies.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getMovieDetails: (title, hash) => { dispatch(movieInfosAction(title, hash)) },
        playMovie: data => { dispatch(playAction(data)) }
    }
}

const ConnectedMovie = connect(mapStateToProps, mapDispatchToProps)(Movie)

export default ConnectedMovie