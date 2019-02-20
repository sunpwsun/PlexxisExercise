import React, { useState, useEffect, useRef } from 'react'
import { useTableState } from "../../react-table"
import EditEmployeeForm from '../EditEmployeeForm/EditEmployeeForm'
import { Input } from '../Table/Styles'
import Table from '../Table/Table'
import axios from 'axios'
import ReactTooltip from 'react-tooltip'

const URL = 'http://localhost:8080'


// Simulate a server
const getServerData = async ({ filters, sortBy, pageSize, pageIndex }) => {

    let employees = []
    let cities = []
    let branches = []
    let professions = []

    await axios.get( URL + '/api/employees'  ).then( res => {
        console.log('[employees]', res.data)
        employees = res.data
    })
    await axios.get( URL + '/api/cities'  ).then( res => { 
        console.log('[cities]', res.data)
        cities = res.data
    })
    await axios.get( URL + '/api/branches'  ).then( res => {
        console.log('[branches]', res.data)
        branches = res.data
    })
    await axios.get( URL + '/api/professions'  ).then( res => {
        console.log('[professions]', res.data)
        professions = res.data
    })


    // Ideally, you would pass this info to the server, but we'll do it here for convenience
    const filtersArr = Object.entries(filters)

    // Get our base data
    //let rows = serverData(25)
    let rows = employees.map( d=> {

        return {
            select : d.employeeId,
            id: d.employeeId,
            name: d.name,
            code: d.code,
            profession: d.profession.name,
            professionId: d.professionId,
            professionActive: d.profession.active,
            color: d.color,
            city: d.city.name,
            cityId : d.cityId,
            cityActive: d.city.active,
            branch: d.branch.name,
            branchId: d.branchId,
            branchActive: d.branch.active,
            assigned: d.assigned ? 'true' : 'false',
            edit : d.employeeId,
        }
    })


    // Apply Filters
    if (filtersArr.length) {
        rows = rows.filter(row =>
            filtersArr.every(([key, value]) => row[key].includes(value))
        )
    }

    // Apply Sorting
    if (sortBy.length) {
        const [{ id, desc }] = sortBy
        rows = [...rows].sort(
            (a, b) => (a[id] > b[id] ? 1 : a[id] === b[id] ? 0 : -1) * (desc ? -1 : 1)
        )
    }

    // Get page counts
    const pageCount = Math.ceil(rows.length / pageSize)
    const rowStart = pageSize * pageIndex
    const rowEnd = rowStart + pageSize

    // Get the current page
    rows = rows.slice(rowStart, rowEnd)

    return {
        rows,
        pageCount,
    }
}


const initSelected = new Array(1000).fill(false)


