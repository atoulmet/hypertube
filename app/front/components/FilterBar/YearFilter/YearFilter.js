'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'

import { Select } from 'antd'
const Option = Select.Option

class YearFilter extends Component {

    constructor (props) {
        super(props)
    }

    _handleChange = (value) => {
        const filter = ((value) => {
            switch (value)
            {
            case '0':
                return [ 0, 1950 ]
            case '1':
                return [ 1950, 1960 ]
            case '2':
                return [ 1960, 1970 ]
            case '3':
                return [ 1970, 1980 ]
            case '4':
                return [ 1980, 1990 ]
            case '5':
                return [ 1990, 2000 ]
            case '6':
                return [ 2000, 2010 ]
            default:
                return [ 2010, 2020 ]
            }
        })(value)
        this.props._getFilterValues(filter, 'YEAR')
    }

    render() {

        return (
            <I18n>
                { (t) => (
                    <Select
                        onChange={ this._handleChange }
                        placeholder={ t('Year') }
                        showSearch
                        style={ { width: 200 } }
                    >
                        <Option value='0'>{ t('Before') } 1950</Option>
                        <Option value='1'>1950 - 1960</Option>
                        <Option value='2'>1960 - 1970</Option>
                        <Option value='3'>1970 - 1980</Option>
                        <Option value='4'>1980 - 1990</Option>
                        <Option value='5'>1990 - 2000</Option>
                        <Option value='6'>2000 - 2010</Option>
                        <Option value='7'>2010 - { t('Today') }</Option>
                    </Select>
                )}
            </I18n>
        )
    }
}

YearFilter.propTypes = {
    _getFilterValues: PropTypes.func
}

export default YearFilter