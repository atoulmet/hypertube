'use strict'

/**
 * Registration actions
 */

export const REGISTRATION_LOADING = 'REGISTRATION_LOADING'
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS'
export const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE'
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE'
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'

export const registrationIsLoading = () => {
    return {
        type: REGISTRATION_LOADING
    }
}

export const registrationSuccess = () => {
    return {
        type: REGISTRATION_SUCCESS
    }
}

export const registrationError = errors => {
    return {
        errors,
        type: REGISTRATION_FAILURE
    }
}

export const resetPasswordSuccess = () => {
    return {
        type: RESET_PASSWORD_SUCCESS
    }
}

export const resetPasswordError = errors => {
    return {
        type: RESET_PASSWORD_FAILURE,
        errors
    }
}
export const registrationFormAction = formData => {
    return async dispatch => {
        const lang = localStorage.getItem('i18nextLng')
        const url = 'http://localhost:3000/api/user/signup'
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept-language': lang },
            body: JSON.stringify(formData)
        }

        dispatch(registrationIsLoading())

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(registrationError(resJson.state.errors))
            }

            return dispatch(registrationSuccess())
        }
        catch(error) {
            return dispatch(registrationError(error))
        }
    }
}

/**
 * Forgotten password actions
 */

export const FORGOTTEN_PASSWORD_SUCCESS = 'FORGOTTEN_PASSWORD_SUCCESS'

export const forgottenPasswordSuccess = res => {
    return {
        res,
        type: FORGOTTEN_PASSWORD_SUCCESS
    }
}

export const forgottenPasswordAction = formData => {
    return async dispatch => {
        const url = 'http://localhost:3000/api/user/forgot-password'
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }
        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            return dispatch(forgottenPasswordSuccess(resJson))
        }
        catch(error) {
            return
        }
    }
}

/**
 * Reset password actions
 */

export const resetPasswordAction = formData => {
    return async dispatch => {
        const url = 'http://localhost:3000/api/user/reset-password'
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        }
        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()
            if (resJson.state.error === true) {
                return dispatch(resetPasswordError(resJson.state.errors))
            }
            return dispatch(resetPasswordSuccess(resJson))
        }
        catch(error) {
            return dispatch(resetPasswordError(error))
        }
    }
}