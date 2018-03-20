'use strict'

export const parseJSON = (data) => {
    try {
        return JSON.parse(data)
    }
    catch (err) {
        console.log('-> Invalid JSON response parsing')
        return {}
    }
}