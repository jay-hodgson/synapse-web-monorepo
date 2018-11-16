// @ts-nocheck
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faSortAmountUp } from "@fortawesome/free-solid-svg-icons";
import { faSortAmountDown } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types'

// Add all icons to the library so you can use it in your page
library.add(faEllipsisV);
library.add(faSort);
library.add(faSortAmountUp);
library.add(faSortAmountDown);
library.add(faCheck);
library.add(faTimes);
library.add(faFilter);
library.add(faDatabase);

const cloneDeep = require("lodash.clonedeep");
// Hold constants for next and previous button actions
const NEXT = "NEXT";
const PREVIOUS = "PREVIOUS";
const SELECT_ALL = "SELECT_ALL";
const DESELECT_ALL = "DESELECT_ALL";
const ICON_STATE: ("sort-amount-down" | "sort-amount-up" | "sort-amount-down")[] = ["sort-amount-down", "sort-amount-up", "sort-amount-down"];
let SORT_STATE = ["", "ASC", "DESC"];

type Info = {
    index: number
    name: string
}

type SynapseTableState = {
    sortSelection: string[]
    offset: number
    isOpen: boolean
    isColumnSelected: boolean[]
    columnIconState: number[],
    isFilterSelected: boolean []
};

type SynapseTableProps = {
    visibleColumnCount?: number
    synapseId : string
    title: string
}

import {QueryWrapperChildProps} from './QueryWrapper'
import { FacetColumnResult, FacetColumnResultValueCount } from '../utils/jsonResponses/Table/FacetColumnResult';
import { SelectColumn } from '../utils/jsonResponses/Table/SelectColumn';
import { QueryBundleRequest } from '../utils/jsonResponses/Table/QueryBundleRequest';
import { FacetColumnRequest } from '../utils/jsonResponses/Table/FacetColumnRequest';

export default class SynapseTable extends React.Component<QueryWrapperChildProps & SynapseTableProps, SynapseTableState> {

    static propTypes = {
        visibleColumnCount: PropTypes.number,
        synapseId: PropTypes.string
    }

    constructor(props: QueryWrapperChildProps & SynapseTableProps) {
        super(props);
        this.handleColumnClick = this.handleColumnClick.bind(this);
        this.handlePaginationClick = this.handlePaginationClick.bind(this);
        this.findSelectionIndex = this.findSelectionIndex.bind(this);
        this.toggleColumnSelection = this.toggleColumnSelection.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.advancedSearch = this.advancedSearch.bind(this);
        this.download = this.download.bind(this);
        this.getLengthOfPropsData = this.getLengthOfPropsData.bind(this);
        this.configureFacetDropdown = this.configureFacetDropdown.bind(this)
        // store the offset and sorted selection that is currently held
        this.state = {
            sortSelection: [],
            offset: 0,
            isOpen: false,
            isColumnSelected: [],
            columnIconState: [],
            isFilterSelected: Array(100).fill(false)
        };
    }
    /**
     * Handle a click on next or previous
     *
     * @memberof SynapseTable
     */
    handlePaginationClick = (eventType: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        let queryRequest = this.props.getLastQueryRequest!();
        let currentOffset = queryRequest.query.offset!;
        // if its a "previous" click subtract from the offset
        // otherwise its next and we paginate forward
        if (eventType === PREVIOUS) {
            currentOffset -= 25;
        }
        if (eventType === NEXT) {
            currentOffset += 25;
        }
        queryRequest.query.offset = currentOffset;
        this.props.executeQueryRequest!(queryRequest);
    };
    /**
     * Handle a column having been selected
     *
     * @memberof SynapseTable
     */
    handleColumnClick = (dict: Info) => (event: React.MouseEvent<HTMLTableHeaderCellElement>) => {
        let columnIconState = cloneDeep(this.state.columnIconState);
        if (columnIconState.length === 0) {
            columnIconState = Array(this.getLengthOfPropsData()).fill(0);
        }
        // get currently sorted items and remove/insert this selection
        let sortSelection = cloneDeep(this.state.sortSelection);
        let index = this.findSelectionIndex(sortSelection, dict.name);
        if (index !== -1) {
            sortSelection.splice(index, 1);
        }
        columnIconState[dict.index] = (columnIconState[dict.index] + 1) % ICON_STATE.length;
        if (columnIconState[dict.index] > 0) {
            sortSelection.unshift({
                column: dict.name,
                direction: SORT_STATE[columnIconState[dict.index]]
            });
        }
        let queryRequest = this.props.getLastQueryRequest!();
        queryRequest.query.sort = sortSelection;
        this.props.executeQueryRequest!(queryRequest);
        this.setState({
            sortSelection,
            columnIconState
        });
    };
    /**
     * Utility to search through array of objects and find object with key "column"
     * equal to input parameter "name"
     *
     * @param {*} sortSelection
     * @param {*} name
     * @returns -1 if not present, otherwise the index of the object
     * @memberof SynapseTable
     */
    findSelectionIndex(sortSelection: any[], name: string) {
        if (sortSelection.length !== 0) {
            // find if the current selection exists already and remove it
            return sortSelection.findIndex(el => {
                return el.column === name;
            });
        }
        return -1;
    }

