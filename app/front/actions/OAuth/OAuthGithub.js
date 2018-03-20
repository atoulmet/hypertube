'use strict'

import jwtDecode from 'jwt-decode'

export const OAUTH_GITHUB_LOADING = 'OAUTH_GITHUB_LOADING'
export const OAUTH_GITHUB_SUCCESS = 'OAUTH_GITHUB_SUCCESS'
export const OAUTH_GITHUB_FAILURE = 'OAUTH_GITHUB_FAILURE'

export const oauthGithubIsLoading = () => {
    return {
        type: OAUTH_GITHUB_LOADING
    }
}

export const oauthGithubSuccess = () => {
    return {
        type: OAUTH_GITHUB_SUCCESS
    }
}

export const oauthGithubError = errors => {
    return {
        errors,
        type: OAUTH_GITHUB_FAILURE
    }
}

export const connectGithubOAuthAction = code => {
    return async dispatch => {

        /* Here we use the code to get an access token*/
        const url = 'http://localhost:3000/api/oauth/github'
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        }

        dispatch(oauthGithubIsLoading())

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(oauthGithubError(resJson.state.errors))
            }

            /* Here we use the access token to sign the user in if possible */
            const token = resJson.data.access_token
            const authUrl = `http://localhost:3000/api/oauth/github/token?access_token=${token}`
            const params = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }

            try {
                const response = await fetch(authUrl, params)
                const responseJson = await response.json()

                if (responseJson.state.error === true) {
                    return dispatch(oauthGithubError(responseJson.state.errors))
                }

                const token = responseJson.data.token
                const decodedToken = (token) ? jwtDecode(token) : {}

                localStorage.setItem('token', token)
                localStorage.setItem('username', decodedToken.username)

                return dispatch(oauthGithubSuccess())
            }
            catch(err) {
                return dispatch(oauthGithubError(err))
            }

        }
        catch (error) {
            return dispatch(oauthGithubError(error))
        }
    }
}