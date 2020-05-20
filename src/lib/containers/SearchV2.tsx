import * as React from 'react'
import { QueryWrapperChildProps } from './QueryWrapper'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCaretDown,
  faCaretUp,
  faSearch,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { insertConditionsFromSearchParams } from '../utils/functions/sqlFunctions'
import { unCamelCase } from '../utils/functions/unCamelCase'
import { ColumnModel, ColumnType } from '../utils/synapseTypes'

library.add(faCaretDown)
library.add(faCaretUp)
library.add(faSearch)
library.add(faTimes)

type SearchState = {
  show: boolean
  searchText: string
  columnName: string
}

export type SearchProps = {
  isQueryWrapperMenuChild?: boolean
  defaultColumn?: string
}

type InternalSearchProps = QueryWrapperChildProps & SearchProps

class Search extends React.Component<InternalSearchProps, SearchState> {
  public searchFormRef: React.RefObject<HTMLFormElement>
  public radioFormRef: React.RefObject<HTMLFormElement>

  constructor(props: InternalSearchProps) {
    super(props)
    this.state = {
      show: false,
      searchText: '',
      columnName: this.props.defaultColumn ?? '',
    }
    this.searchFormRef = React.createRef()
    this.radioFormRef = React.createRef()
  }

  componentDidMount() {
    // @ts-ignore
    document.addEventListener('click', this.handleClickOutsideForm)
  }

  componentWillUnmount() {
    // @ts-ignore
    document.removeEventListener('click', this.handleClickOutsideForm)
  }

  handleClickOutsideForm = (event: React.SyntheticEvent) => {
    if (
      // @ts-ignore
      !this.searchFormRef.current?.contains(event?.target) &&
      // @ts-ignore
      !this.radioFormRef.current?.contains(event?.target)
    ) {
      this.setState({
        show: false,
      })
    }
  }

  public toggleDropdown = (value: boolean) => (_: React.SyntheticEvent) => {
    this.setState({
      show: value,
    })
  }

  public static addEscapeCharacters = (searchText: string) => {
    // We have to escape the following characters
    // ' % \
    let escapedSearchText = searchText
    // escape ' by adding additional '
    escapedSearchText = escapedSearchText.split("'").join("''")
    // escape % by adding \
    escapedSearchText = escapedSearchText.split('%').join(`\%`)
    // escape \ by adding \
    escapedSearchText = escapedSearchText.split('\\').join('\\\\')
    return escapedSearchText
  }

  public search = (event: React.SyntheticEvent<HTMLFormElement>) => {
    // form completion by default causes the page to reload, so we prevent that
    event.preventDefault()
    const { searchText } = this.state
    let { columnName } = this.state
    if (columnName === '') {
      // default to the first one, will always be defined
      columnName = this.props.data?.columnModels?.[0].name ?? ''
    }
    this.setState({
      show: false,
    })
    const {
      updateParentState,
      getInitQueryRequest,
      executeQueryRequest,
      getLastQueryRequest,
    } = this.props

    const lastQueryRequest = getLastQueryRequest!()

    // Always grabs initQueryRequest to get version of the sql
    const initQueryRequestDeepCopy = getInitQueryRequest!()
    const { sql } = initQueryRequestDeepCopy.query
    const searchParams = {
      [columnName]: Search.addEscapeCharacters(searchText),
    }
    const newSql = insertConditionsFromSearchParams(searchParams, sql)
    lastQueryRequest.query.sql = newSql
    executeQueryRequest!(lastQueryRequest)
    const searchQuery = {
      columnName: !searchText ? '' : columnName,
      searchText,
    }
    updateParentState!({ searchQuery })
    this.setState({
      columnName: '',
      searchText: '',
    })
  }

  public handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      searchText: event.currentTarget.value,
    })
  }

  public isSupportedColumn = (columnModel: ColumnModel) => {
    switch (columnModel.columnType) {
      case ColumnType.FILEHANDLEID:
      case ColumnType.ENTITYID:
      case ColumnType.DATE:
      case ColumnType.DATE_LIST:
      case ColumnType.USERID:
        return false
      default:
        return true
    }
  }

  render() {
    const { data, topLevelControlsState, facetAliases } = this.props
    const { searchText, show } = this.state
    const outerClassName = `SearchV2 ${
      topLevelControlsState?.showSearchBar ? '' : 'hidden'
    }`
    return (
      <div className={outerClassName}>
        <form
          className="SearchV2__searchbar"
          onSubmit={this.search}
          onClick={() => {
            this.setState({ show: true })
            this.searchFormRef.current?.focus()
          }}
          ref={this.searchFormRef}
        >
          <FontAwesomeIcon
            className="SearchV2__searchbar__searchicon"
            size={'sm'}
            icon={'search'}
          />
          <input
            onChange={this.handleChange}
            onClick={() => {
              this.setState({
                show: true,
              })
            }}
            placeholder="Enter Search Terms"
            value={searchText}
            type="text"
          />
          {this.state.searchText.length > 0 && (
            <button
              className="SearchV2__searchbar__clearbutton"
              type="button"
              onClick={() => {
                this.setState({
                  searchText: '',
                })
              }}
            >
              <FontAwesomeIcon
                className="SRC-primary-text-color"
                icon="times"
              />
            </button>
          )}
        </form>
        <div
          className={
            show
              ? 'SearchV2__form-container'
              : 'SearchV2__form-container hidden'
          }
        >
          <form ref={this.radioFormRef} className="SearchV2__column-select">
            <p className="deemphasized">
              <i> Search In Field: </i>
            </p>
            {data?.columnModels
              ?.filter(this.isSupportedColumn)
              .map((el, index) => {
                const name = el.name
                const displayName = unCamelCase(el.name, facetAliases)
                const selectedColumn = this.state.columnName
                const isSelected =
                  (selectedColumn === '' && index === 0) ||
                  selectedColumn === name
                return (
                  <div className="radio">
                    <label>
                      <span>
                        <input
                          id={name}
                          type="radio"
                          value={name}
                          checked={isSelected}
                          onClick={() => {
                            this.setState({
                              columnName: name,
                            })
                          }}
                        />
                        <span>{displayName}</span>
                      </span>
                    </label>
                  </div>
                )
              })}
          </form>
        </div>
      </div>
    )
  }
}

export default Search
