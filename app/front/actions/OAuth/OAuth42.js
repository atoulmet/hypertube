'use strict'

import jwtDecode from 'jwt-decode'

export const OAUTH_42_LOADING = 'OAUTH_42_LOADING'
export const OAUTH_42_SUCCESS = 'OAUTH_42_SUCCESS'
export const OAUTH_42_FAILURE = 'OAUTH_42_FAILURE'

export const oauth42IsLoading = () => {
    return {
        type: OAUTH_42_LOADING
    }
}

export const oauth42Success = () => {
    return {
        type: OAUTH_42_SUCCESS
    }
}

export const oauth42Error = errors => {
    return {
        errors,
        type: OAUTH_42_FAILURE
    }
}

export const connect42OAuthAction = code => {
    return async dispatch => {
        const url = 'http://localhost:3000/api/oauth/42'
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        }
        dispatch(oauth42IsLoading())
        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(oauth42Error(resJson.state.errors))
            }

            const token =  resJson.data.token
            const decodedToken = (token) ? jwtDecode(token) : {}

            localStorage.setItem('token', token)
            localStorage.setItem('username', decodedToken.username)

            return dispatch(oauth42Success())
        }
        catch(error) {
            return dispatch(oauth42Error(error))
        }
    }
}
