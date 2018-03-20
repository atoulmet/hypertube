'use strict'

import jwtDecode from 'jwt-decode'

export const OAUTH_FB_LOADING = 'OAUTH_FB_LOADING'
export const OAUTH_FB_SUCCESS = 'OAUTH_FB_SUCCESS'
export const OAUTH_FB_FAILURE = 'OAUTH_FB_FAILURE'

export const oauthFBIsLoading = () => {
    return {
        type: OAUTH_FB_LOADING
    }
}

export const oauthFBSuccess = () => {
    return {
        type: OAUTH_FB_SUCCESS
    }
}

export const oauthFBError = errors => {
    return {
        errors,
        type: OAUTH_FB_FAILURE
    }
}

export const FbOAuthAction = authResponse => {
    return async dispatch => {
        const url = `http://localhost:3000/api/oauth/facebook/token?access_token=${authResponse.accessToken}`

        const parameters = {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*' }
        }

        dispatch(oauthFBIsLoading())
        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(oauthFBError(resJson.state.errors))
            }

            const token = resJson.data.token

            const decodedToken = (token) ? jwtDecode(token) : {}

            localStorage.setItem('token', token)
            localStorage.setItem('username', decodedToken.username)

            return dispatch(oauthFBSuccess())
        }
        catch (error) {
            return dispatch(oauthFBError(error))
        }
    }
}