'use strict'

import jwtDecode from 'jwt-decode'

export const OAUTH_GOOGLE_LOADING = 'OAUTH_GOOGLE_LOADING'
export const OAUTH_GOOGLE_SUCCESS = 'OAUTH_GOOGLE_SUCCESS'
export const OAUTH_GOOGLE_FAILURE = 'OAUTH_GOOGLE_FAILURE'

export const oauthGOOGLEIsLoading = () => {
    return {
        type: OAUTH_GOOGLE_LOADING
    }
}

export const oauthGOOGLESuccess = () => {
    return {
        type: OAUTH_GOOGLE_SUCCESS
    }
}

export const oauthGOOGLEError = errors => {
    return {
        errors,
        type: OAUTH_GOOGLE_FAILURE
    }
}

export const GoogleOAuthAction = authResponse => {
    return async dispatch => {
        const url = `http://localhost:3000/api/oauth/google/token?access_token=${authResponse}`

        const parameters = {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*' }
        }

        dispatch(oauthGOOGLEIsLoading())
        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(oauthGOOGLEError(resJson.state.errors))
            }

            const token = resJson.data.token

            const decodedToken = (token) ? jwtDecode(token) : {}

            localStorage.setItem('token', token)
            localStorage.setItem('username', decodedToken.username)
            return dispatch(oauthGOOGLESuccess())
        }
        catch (error) {
            return dispatch(oauthGOOGLEError(error))
        }
    }
}