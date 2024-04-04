import React from 'react'
import { Alert, Button, Space } from 'antd'

const ErrorIndicator = ({ errorMessage, retry, type }) => {
  return (
    <div className="ErrorIndicator">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          className="ErrorMessage"
          message={errorMessage}
          action={
            <Button onClick={retry} type="primary" size="middle">
              Повторить попытку
            </Button>
          }
          closable
          type={type}
          showIcon
        />
      </Space>
    </div>
  )
}

ErrorIndicator.defaultProps = {
  type: 'error',
}

export default ErrorIndicator
