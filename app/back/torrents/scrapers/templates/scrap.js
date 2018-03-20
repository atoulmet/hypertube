'use strict'

export const toJSON = (data) => {
    const processed = {
        title: null,
        provider: null,
        torrents: [],
        magnets: []
    }
    return Object.assign(processed, data)
}