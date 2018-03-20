'use strict'

export const EDIT_ACCOUNT_FAIL = 'EDIT_ACCOUNT_FAIL'
export const EDIT_ACCOUNT_SUCCESS = 'EDIT_ACCOUNT_SUCCESS'

export const editAccountSuccess = (field) => {
    return {
        field,
        type: EDIT_ACCOUNT_SUCCESS
    }
}

export const editAccountFailure = (errors) => {
    return {
        errors,
        type: EDIT_ACCOUNT_FAIL
    }
}

export const editEmailAction = (data) => {
    return async dispatch => {
        const lang = localStorage.getItem('i18nextLng')
        const url = `http://localhost:3000/api/user/edit/account/email`
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-session-token': localStorage.token, 'accept-language': lang },
            body: JSON.stringify(data)
        }

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(editAccountFailure(resJson.state.errors))
            }

            return dispatch(editAccountSuccess('email'))
        }
        catch (error) {
            return dispatch(editAccountFailure(error))
        }
    }
}

export const editUsernameAction = (data) => {
    return async dispatch => {
        const lang = localStorage.getItem('i18nextLng')
        const url = `http://localhost:3000/api/user/edit/account/username`
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-session-token': localStorage.token, 'accept-language': lang  },
            body: JSON.stringify(data)
        }

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(editAccountFailure(resJson.state.errors))
            }

            localStorage.username = data.username
            return dispatch(editAccountSuccess('username'))
        }
        catch (error) {
            return dispatch(editAccountFailure(error))
        }
    }
}

export const editPasswordAction = (data) => {
    return async dispatch => {
        const lang = localStorage.getItem('i18nextLng')
        const url = `http://localhost:3000/api/user/edit/account/password`
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-session-token': localStorage.token, 'accept-language': lang },
            body: JSON.stringify(data)
        }

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(editAccountFailure(resJson.state.errors))
            }
            return dispatch(editAccountSuccess('password'))
        }
        catch (error) {
            return dispatch(editAccountFailure(error))
        }
    }
}