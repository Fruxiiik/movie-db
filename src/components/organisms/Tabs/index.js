import React, { Component } from 'react'
import { Tabs as AntdTabs } from 'antd'

import './Tabs.css'

export class Tabs extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { onChange } = this.props
    const items = [
      { key: 'search', label: 'Search', children: '' },
      { key: 'rated', label: 'Rated', children: '' },
    ]
    return <AntdTabs className="Tabs" defaultActiveKey="search" items={items} onChange={onChange} />
  }
}
