'use strict'

import md5 from 'md5'
import moment from 'moment'

import * as ResponseService from '../services/ResponseService'
import * as TorrentService from '../services/TorrentService'
import * as omDBService from '../../../torrents/api/meta/omDB'
import * as subtitlesService from '../services/SubtitlesService'

import error from '../../templates/vars/error'
import Movies from '../models/MovieModel'
import Local from '../models/LocalModel'

/* Get a list of popular movies from our collection */
export const popularMovies = async (req, res) => {
    const page = req.params.page

    try {
        // get movie from popular collection 20 at a time
        const list = await Movies.find()
        const start = page * 20
        const range = list.slice(start, start + 20)

        if (!range) {
            return res.status(204).json(ResponseService.createResponse('search', null))
        }

        return res.status(200).json(ResponseService.createResponse('search', range))
    }
    catch(err) {
        error.message = err.message
        error.field = ''
        error.type = 'api'
        return res.status(204).json(ResponseService.createErrorResponse([ error ]))
    }
}

/* Get a list of result based on a query search */
export const searchMovies = async (req, res) => {
    const query = req.body.movie

    if (!query) {
        error.message = 'Invalid query'
        error.field = 'search-movies'
        error.type = 'api'
        return res.status(204).json(ResponseService.createErrorResponse([ error ]))
    }
    try {
        const result = await TorrentService.searchMovies(query)

        return res.status(200).json(ResponseService.createResponse('search', result))
    }
    catch (err) {
        error.message = 'Movie query search failure'
        error.field = 'search-movies'
        error.type = 'api'

        return res.status(204).json(ResponseService.createErrorResponse([ error ]))
    }
}

/* Get details about a specific title */
export const movieDetails = async (req, res) => {
    const movie = req.params.movie
    const dirName = req.params.hash

    try {
        const details = await omDBService.getMovieDetails(movie)
        const imdbID = details.imdbID
        const subtitles = await subtitlesService.getSubtitles(imdbID, movie, dirName)
        const m = await Local.findOne().byTitle(movie)
        let views = '0'

        if (m) {
            views = m.views
        }


        return res.status(200).json(ResponseService.createResponse('movie', { details: details, subtitles: subtitles, views: views }))
    }
    catch (err) {
        error.message = 'Get movie details failure'
        error.field = 'movie-details'
        error.type = 'api'
        return res.status(204).json(ResponseService.createErrorResponse([ error ]))
    }
}

/* Save movie played by user in Local Collection */
export const saveMovieLocally = (title, magnet, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            let movie = await Local.findOne().byTitle(title)

            if (!movie) {
                let localMovie = new Local

                localMovie.set('title', title)
                localMovie.set('magnet', magnet)
                localMovie.set('movieID', md5(magnet))
                localMovie.set('path', path)
                localMovie.set('lastPlay', moment().format('YYYY-MM-DD'))
                localMovie.set('views', 1)
                await localMovie.save()
            }
            else {
                let updatedViews = movie.views + 1

                movie.set('lastPlay', moment().format('YYYY-MM-DD'))
                movie.set('views', updatedViews)
                await movie.save()
            }

            return resolve()
        }
        catch (err) {
            return reject(err)
        }
    })
}