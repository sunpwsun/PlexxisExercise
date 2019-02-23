import React, { Component } from "react"
import TableMain from './TableMain'


class TableContainer extends Component {

    render() {
        
        return (
            <div className='App'>
                <TableMain 
                    infinite={false} 
                    onShowDeleteButton={this.props.onShowDeleteButton} 
                    onHideAddBtn={this.props.onHideAddBtn} 
                    hideEditBtn={this.props.hideEditBtn} 
                    onHideEditBtn={this.props.onHideEditBtn}
                />
            </div>
        )
    }
}

export default TableContainer