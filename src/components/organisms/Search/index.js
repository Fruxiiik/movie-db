import React, { Component } from 'react'
import { Input as AntdInput } from 'antd'

import './Search.css'

export class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    // this.debouncedSearch = debounce(this.props.search, 500)
  }

  // search(inputValue) {
  //   console.log(`Поиск для: ${inputValue}`)
  //   // Здесь может быть код для выполнения поиска или отправки запроса на сервер
  // }
  onLabelChange = (e) => {
    // this.setState({
    //   inputValue: e.target.value,
    // })
    this.props.search(e.target.value)
  }

  // handleSearch = (searchTerm) => {
  //   console.log('Поиск:', searchTerm)
  //   // Здесь вы можете выполнить действия поиска, например, вызвать API
  // }

  onSubmit = (e) => {
    e.preventDefault()
  }

  render() {
    const { inputValue } = this.props
    return (
      <form className="" onSubmit={this.onSubmit}>
        <AntdInput
          type="text"
          value={inputValue}
          className="AntdInput"
          onChange={this.onLabelChange}
          placeholder="Type to search..."
          autoFocus
        />
      </form>
    )
  }
}
