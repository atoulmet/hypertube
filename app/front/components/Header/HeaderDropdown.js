'use strict'

import React from 'react'
import { Menu, Dropdown, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { I18n } from 'react-i18next'

const menu = (
    <I18n>
        { (t) => (
            <Menu>
                <Menu.Item key='0'>
                    <Link props={ this.props } to={ `/users/${ localStorage.username }` }>
                        { t('Menu Profile') }
                    </Link>
                </Menu.Item>
                <Menu.Item key='1'>
                    <Link props={ this.props } to='/edit/profile'>
                        { t('Menu Edit Profile') }
                    </Link>
                </Menu.Item>
                <Menu.Item key='2'>
                    <Link props={ this.props } to='/edit/account'>
                        { t('Menu Edit Account') }
                    </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='3'>
                    <Link props={ this.props } to='/logout'>
                        { t('Logout') }
                    </Link>
                </Menu.Item>
            </Menu>
        )}
    </I18n>
)

export const HeaderDropdown = () => {
    return (
        <Dropdown overlay={ menu } trigger={ [ 'click' ] }>
            <a >
                Menu <Icon type='down' />
            </a>
        </Dropdown>
    )
}