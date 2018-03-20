'use strict'

const initialState = {
    errors: [],
    resetSuccess: false,
    forgotSuccess: false
}

const passwordHandling = (state = initialState, action) => {

    switch (action.type)
    {
    case 'FORGOT_PASSWORD_SUCCESS':
        return { forgotSuccess: true }
    case 'RESET_PASSWORD_SUCCESS':
        return { resetSuccess: true }
    case 'RESET_PASSWORD_FAILURE':
        return { resetSuccess: false, errors: action.errors }

    default:
        return state
    }
}

export default passwordHandling