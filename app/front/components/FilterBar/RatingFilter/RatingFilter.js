'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Select } from 'antd'

const Option = Select.Option

class RatingFilter extends Component {

    _handleChange = (value) => {
        const filter = ((value) => {
            switch (value)
            {
            case '0':
                return [ 0, 2 ]
            case '1':
                return [ 2, 4 ]
            case '2':
                return [ 4, 6 ]
            case '3':
                return [ 6, 8 ]
            default:
                return [ 8, 10 ]
            }
        })(value)
        this.props._getFilterValues(filter, 'RATING')
    }


    render() {

        return (
            <I18n>
                { (t) => (
                    <Select
                        onChange={ this._handleChange }
                        placeholder={ t('Rating') }
                        showSearch
                        style={ { width: 200 } }
                    >
                        <Option value='0'>0 - 2</Option>
                        <Option value='1'>2 - 4</Option>
                        <Option value='2'>4 - 6</Option>
                        <Option value='3'>6 - 8</Option>
                        <Option value='4'>8 - 10</Option>
                    </Select>
                )}
            </I18n>
        )
    }
}

RatingFilter.propTypes = {
    _getFilterValues: PropTypes.func
}

export default RatingFilter