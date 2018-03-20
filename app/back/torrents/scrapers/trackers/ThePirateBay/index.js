'use strict'

import f from 'fetch'
import cheerio from 'cheerio'
import nameParser from 'torrent-name-parser'

import * as torrent from '../../templates/scrap'
import * as omdbAPI from '../../../../torrents/api/meta/omDB'

export const scrapMovies = (query) => {
    return new Promise(async (resolve, reject) => {
        const movies = []

        try {
            const torrents = await scrapSearch({ keywords: [ query ], resolution: null })

            for (let i in torrents) {
                const movie = nameParser(torrents[i].title)
                const details = await omdbAPI.getMovieDetails(movie.title)
                let genres = []
                let magnet = ''

                if (details.Genre) {
                    genres = details.Genre.replace(/\s/g, '').split(',')
                }

                if (torrents.length > 0 && torrents[i].magnets.length > 0 && torrents[i].magnets[0].url) {
                    magnet = torrents[i].magnets[0].url
                }

                if (details.Response && details.Response === 'True') {
                    let poster = 'https://d32qys9a6wm9no.cloudfront.net/images/movies/poster/500x735.png'

                    if (details.Poster && details.Poster !== undefined && details.Poster !== 'N/A') {
                        poster = details.Poster
                    }

                    movies.push({
                        title: movie.title.replace(/\./g, ' '),
                        year: movie.year,
                        rating: details.imdbRating,
                        genres: genres,
                        poster: poster,
                        magnet: magnet
                    })
                }
            }
            return resolve(movies)
        }
        catch (err) {
            return reject(err)
        }
    })
}

export const scrapSearch = (opts) => {
    return new Promise((resolve, reject) => {
        const list = []
        const keywords = []
        let query = ''
        const provider = 'thepiratebay.org'

        if (Array.isArray(opts.keywords) && opts.keywords.length) {
            opts.keywords.forEach((elem) => {
                let words = elem.split(' ')

                words.forEach((word) => {
                    keywords.push(word)
                })
            })
            query += keywords.join('+')
        }
        if (opts.resolution && opts.resolution.length)
            query += `+${opts.resolution}p`

        const url = `https://${provider}/search/${ encodeURI(query) }/0/99/207`
        console.log('URL: ', url)

        setTimeout(function() {
            return resolve([])
        }, 5000)

        f.fetchUrl(url, (err, meta, body) => {
            if (err)
                return reject(err)

            const $ = cheerio.load(body.toString())

            $('#SearchResults tr')
                .each((i, elem) => {
                    let url = $(elem).find('td').eq(1).find('.detName a').attr('href')
                    let title = $(elem).find('td').eq(1).find('.detName a').text()
                    let magnet = $(elem).find('td').eq(1).find('.detName + a').attr('href')
                    let seeders  = parseInt($(elem).find('td').eq(2).text())
                    let leechers = parseInt($(elem).find('td').eq(3).text())

                    if (magnet && title && url)
                        list.push(torrent.toJSON({ magnets: [ { leechers, seeders, url: magnet } ], provider: 'pirateBay', title, torrent: [ ] }))
                    if (list.length >= 9)
                        return resolve(list)
                })
            return resolve(list)
        })
    })
}

export const scrapMostPopulars = () => {
    return new Promise((resolve, reject) => {
        const list = []
        const provider = 'thepiratebay.org'
        const url = `https://${provider}/top/201`

        f.fetchUrl(url, (err, meta, body) => {
            const $ = cheerio.load(body.toString())

            if (err)
                return reject(err)

            $('#searchResult tr')
                .each((i, elem) => {
                    let url = $(elem).find('td').eq(1).find('.detName a').attr('href')
                    let title = $(elem).find('td').eq(1).find('.detName a').text()
                    let magnet = $(elem).find('td').eq(1).find('.detName + a').attr('href')
                    let seeders = parseInt($(elem).find('td').eq(2).text())
                    let leechers = parseInt($(elem).find('td').eq(3).text())

                    if (magnet && title && url)
                        list.push(torrent.toJSON({ magnets: [ { leechers, seeders, url: magnet } ], provider, title, torrent: [] }))
                })
            return resolve(list)
        })
    })
}
