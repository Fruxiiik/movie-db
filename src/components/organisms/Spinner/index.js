import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import React from 'react'

const Spinner = () => {
  return (
    <Spin
      // fullscreen
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
          }}
          spin
        />
      }
    />
  )
}

export default Spinner
