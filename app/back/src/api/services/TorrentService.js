'use strict'

import _ from 'lodash'

import * as yifyService from '../../../torrents/api/trackers/yify'
import * as TPBScraper from '../../../torrents/scrapers/trackers/ThePirateBay/index'

import error from '../../templates/vars/error'

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

export const searchMovies = (query) => {
    return (new Promise(async (resolve, reject) => {
        try {
            const yifyMovies = await yifyService.searchMovies(query)
            const pirateMovies = await TPBScraper.scrapMovies(query)
            const movies = _.unionWith(yifyMovies, pirateMovies, compareMovies)

            return resolve(movies)
        }
        catch (err) {
            error.message = err.message
            error.field = 'search-movies'
            error.type = 'api'

            console.log('-> searchMovies rejection')
            return reject(error)
        }
    }))
}
