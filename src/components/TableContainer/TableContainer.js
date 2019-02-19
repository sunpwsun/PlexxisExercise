import React, { Component, useState } from "react"
import ReactDOM from "react-dom"
import styled from 'styled-components'
import { Select } from '../Table/Styles'
import TableMain from './TableMain'


class TableContainer extends Component {

    render() {
        
        return (
            <div className='App'>
                <TableMain infinite={false} onShowDeleteButton={this.props.onShowDeleteButton} hideAddBtn={this.props.hideAddBtn} hideEditBtn={this.props.hideEditBtn} />
            </div>
        )
    }
}

export default TableContainer