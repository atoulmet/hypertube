'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { I18n } from 'react-i18next'
import { Select } from 'antd'

const Option = Select.Option

class SortBy extends Component {

    _handleChange = (value) => {
        this.props._getFilterValues(value, 'SORTBY')
    }


    render() {

        return (
            <I18n>
                { (t) => (
                    <Select
                        onChange={ this._handleChange }
                        placeholder={ t('Sort by') }
                        showSearch
                        style={ { width: 200 } }
                    >
                        <Option value='rating'>{ t('Rating') }</Option>
                        <Option value='year'>{ t('Year') }</Option>
                    </Select>
                )}
            </I18n>
        )
    }
}

SortBy.propTypes = {
    _getFilterValues: PropTypes.func
}

export default SortBy