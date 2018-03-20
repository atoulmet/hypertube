'use strict'

const initialState = {
    errors: [],
    hasSucceeded: false,
    field: ''
}

const editAccountStatus = (state = initialState, action) => {
    switch (action.type)
    {
    case 'EDIT_ACCOUNT_FAIL':
        return { errors: action.errors, hasSucceeded: false }
    case 'EDIT_ACCOUNT_SUCCESS':
        return { errors: [], hasSucceeded: true, field: action.field }

    default:
        return state
    }
}

export default editAccountStatus