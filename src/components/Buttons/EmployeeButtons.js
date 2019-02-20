import React, { Component } from 'react'
import AddEmployeeForm from '../AddEmployeeForm/AddEmployeeForm'
import ErrorModal from '../Modal/ErrorModal'
import axios from 'axios'
import './EmployeeButtons.css'


const URL = 'http://localhost:8080'

class Buttons extends Component {

    state = {
        addEmployeeForm : false,

        // modal
        modalIsOpen: false,
        modalTitle : '',
        modalMessage: ''
    }

    openModal = ( modalTitle, modalMessage, reload ) => {      
        this.setState({modalIsOpen: true, modalTitle, modalMessage, reload })
    }
      
    closeModal = ( title ) => {
        this.setState({modalIsOpen: false})
    }


    addEmployee = () => {
        this.setState({ addEmployeeForm : true })
        this.props.hideEditBtn( true )
    }

    onHide = () => {
        this.setState({ addEmployeeForm : false })
    }

    deleteEmployee = async () => {


        // ask if really want to delete



        let deleted = []
        for( let i = 0 ; i < this.props.selected.length ; i++ ) {
            if( this.props.selected[ i ] ) {

                await axios.delete( URL + '/api/employee/' + i ).then(res => {
            
                    // successful popup message
                  
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

        console.log('newSelected', newSelected )

        if( deleted.length > 0 ) {
    
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
                    <AddEmployeeForm onHide={this.onHide} hideEditBtn={this.props.hideEditBtn}/>
                       
                }
                
                <ErrorModal
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