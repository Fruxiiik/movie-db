import React from 'react'
import { Alert, Button, Space } from 'antd'

const ErrorIndicator = ({ errorMessage, retry }) => {
  return (
    <div className="ErrorIndicator">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          className="ErrorMessage"
          message={errorMessage}
          action={
            // <Space>
            <Button onClick={retry} type="primary" size="middle">
              Повторить попытку
            </Button>
            // </Space>
          }
          closable
          // description={errorMessage}
          type="error"
          showIcon
        />
        {/* <Button onClick={retry} type="primary"> */}
        {/*  Повторить попытку */}
        {/* </Button> */}
      </Space>
    </div>
  )
}

export default ErrorIndicator