    // TODO: implement this method
    download() {
        return
    }

    // Direct user to synapse corresponding synapse table
    advancedSearch(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        let lastQueryRequest = this.props.getLastQueryRequest!();
        let { query } = lastQueryRequest;
        // base 64 encode the json of the query and go to url with the encoded object
        let encodedQuery = btoa(JSON.stringify(query));
        let synTable = this.props.synapseId;
        window.open(`https://www.synapse.org/#!Synapse:${synTable}/tables/query/${encodedQuery}`, "_blank")
    }
    /**
     * Handles the opening and closing of the column select menu, this method
     * is only necessary because react overrides the behavior that bootstrap
     * embeds in its menus
     *
     * @memberof SynapseTable
     */
    toggleDropdown() {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen });
    }

    getLengthOfPropsData() {
        const { data } = this.props;
        return data!.queryResult.queryResults.headers.length
    }
    /**
     * Handles the toggle of a column select, this will cause the table to
     * either show the column or hide depending on the prior state of the column
     *
     * @memberof SynapseTable
     */
    toggleColumnSelection = (index: number) => (event: React.MouseEvent<HTMLLIElement>) => {
        event.preventDefault();
        // lazily update the component with this information
        // this only runs once
        let isColumnSelected: boolean [];
        if (this.state.isColumnSelected.length === 0) {
            // unpack all the data
            let lengthOfPropsData = this.getLengthOfPropsData();
            let defaultSelection;
            // fill visibleColumnCount with true and the rest as false
            if (this.props.visibleColumnCount === 0) {
                // if set to zero then its all true
                defaultSelection = Array(lengthOfPropsData).fill(true);
            } else {
                defaultSelection = Array(this.props.visibleColumnCount).fill(true);
                defaultSelection.push(...Array(lengthOfPropsData - this.props.visibleColumnCount!).fill(false));
            }
            isColumnSelected = defaultSelection;
        } else {
            isColumnSelected = cloneDeep(this.state.isColumnSelected);
        }
        isColumnSelected[index] = !isColumnSelected[index];
        this.setState({ isColumnSelected });
    };


    /**
     *
     *
     * @param {number} index this is column index of the query table data
     * @param {string} columnName this is the name of the column
     * @param {FacetColumnResult[]} facetColumnResults
     * @param {number} facetIndex
     * @returns
     * @memberof SynapseTable
     */
    configureFacetDropdown(index: number, facetColumnResults: FacetColumnResult[], facetIndex:number) {

        // this grabs the specific facet selection
        let facetColumnResult = facetColumnResults[facetIndex]
        let columnName = facetColumnResult.columnName

        // this is related to whether we've selected this column or not
        let isFilterSelected = this.state.isFilterSelected[index]

        let toggleDropdown = (param?: any) => { 
            //  make param any for code re-use
            let isFilterSelectedDeepCopy = cloneDeep(this.state.isFilterSelected)
            isFilterSelectedDeepCopy[index] = !isFilterSelected
            this.setState(
                {
                    isFilterSelected: isFilterSelectedDeepCopy
                }
            )
        }

        let ref: React.RefObject<HTMLSpanElement> = React.createRef()

        // handle column selection
        let handleSelector = (selector? : string) => (event: React.SyntheticEvent<HTMLElement>) => { 
            for (let i = 0; i < ref.current!.children.length; i++) {
                let curElement = ref.current!.children[i] as HTMLLIElement
                let checkbox = curElement.children[0] as HTMLInputElement
                if (selector === SELECT_ALL) {
                    checkbox.checked = true
                } else {
                    checkbox.checked = false
                }
            }
        }

        let applyChanges = (event: React.SyntheticEvent<HTMLElement>) => { 
            let facetValues: string [] = []
            
            for (let i = 0; i < ref.current!.children.length; i++) {
                let curElement = ref.current!.children[i] as HTMLLIElement
                let checkbox = curElement.children[0] as HTMLInputElement
                let isSelected = checkbox.checked
                if (isSelected) {
                    facetValues.push(checkbox.value)
                }
            }

            let queryRequest: QueryBundleRequest = cloneDeep(this.props.getLastQueryRequest!())

            let selectedFacets: FacetColumnRequest [] = queryRequest.query.selectedFacets!

            // the facet index of the result and the request are the same
            let currentFacetRequest: FacetColumnRequest = {
                concreteType: "org.sagebionetworks.repo.model.table.FacetColumnValuesRequest",
                columnName,
                facetValues
            }

            let indexOfFacetInRequest = selectedFacets!.findIndex( el => {return el.columnName === columnName})

            if (indexOfFacetInRequest === -1) {
                queryRequest.query!.selectedFacets!.push(currentFacetRequest)
            } else {
                queryRequest.query!.selectedFacets![indexOfFacetInRequest] =  currentFacetRequest
            }

            this.props.executeQueryRequest!(queryRequest)
            toggleDropdown()
        }

        return (
            <span style={{marginRight: "10px"}} className={`btn-group pull-right ${isFilterSelected ? "open": ""}`}>
                <span  style={{padding: "4px"}} className={isFilterSelected ? "SRC-dark-background": ""} onClick={toggleDropdown}> 
                    <FontAwesomeIcon size={"1x"} className={isFilterSelected ? "SRC-dark-background": ""} color={isFilterSelected ? "white": ""} icon="filter"/> 
                </span>

                <div className="dropdown-menu dropdown-menu-right">
                    <ul style={{listStyleType: "none"}} className="scrollable">
                        <li> 
                            <div style={{borderBottomColor:"green", borderBottom: "1px solid"}}> 
                                <h3 style={{display: "inline-block"}}> {columnName} </h3>
                                <button className="btn pull-right" onClick={toggleDropdown}> 
                                    <FontAwesomeIcon size={"2x"} icon="times"/> 
                                </button>
                            </div> 
                        </li>
                        <br/>
                        <span ref={ref}>
                            {facetColumnResult.facetValues.map(
                                (dataPoint: FacetColumnResultValueCount) => {
                                    let idText = `${dataPoint.value}(${dataPoint.count})`
                                    let displayValue = dataPoint.value
                                    if (displayValue === "org.sagebionetworks.UNDEFINED_NULL_NOTSET") {
                                        displayValue = "unannotated"
                                    }
                                    return (
                                                <React.Fragment key={idText}>
                                                        <li>
                                                            <input defaultChecked={true} type="checkbox" value={dataPoint.value} id={idText}/>
                                                            <label htmlFor={idText}> {displayValue}&nbsp;&nbsp;({dataPoint.count}) </label>
                                                        </li>
                                                </React.Fragment>
                                            )
                                    }
                                )
                            }
                        </span>
                    </ul>
                    <br/>   
                    <div>
                        <button onClick={handleSelector(SELECT_ALL)} style={{marginLeft: "10px"}} className="btn btn-default"> All </button>
                        | 
                        <button onClick={handleSelector(DESELECT_ALL)} className="btn btn-default"> Clear </button>
                        <button onClick={applyChanges} className="btn btn-default pull-right"> APPLY </button>
                    </div>
                </div>
            </span>
        )

    }
    /**
     * Display the view
     */
    render() {
        if (this.props.data === undefined) {
            return false;
        }
        // unpack all the data
        const { data } = this.props;
        const { queryResult } = data;
        const { queryResults } = queryResult;
        const { rows } = queryResults;
        const { headers } = queryResults;

        const {facets} = data
        

        // Step 1: Format the column headers, we have to track a few variables --
        // whether the column should be shown by default or if the state now mandates it
        // be shown
        let headersFormatted = headers.map((column: SelectColumn, index: number) => {

            // two cases when rendering the column headers on init load
            // of the page we have to show only this.props.visibleColumnCount many
            // columns, afterwards we rely on the isColumnSelected to get choices
            let {visibleColumnCount = 0} = this.props
            let initRender: boolean = index < visibleColumnCount && this.state.isColumnSelected.length === 0
            initRender = initRender || (visibleColumnCount === 0 && this.state.isColumnSelected.length === 0)
            let subsequentRender = this.state.isColumnSelected[index] && this.state.isColumnSelected.length !== 0

            if (initRender || subsequentRender) {
                let isSelected: boolean = this.findSelectionIndex(this.state.sortSelection, column.name) !== -1; // for background color
                let columnIndex: number = this.state.columnIconState[index] === undefined ? 0: this.state.columnIconState[index] // for icon state
                
                // we have to figure out if the current column is a facet selection
                let facetIndex: number = facets.findIndex(
                                                (value: FacetColumnResult) => {
                                                    return value.columnName === column.name
                                                })
                let isFacetSelection: boolean = facetIndex !== -1

                return (
                    <th style={{minWidth: "140px"}} key={column.name} className={"SRC-hand-cursor " + (isSelected ? "SRC-salmon-background" : "")}>
                        <a style={{ color: "black" }} className={`padding-left-2 padding-right-2 ${isSelected ? "SRC-anchor-light" : ""}`}>
                            {column.name}
                            <span className="pull-right" onClick={this.handleColumnClick({ name: column.name, index })}> 
                                <FontAwesomeIcon className={`${isSelected ? "SRC-selected-table-icon" : "SRC-primary-text-color"}`} icon={ICON_STATE[columnIndex]}/> 
                            </span>
                            {isFacetSelection && this.configureFacetDropdown(index, facets, facetIndex)}
                        </a>
                    </th>
                );
            }
            // avoid eslint complaint below by returning undefined
            return undefined;
        });

        // Step 2: Format the row values, tracking the same information that the columns have to.
        // grab the row data and format it
        // e.g. <tr> <td> some value </td> </tr>
        let rowsFormatted: JSX.Element [] = [];
        rows.forEach((expRow: any, i: any) => {
            let rowFormatted = (
                <tr key={`(${expRow.rowId})`}>
                    {expRow.values.map( (value: string, j: number) => {
                        let columnName = headers[j].name;
                        let index = this.findSelectionIndex(this.state.sortSelection, columnName);
                        let {visibleColumnCount = 0} = this.props

                        // we have to check if this column is selected under initial load
                        // there are two cases:
                        // 1. If the user has just clicked on the screen, we should show the column if its within
                        // the limit of the rows specified
                        // 2. If the visibleColumnCount is not specified or set to zero AND there have not been any selections made
                        // then we don't show it
                        let isRowActiveInit: boolean = j < visibleColumnCount && this.state.isColumnSelected.length === 0;
                        isRowActiveInit = isRowActiveInit || (visibleColumnCount === 0 && this.state.isColumnSelected.length === 0);

                        // this is checking if the column is selected post load and interactions have taken place
                        let isRowActiveSubsequent = this.state.isColumnSelected.length !== 0 && this.state.isColumnSelected[j];
                        if (isRowActiveInit || isRowActiveSubsequent) {
                            return (
                                <td className="SRC_noBorderTop" key={`(${i},${j})`}>
                                    <p className={`${index === -1 ? "" : "SRC-boldText"}`}> {value} </p>
                                </td>
                            );
                        }
                        // avoid eslint complaint below by returning undefined
                        return undefined;
                    })}
                </tr>
            );
            rowsFormatted.push(rowFormatted);
        });
        // handle displaying the previous button -- if offset is zero then it
        // shouldn't be displayed
        let pastZero: boolean = this.props.getLastQueryRequest!().query.offset! > 0;
        let x_data: any[] = [];
        data.facets.forEach((item: any) => {
            if (item.facetType === "enumeration" && item.columnName === this.props.filter) {
                item.facetValues.forEach(
                    (facetValue: any) => {
                        if (item.columnName) {
                            x_data.push({ columnName: item.columnName, ...facetValue });
                        }
                });
            }
        });
        // edge case -- if they are all false then they are considered all true..
        // sum up the counts of data
        let anyTrue = false;
        let totalAllFalseCase = 0;
        let totalStandardCase = 0;
        for (let key in x_data) {
            if (x_data.hasOwnProperty(key)) {
                anyTrue = anyTrue || x_data[key].isSelected;
                totalAllFalseCase += x_data[key].count;
                totalStandardCase += x_data[key].isSelected ? x_data[key].count : 0;
            }
        }
        let total = anyTrue ? totalStandardCase : totalAllFalseCase;
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <span>
                            {!this.props.isLoading && <strong> Showing {this.props.showNothing ? 0 : total} Files </strong>}
                            <span className={this.props.isLoading ? "spinner" : ""} style={this.props.isLoading ? {} : { display: "none" }} />
                            {this.props.isLoading && <strong> &nbsp;&nbsp; Table results updating... </strong>}
                        </span>
                    </div>
                </div>
                <div style={{background: "#5BB0B5", display: "flex", padding: "3px", alignItems: "center"}}>
                    <h3 style={{margin: "0px", display: "inline-block", color: "white"}}> {this.props.title}</h3>
                    <span style={{marginLeft: "auto", marginRight: "10px"}}>
                        <span className={` dropdown ${this.state.isOpen ? "open" : ""}`}>
                            <span onClick={this.advancedSearch}><FontAwesomeIcon size="1x" color="white"  icon="database"/></span>
                            <span style={{marginLeft: "15px"}} className="dropdown-toggle" onClick={this.toggleDropdown} id="dropdownMenu1">
                                <FontAwesomeIcon color="white" icon="ellipsis-v" />
                            </span>
                            <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                {headers.map((header: any, index: number) => {
                                    let isColumnSelected: boolean | undefined = this.state.isColumnSelected[index];
                                    let {visibleColumnCount = 0} = this.props
                                    if (isColumnSelected === undefined) {
                                        isColumnSelected = (index < visibleColumnCount) || (visibleColumnCount === 0);
                                    }
                                    return (
                                        <li key={header.name} onClick={this.toggleColumnSelection(index)}>
                                            <a className="SRC-no-focus" href="">
                                                {isColumnSelected && <FontAwesomeIcon style={{marginRight: "10px", color : "green"}} icon="check"/>}
                                                {header.name}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </span>
                    </span>
                </div>
                <div className="container-fluid">
                    <div className="row SRC-overflowAuto">
                        <table className="table table-striped table-condensed">
                            <thead className="SRC_borderTop">
                                <tr>
                                    {headersFormatted.map((headerFormatted: any) => {
                                        return headerFormatted;
                                    })}
                                </tr>
                            </thead>

                            {!this.props.showNothing && (
                                <tbody>
                                    {rowsFormatted.map(rowFormatted => {
                                        return rowFormatted;
                                    })}
                                </tbody>
                            )}
                        </table>
                        {!this.props.showNothing &&
                            pastZero && (
                                <button onClick={this.handlePaginationClick(PREVIOUS)} className="btn btn-default SRC-table-button" type="button">
                                    Previous
                                </button>
                            )}
                        {!this.props.showNothing && (
                            <button onClick={this.handlePaginationClick(NEXT)} className="btn btn-default SRC-table-button" type="button">
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}