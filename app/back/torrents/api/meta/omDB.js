'use strict'

import fetch from 'fetch'

import * as StabilityService from '../../../src/api/services/StabilityService'

import { omDB as secret } from '../../../src/config/secret'
import { omDB as config } from '../../../src/config/config'

/* Get details about a movie based on its title */
export const getMovieDetails = title => {
    return new Promise((resolve, reject) => {
        const url = `${config.host}?t=${encodeURI(title)}&apikey=${secret.key}`

        setTimeout(function () {
            return resolve({})
        }, 5000)

        fetch.fetchUrl(url, (error, meta, body) => {
            if (error)
                return reject(error)

            const response = StabilityService.parseJSON(body)
            return resolve(response)
        })
    })
}