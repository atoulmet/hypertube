'use strict'

import { client as config } from '../../config/config.js'

module.exports = {
    subject: 'Oosh ! Have you forgotten your password ?',
    link: function (_id, token) {
        const protocol = config.protocol
        const host = config.host
        const port = config.port

        const route = '/reset-password/'
        const query = `id=${ _id }&token=${ token }`
        const url = `${ protocol }://${ host }:${ port }${ route }?${ query }`

        const linkValue = 'Click here to change your account password'
        const link = `<a href="${ url }" target="_blank" rel="noopener noreferrer">${ linkValue }</a>`

        const bodyContent = `<body>${ link }</body>`
        const headContent = '<head></head>'
        const htmlContent = `<!DOCTYPE html><html>${ headContent }${ bodyContent }</html>`

        return (htmlContent)
    }
}