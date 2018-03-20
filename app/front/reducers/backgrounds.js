'use strict'

const initialState = {
    layoutBackground: ''
}

const backgrounds = (state = initialState, action) => {

    switch (action.type)
    {
    case 'LOAD_LAYOUT_BACKGROUND':
        return { layoutBackground: action.url }

    default:
        return state
    }
}

export default backgrounds