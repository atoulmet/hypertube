'use strict'

import jwtDecode from 'jwt-decode'

export const OAUTH_INSTAGRAM_LOADING = 'OAUTH_INSTAGRAM_LOADING'
export const OAUTH_INSTAGRAM_SUCCESS = 'OAUTH_INSTAGRAM_SUCCESS'
export const OAUTH_INSTAGRAM_FAILURE = 'OAUTH_INSTAGRAM_FAILURE'

export const oauthInstagramIsLoading = () => {
    return {
        type: OAUTH_INSTAGRAM_LOADING
    }
}

export const oauthInstagramSuccess = () => {
    return {
        type: OAUTH_INSTAGRAM_SUCCESS
    }
}

export const oauthInstagramError = errors => {
    return {
        errors,
        type: OAUTH_INSTAGRAM_FAILURE
    }
}

export const instagramOAuthAction = authResponse => {
    return async dispatch => {
        const url = `http://localhost:3000/api/oauth/instagram/token?access_token=${authResponse}`

        const parameters = {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*' }
        }

        dispatch(oauthInstagramIsLoading())
        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(oauthInstagramError(resJson.state.errors))
            }

            const token = resJson.data.token

            const decodedToken = (token) ? jwtDecode(token) : {}

            localStorage.setItem('token', token)
            localStorage.setItem('username', decodedToken.username)
            return dispatch(oauthInstagramSuccess())
        }
        catch (error) {
            return dispatch(oauthInstagramError(error))
        }
    }
}