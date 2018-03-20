'use strict'

export const GET_USER_PROFILE_FAIL = 'GET_USER_PROFILE_FAIL'
export const GET_USER_PROFILE_SUCCESS = 'GET_USER_PROFILE_SUCCESS'

export const getUserProfileSuccess = ({ data }) => {
    return {
        data,
        type: GET_USER_PROFILE_SUCCESS
    }
}

export const getUserProfileFailure = ({ data }) => {
    return {
        data,
        type: GET_USER_PROFILE_FAIL
    }
}

export const getUserProfileAction = (username) => {
    return async dispatch => {
        const url = `http://localhost:3000/api/user/profile/${username}`
        const parameters = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-session-token': localStorage.token }
        }
        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(getUserProfileFailure(resJson.state.errors))
            }
            return dispatch(getUserProfileSuccess(resJson))
        }
        catch(error) {
            console.log('ERROR', error)
            return dispatch(getUserProfileFailure(error))
        }
    }
}