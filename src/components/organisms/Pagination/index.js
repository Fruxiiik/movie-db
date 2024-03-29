import React from 'react'
import { Pagination as AntdPagination } from 'antd'

import './Pagination.css'

export const Pagination = ({ current, total, onChangePage }) => {
  return (
    <AntdPagination
      className="Pagination"
      current={current}
      pageSize={20}
      total={total}
      onChange={onChangePage}
      showSizeChanger={false}
    />
  )
}
