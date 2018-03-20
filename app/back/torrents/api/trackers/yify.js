'use strict'

import fetch from 'fetch'

import * as StabilityService from '../../../src/api/services/StabilityService'
import * as torrent from '../../scrapers/templates/scrap.js'

const API = {
    list: 'https://yts.ag/api/v2/list_movies.json'
}

const trackers = [
    'udp://open.demonii.com:1337/announce',
    'udp://tracker.openbittorrent.com:80',
    'udp://tracker.coppersurfer.tk:6969',
    'udp://glotorrents.pw:6969/announce',
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://torrent.gresille.org:80/announce',
    'udp://p4p.arenabg.com:1337',
    'udp://tracker.leechers-paradise.org:6969'
]

const formatMagnetURL = (hash, title) => {
    const template = `magnet:?xt=urn:btih:{TORRENT_HASH}&dn={ENCODED_MOVIE_NAME}tr=${trackers.join('&tr=')}`

    return template
        .replace('{TORRENT_HASH}', hash)
        .replace('{ENCODED_MOVIE_NAME}', encodeURIComponent(title))
}

/* Get a list of torrents + magnets based on the movie title */
export const getTorrents = (title) => {
    return new Promise((resolve, reject) => {
        const url = API.list + `?query_term=${title}`

        fetch.fetchUrl(url, (error, meta, body) => {
            if (error)
                return reject(error)

            const response = StabilityService.parseJSON(body)
            const moviesFound = response.data.movies
            let list = []

            moviesFound.forEach(movie => {
                let torrents = []
                let magnets = []

                movie.torrents.forEach(element => {
                    const torrentInfos = {
                        seeders: null,
                        leechers: null,
                        url: null
                    }

                    const magnetInfos = {
                        seeders: null,
                        leechers: null,
                        magnet: null
                    }

                    torrentInfos.url = element.url
                    torrentInfos.leechers = element.peers
                    torrentInfos.seeders = element.seeds
                    torrents.push(torrentInfos)

                    magnetInfos.magnet = formatMagnetURL(element.hash, movie.title_long)
                    magnetInfos.leechers = element.peers
                    magnetInfos.seeders = element.seeds
                    magnets.push(magnetInfos)
                })

                list.push(torrent.toJSON({
                    title: movie.title_long,
                    provider: 'yify',
                    torrents: torrents,
                    magnets: magnets
                }))
            })
            return resolve(list)
        })
    })
}

/* Get a list of movies based on a query search */
export const searchMovies = query => {
    return new Promise((resolve, reject) => {
        const url = API.list + `?query_term=${encodeURI(query) }`//?quality=720p`

        fetch.fetchUrl(url, (error, meta, body) => {
            if (error)
                return reject(error)

            const response = (body) ? StabilityService.parseJSON(body) : null
            const data = (response && response.data) ? response.data : null
            const movies = (data && data.movies) ? data.movies : []
            const list = []

            movies.forEach(movie => {
                if (movie.torrents) {
                    list.push({
                        title: movie.title.replace(/\./g, ' '),
                        year: movie.year,
                        rating: movie.rating,
                        genres: movie.genres,
                        poster: movie.large_cover_image,
                        magnet: formatMagnetURL(movie.torrents[0].hash, movie.title_long)
                    })
                }
            })
            return resolve(list)
        })
    })
}

/* Get a list of movies (50 per page) based on their popularity by downloads */
export const getMovies = () => {
    return new Promise((resolve, reject) => {
        const url = API.list + `?sort_by=download_count&limit=50`//&quality=720p`

        fetch.fetchUrl(url, (error, meta, body) => {
            if (error)
                return reject(error)

            const response = (body) ? StabilityService.parseJSON(body) : null
            const data = (response && response.data) ? response.data : null
            const movies = (data && data.movies) ? data.movies : []
            const list = []

            movies.forEach(movie => {
                list.push({
                    title: movie.title,
                    year: movie.year,
                    rating: movie.rating,
                    genres: movie.genres,
                    coverURL: movie.large_cover_image,
                    magnet: formatMagnetURL(movie.torrents[0].hash, movie.title_long)
                })
            })
            return resolve(list)
        })
    })
}