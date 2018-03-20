'use strict'

const f                 = require('fetch')
const cheerio           = require('cheerio')
const scrap             = require('../../templates/scrap')

module.exports.scrap = (opts) => {
    const keywords = []
    let query = ''

    if (Array.isArray(opts.keywords) && opts.keywords.length) {
        opts.keywords.forEach((elem) => {
            let words = elem.split(' ')

            words.forEach((word) => {
                keywords.push(word)
            })
        })
        query += keywords.join(' ')
    }
    if (opts.resolution.length)
        query += ` ${opts.resolution}p`

    return new Promise(
        (resolve, reject) => {
            const list = []
            const provider = 'www.legittorrents.info'
            const url = `http://${provider}/index.php?page=torrents&search=${query}&category=1&active=1`

            f.fetchUrl(url, (err, meta, body) => {
                const $ = cheerio.load(body.toString())

                if (err) return reject(err)

                $('table table table tr table tr').each((i, elem) => {
                    if (i > 0) {
                        let title = $(elem).find('td a').eq(1).text()
                        let torrent = $(elem).find('td a').eq(2).attr('href')
                        let seeders  = parseInt($(elem).find('td').eq(4).text())
                        let leechers = parseInt($(elem).find('td').eq(5).text())

                        if (torrent)
                            list.push(scrap.toJSON({ magnet: [ ], torrents: [ { leechers, seeders, url: torrent  } ], provider, title }))
                    }
                })
                return resolve(list)
            })
        })
}
