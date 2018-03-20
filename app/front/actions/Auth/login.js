'use strict'

import jwtDecode from 'jwt-decode'

export const SIGNIN_LOADING = 'SIGNIN_LOADING'
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS'
export const SIGNIN_FAILURE = 'SIGNIN_FAILURE'

export const signinIsLoading = () => {
    return {
        type: SIGNIN_LOADING
    }
}

export const signinSuccess = (username) => {
    return {
        username,
        type: SIGNIN_SUCCESS
    }
}

export const signinFailure = errors => {
    return {
        errors,
        type: SIGNIN_FAILURE
    }
}

export const signinFormAction = formData => {
    return async dispatch => {
        const lang = localStorage.getItem('i18nextLng')
        const url = 'http://localhost:3000/api/user/signin'
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept-language': lang },
            body: JSON.stringify(formData),
        }

        dispatch(signinIsLoading())

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(signinFailure(resJson.state.errors))
            }
            const token =  resJson.data.token
            const decodedToken = (token) ? jwtDecode(token) : {}

            localStorage.setItem('token', token)
            localStorage.setItem('username', decodedToken.username)

            return dispatch(signinSuccess(formData.username))
        }
        catch(error) {
            return dispatch(signinFailure(error))
        }
    }
}