export default function({ infinite, onShowDeleteButton, hideAddBtn, hideEditBtn }) {

    // define state
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const currentRequestRef = useRef()  
    const [ selected, setSelected ] = useState( initSelected )
    const [ editCellId, setEditCellId ] = useState( 0 )
    const [ rowsInPage, setRowsInPage ] = useState( [] )

    // makes table columns
    const columns = [

        {
            Header: '',
            accessor: 'select',
            minWidth: 35,
            maxWidth: 35,
            Cell: row => (
                <div>
                    {
                        editCellId < 1 &&
                            <input type='checkbox' onChange={ (e)=> { 
                                const newSelected = [...selected]
                                newSelected[ row.value ] = !newSelected[ row.value ]

                                checkAllUnselected( newSelected )
                                setSelected( newSelected )
                                
                                }}
                                checked={selected[ row.value ]}
                            />
                    }
                </div>
            )
        },
        {
            Header: () => (<div style={{textAlign:'center'}}>ID</div>),
            accessor: 'id',
            minWidth: 50,
            maxWidth: 60,
            Cell : row => (<div style={{textAlign:'right'}}>{row.value}</div>)
        },
        {
            Header: 'Name',
            accessor: 'name',
            minWidth: 220,
            maxWidth: 300,
            Filter: header => {
                return (
                <Input
                    placeholder='Search...  eg. "John"...'
                    value={header.filterValue || ""}
                    onChange={e => header.setFilter(e.target.value)}
                />
                );
            }
        },
        {
            Header: 'Code',
            // id: "code",
            accessor: 'code',
            minWidth: 100,
            maxWidth: 140,
            Cell: row => (
                <div style={{textAlign:'center'}} >{row.value}</div>
            )
        },
        {
            Header: "Profession",
            accessor: "profession",
            minWidth: 160,
            maxWidth: 200,
        },


        {
            Header: "Color",
            accessor: "color",
            width: 130,
            Cell: row => (
                <div>
                    <div data-tip data-for='`${row.value}`'
                        style={{
                            width: `100%`,
                            minWidth: "5px",
                            height: "20px",
                            // backgroundColor: `hsla(${row.value}, 100%, 45%, 1)`,
                            backgroundColor: `${row.value}`,
                            color : `${row.value}`,
                            borderRadius: "2px",
                            transition: "all .4s ease"
                        }}
                    >
                    {row.value}
                    </div>
 
                </div>
            )
        },
        {
            Header: "City",
            accessor: "city",
            aggregate: "average",
            minWidth: 100,
            maxWidth: 180,
        },
        {
            Header: "Branch",
            accessor: "branch",
            minWidth: 100,
            maxWidth: 180,
        },
        {
            Header: "Assigned",
            accessor: "assigned",
            width: 100,
            Cell : row => (
                row.value === 'true' ?
                <img style={{paddingLeft:30}} width='20%' alt='true' src={`../images/true_icon.png` } />
                :
                <img style={{paddingLeft:30}} width='20%' alt='false' src={`../images/false_icon.png` } />
            )
        },
        {
            Header: "Edit",
            accessor: "edit",
            width: 50, 
            Cell : row => (
                <div>{
                    ( editCellId < 1  && !hideEditBtn ) &&
                        <div className='editButton' onClick={()=>{
                            setEditCellId( row.value )
                            hideAddBtn(true)
                        }}>Edit</div>
                    }
                </div>
            )
        },
    ]


    function checkAllUnselected( newSelected ) {
        
        for( let i = 0 ; i < newSelected.length ; i++ ) {
            if( newSelected[ i ] ) {
                onShowDeleteButton( true, newSelected )
                return
            }
        }
        onShowDeleteButton( false )
    }



    // Make a new controllable table state instance
    const state = useTableState({ pageCount: 0 })
  
    const [{ sortBy, filters, pageIndex, pageSize }, setState] = state
  
    const fetchData = async () => {

        setLoading(true)
    
        // We can use a ref to disregard any outdated requests
        const id = Date.now()
        currentRequestRef.current = id
    
        // Call our server for the data
        const { rows, pageCount } = await getServerData({
            filters,
            sortBy,
            pageSize,
            pageIndex,
        })

        // If this is an outdated request, disregard the results
        if (currentRequestRef.current !== id) {
            return
        }
  
        // Set the data and pageCount
        setData(rows)
        setState(old => ({
            ...old,
            pageCount
        }))
    
        setLoading(false)


   
    }
  
    // When sorting, filters, pageSize, or pageIndex change, fetch new data
    useEffect(
        () => {
            fetchData()
        },
        [sortBy, filters, pageIndex, pageSize]
    )
  

    function onHideEditForm() {
        setEditCellId( 0 )
    }


    return (
        <div>
            {
                editCellId > 0 &&
                <EditEmployeeForm data={data} editCellId={editCellId} onHide={onHideEditForm} hideAddBtn={hideAddBtn}/>
            }
            <Table
                {...{
                    data,
                    columns,
                    infinite,
                    state, // Pass the state to the table
                    loading,
                    manualSorting: true, // Manual sorting
                    manualFilters: true, // Manual filters
                    manualPagination: true, // Manual pagination
                    disableMultiSort: true, // Disable multi-sort
                    disableGrouping: true, // Disable grouping
                    debug: true,

                    editCellId       
                }}
            />
        </div>
    )
}