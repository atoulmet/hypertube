'use strict'

import nameParser from 'torrent-name-parser'
import _ from 'lodash'
import moment from 'moment'

import * as yifyService from '../../../torrents/api/trackers/yify'
import * as omDBService from '../../../torrents/api/meta/omDB'
import * as TPBScraper from '../../../torrents/scrapers/trackers/ThePirateBay/index'

import Movies from '../models/MovieModel'
import Locals from '../models/LocalModel'

function compareMovies (a, b) {

    if (a.title.indexOf(b.title) && (a.rating === b.rating && a.year === b.year))
        return true
    else if (b.title.indexOf(b.title) && (a.rating === b.rating && a.year === b.year))
        return true
    else if (a.rating === b.rating && a.title === b.title)
        return true
    else if (a.year === b.year && a.title === b.title)
        return true
    return false
}

const saveMovies = async (list) => {

    try {
        await Movies.remove({})

        for (let i in list) {
            let movie = new Movies

            movie.set('title', list[i].title)
            movie.set('year', list[i].year)
            movie.set('rating', list[i].rating)
            movie.set('poster', list[i].coverURL)
            movie.set('genres', list[i].genres)
            movie.set('magnet', list[i].magnet)
            await movie.save()
        }
    }
    catch(err) {
        console.log('Cron job - Error - updating elements from movies collection: ', err)
    }
}

export const getPopularMovies = async() => {

    try {
        console.log('searching popular movies...')
        const yifyMovies = await yifyService.getMovies()
        const pirateMoviesRaw = await TPBScraper.scrapMostPopulars({ keywords: [], resolution: null })
        let pirateMovies = []

        for (let i in pirateMoviesRaw) {
            try {
                const element = nameParser(pirateMoviesRaw[i].title)
                const details = await omDBService.getMovieDetails(element.title)
                let genres = []
                let title = '----'
                let year = '----'
                let rating = '----'
                let magnet = ''

                if (details.Genre) {
                    genres = details.Genre.replace(/\s/g, '').split(',')
                }

                if (pirateMoviesRaw.length > 0 && pirateMoviesRaw[i].magnets.length > 0 && pirateMoviesRaw[i].magnets[0].url) {
                    magnet = pirateMoviesRaw[i].magnets[0].url
                }

                if (element.title !== undefined) {
                    title = element.title
                }

                if (element.year !== undefined) {
                    year = element.year
                }

                if (details.imdbRating !== undefined) {
                    rating = details.imdbRating
                }

                pirateMovies.push({
                    title: title.replace(/\./g, ' '),
                    year: year,
                    rating: rating,
                    genres: genres,
                    coverURL: details.Poster,
                    magnet: magnet
                })
            }
            catch(err) {
                console.log('Cron job - Error - getting popular movies: ', err)
            }
        }

        const tmp = _.unionWith(pirateMovies, yifyMovies, compareMovies)
        const movies = _.shuffle(tmp)

        saveMovies(movies)
        console.log('Cron job - Number of movies added: ', movies.length)
    }
    catch(err) {
        console.log('Cron job - Error - popular movies: ', err)
        return err
    }
}

export const removeOutdated = async () => {

    try {
        const current = moment()
        const tmp = current.subtract(30, 'days')
        const due = tmp.format('YYYY-MM-DD')

        const res = await Locals.remove({ 'lastPlay': { '$lte': due } })
        console.log('Cron job - Number of element removed from local files: ', res.n)
    }
    catch(err) {
        console.log('Cron job - Error - remove outdated: ', err)
        return err
    }
}