'use strict'

import OS from 'opensubtitles-api'
import download from 'download'
import srt2vtt from 'srt-to-vtt'
import fs from 'fs'

import error from '../../templates/vars/error'
import { openSubtitles as config } from '../../config/config.js'
import { openSubtitles as secret } from '../../config/secret.js'

const OpenSubtitles = new OS({
    useragent: 'TemporaryUserAgent',
    username: config.username,
    password: secret.password,
    ssl: false
})

const saveAsVTT = (url, filename, dirName, lang) => {
    return new Promise( async (resolve, reject) => {

        try {
            const data = await download(url)

            if (fs.existsSync('files') == false) {
                fs.mkdirSync('files')
            }

            if (fs.existsSync(`files/${dirName}`) == false) {
                fs.mkdirSync(`files/${dirName}`)
            }

            fs.writeFileSync(`files/${dirName}/${filename}`, data)

            fs.createReadStream(`files/${dirName}/${filename}`)
                .pipe(srt2vtt())
                .pipe(fs.createWriteStream(`files/${dirName}/${filename}.${lang}.vtt`))

            fs.unlink(`files/${dirName}/${filename}`, (err) => {
                if (err) {
                    return reject(err)
                }

                const path = `files/${dirName}/${filename}.${lang}.vtt`

                return resolve(path)
            })
        }
        catch(err) {
            return reject(err)
        }
    })
}

export const getSubtitles = (imdbID, movieTitle, dirName) => {
    return new Promise( async (resolve, reject) => {
        try {
            const res = await OpenSubtitles.search({ imdbid: imdbID })
            const subtitles = {
                en: null,
                fr: null
            }

            if (res.en) {
                try {
                    const path = await saveAsVTT(res.en.url, movieTitle, dirName, 'en')
                    subtitles.en = path
                }
                catch(err) {
                    error.message = 'Subtitle file writing error'
                    error.field = 'subtitles-service'
                    error.type = 'api'

                    return reject(error)
                }
            }

            if (res.fr) {
                try {
                    const path = await saveAsVTT(res.fr.url, movieTitle, dirName, 'fr')
                    subtitles.fr = path
                }
                catch(err) {
                    error.message = 'Subtitle file writing error'
                    error.field = 'subtitles-service'
                    error.type = 'api'

                    return reject(error)
                }
            }

            return resolve(subtitles)
        }
        catch (err) {
            error.message = err.message
            error.field = 'subtitles-service'
            error.type = 'api'

            console.log('-> Subtitles service failed')
            return reject(error)
        }
    })
}