import React, { Component } from 'react'
import { debounce } from 'lodash'

import { MovieList, Pagination, Search } from './components/organisms'
import MovieApiClient from './components/services/api/movie-api-client'
import Spinner from './components/organisms/Spinner'
import ErrorIndicator from './components/organisms/ErrorIndicator'

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      currentPage: 1,
      totalItems: 0,
      moviesData: [],
      loading: true,
      errorMessage: '',
      errorType: '',
    }
    this.movieApiClient = new MovieApiClient()
    this.debouncedSearch = debounce(this.fetchMovies, 500)
  }

  componentDidMount() {
    this.handleNetworkChange() // Проверяем состояние сети при монтировании
    // const { currentPage } = this.state
    window.addEventListener('online', this.handleNetworkChange)
    window.addEventListener('offline', this.handleNetworkChange)
    // this.fetchMovies('FINAL', currentPage)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange)
    window.removeEventListener('offline', this.handleNetworkChange)
  }

  handleNetworkChange = () => {
    const status = navigator.onLine ? 'online' : 'offline'
    const { currentPage, inputValue } = this.state
    console.log(`You are ${status}`)
    if (navigator.onLine && inputValue) {
      this.setState({ errorMessage: '' }, () => this.fetchMovies(inputValue, currentPage))
    } else {
      this.setState({ errorMessage: 'Нет соединения с интернетом.' })
    }
  }

  fetchMovies = (input, page) => {
    this.setState({ loading: true, errorMessage: '', errorType: null }) // Обнуляем ошибку при начале загрузки

    this.movieApiClient
      .getSearchMovies(input, page)
      .then(({ movies, totalResults }) => {
        if (movies.length === 0) {
          // Здесь сохраняем input и устанавливаем тип ошибки 'noResults'
          this.setState({
            errorMessage: 'Фильмы по запросу не найдены.',
            loading: false,
            errorType: 'noResults',
            inputValue: input, // Сохраняем значение инпута
          })
        } else {
          // Если фильмы найдены, обновляем состояние и очищаем ошибку
          this.setState({
            moviesData: movies,
            currentPage: page,
            totalItems: totalResults,
            loading: false,
            errorType: null,
          })
        }
      })
      .catch((err) => {
        // Обрабатываем ошибку запроса, устанавливаем тип ошибки 'fetchError'
        this.setState({
          errorMessage: err.message || 'Произошла ошибка при загрузке данных.',
          loading: false,
          errorType: 'fetchError',
        })
      })
  }

  handleChangePage = (page) => {
    this.setState({ currentPage: page }, () => this.fetchMovies(this.state.inputValue, page))
    window.scrollTo(0, 0)
  }

  handleChangeInput = (text) => {
    this.setState(
      {
        inputValue: text,
        currentPage: 1,
      },
      () => {
        const { currentPage, inputValue } = this.state
        this.debouncedSearch(inputValue, currentPage)
      }
    )
  }

  render() {
    const { inputValue, moviesData, currentPage, totalItems, loading, errorMessage, errorType } = this.state

    if (loading) {
      return (
        <div className="Body flex-column">
          <Search search={this.handleChangeInput} inputValue={inputValue} />
          <Spinner />
        </div>
      )
    }

    if (errorType === 'fetchError') {
      // Ошибка запроса: предлагаем повторить попытку
      return <ErrorIndicator retry={() => this.fetchMovies(inputValue, currentPage)} errorMessage={errorMessage} />
    }
    if (errorType === 'noResults') {
      // Нет результатов: показываем сообщение, но оставляем данные пользователя
      return (
        <div className="Body">
          <Search search={this.handleChangeInput} inputValue={inputValue} />
          <ErrorIndicator retry={() => this.debouncedSearch(inputValue, currentPage)} errorMessage={errorMessage} />
        </div>
      )
    }

    // Успешное состояние: данные загружены
    return (
      <div className="Body">
        <Search search={this.handleChangeInput} inputValue={inputValue} />
        <MovieList moviesData={moviesData} />
        <Pagination current={currentPage} onChangePage={this.handleChangePage} total={totalItems} />
      </div>
    )
  }
}
