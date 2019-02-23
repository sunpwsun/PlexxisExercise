import React, { Component } from 'react'
import AddEmployeeForm from '../AddEmployeeForm/AddEmployeeForm'
import NoticeModal from '../Modal/NoticeModal'
import axios from 'axios'
import './EmployeeButtons.css'
import { URL } from '../../config'


class Buttons extends Component {

    state = {
        addEmployeeForm : false,

        // notice modal
        modalIsOpen: false,
        modalTitle : '',
        modalMessage: ''
    }

    // open notice modal
    openModal = ( modalTitle, modalMessage, reload ) => {      
        this.setState({modalIsOpen: true, modalTitle, modalMessage, reload })
    }
      
     // close notice modal
    closeModal = ( title ) => {
        this.setState({modalIsOpen: false})
    }

    // show the adding employee form
    addEmployee = () => {
        this.setState({ addEmployeeForm : true })
        this.props.onHideEditBtn( true )
    }

    // Hide the adding employee form
    onHide = () => {
        this.setState({ addEmployeeForm : false })
    }

    deleteEmployee = async () => {

        let deleted = []
        for( let i = 0 ; i < this.props.selected.length ; i++ ) {
            if( this.props.selected[ i ] ) {

                await axios.delete( URL + '/api/employee/' + i ).then(res => {
            
                    if( res.data.message === 'DELETED' ) {
                        //this.openModal( 'Deleted', `Employee ID ${i} deleted!`)
                        console.log('Deleted', `Employee ID ${i} deleted!`)
                        deleted.push( i )
                    }
                    else {
                        throw res.data.message
                    }
                })
                .catch( err => {
                    this.openModal( 'ERROR', `${err}. Check again.`, false)
                })
            }
        }
        console.log('Deleted', deleted )

        // selected[ i ] = false
        let newSelected = [...this.props.selected]
        for( let i = 0 ; i < deleted.length ; i++ ) {
            newSelected[ deleted[i] ] = false
        }

        if( deleted.length > 0 ) {
    
            // successful popup message
            this.openModal( 'Deleted', `${deleted.length} Employee(s) deleted!`, true)
        }
    }

    render() {
        return(
            <div>
                {
                    !this.state.addEmployeeForm  && 
                    <div className='buttons' >
                        {
                            !this.props.hideAddBtn &&
                            <div className='addButton' onClick={this.addEmployee}>ADD</div>
                        }
                        {
                            this.props.showDeleteButton &&
                            <div className='deleteButton' onClick={this.deleteEmployee} >DELETE</div>
                        }
                    </div>
                }
                {
                    this.state.addEmployeeForm  &&
                    <AddEmployeeForm onHide={this.onHide} onHideEditBtn={this.props.onHideEditBtn}/>
                }
                
                <NoticeModal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    closeModal={this.closeModal}
                    title={this.state.modalTitle}
                    message={this.state.modalMessage}
                    reload={this.state.reload}
                    />
            </div>
        )
    }
}

export default Buttons