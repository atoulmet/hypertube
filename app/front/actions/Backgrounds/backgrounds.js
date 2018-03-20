'use strict'

export const LOAD_LAYOUT_BACKGROUND = 'LOAD_LAYOUT_BACKGROUND'

export const loadLayoutBackground = (url) => {
    return {
        url,
        type: LOAD_LAYOUT_BACKGROUND
    }
}

export const loadLayoutBackgroundAction = url => {
    return dispatch => {
        dispatch(loadLayoutBackground(url))
    }
}
