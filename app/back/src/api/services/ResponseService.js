'use strict'

export const createErrorResponse = (errors) => {
    const response = {
        data: { },
        state: {
            error: false,
            errors: new Array()
        }
    }

    response.state.error = true
    response.state.errors = errors
    return response
}

export const createResponse = (key, value) => {
    const response = {
        data: { },
        state: {
            error: false,
            errors: new Array()
        }
    }

    response.data[key] = value
    return response
}
