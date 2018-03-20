'use strict'

export const EDIT_PROFILE_FAIL = 'EDIT_PROFILE_FAIL'
export const EDIT_PROFILE_SUCCESS = 'EDIT_PROFILE_SUCCESS'

export const editProfileSuccess = ({ data }) => {
    return {
        data,
        type: EDIT_PROFILE_SUCCESS
    }
}

export const editProfileFailure = (errors) => {
    return {
        errors,
        type: EDIT_PROFILE_FAIL
    }
}

export const editProfileAction = (data) => {
    return async dispatch => {
        const lang = localStorage.getItem('i18nextLng')
        const url = `http://localhost:3000/api/user/edit/profile`
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-session-token': localStorage.token, 'accept-language': lang },
            body: JSON.stringify(data)
        }

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(editProfileFailure(resJson.state.errors))
            }

            return dispatch(editProfileSuccess(resJson))
        }
        catch(error) {
            return dispatch(editProfileFailure(error))
        }
    }
}