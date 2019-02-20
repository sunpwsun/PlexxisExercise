import React, { Component } from 'react'
import EditCityModal from '../Modal/EditCityModal'
import EditBranchModal from '../Modal/EditBranchModal'
import EditProfessionModal from '../Modal/EditProfessionModal'
import './CompanyButtons.css'

class CompanyButtons extends Component {

    state = {
       
        // edit modal
        modalCityIsOpen: false,         // type: 0
        modalBranchIsOpen: false,       // type: 1
        modalProfessionIsOpen: false,   // type: 2
        modalTitle : '',
        modalMessage: '',
        reload: false,
    }


    editCity = () => {
        this.openModal( 0, 'Edit Cities', '', false)
    }

    editBranch = () => {
        this.openModal( 1, 'Edit Branches', '', false)
    }

    editProfession = () => {
        this.openModal( 2, 'Edit Professions', '', false)
    }

    openModal = ( type, modalTitle, modalMessage, reload ) => { 
        if( type === 0)  
            this.setState({modalCityIsOpen: true, modalTitle, modalMessage, reload })
        if( type === 1)  
            this.setState({modalBranchIsOpen: true, modalTitle, modalMessage, reload })
        else
            this.setState({modalProfessionIsOpen: true, modalTitle, modalMessage, reload })
    }
      
    closeModal = ( type ) => {
        
        if( type === 0)  
            this.setState({ modalCityIsOpen: false })
        if( type === 1)  
            this.setState({modalBranchIsOpen: false })
        else
            this.setState({modalProfessionIsOpen: false })
    }

    render() {
        return(
            <div>
                <div className='companyButtons' >
                    <div className='professionBtn' onClick={this.editProfession}>Profession</div>
                    <div className='cityBtn' onClick={this.editCity} >City</div>
                    <div className='branchBtn' onClick={this.editBranch} >Branch</div>
                </div> 
  

                 
                <EditProfessionModal 
                    isOpen={this.state.modalProfessionIsOpen}
                    onRequestClose={()=>this.closeModal(2)}
                    closeModal={()=>this.closeModal(2)}
                    title={this.state.modalTitle}
                    message={this.state.modalMessage}
                    />
                <EditCityModal 
                    isOpen={this.state.modalCityIsOpen}
                    onRequestClose={()=>this.closeModal(0)}
                    closeModal={()=>this.closeModal(0)}
                    title={this.state.modalTitle}
                    message={this.state.modalMessage}
                    />

                <EditBranchModal 
                    isOpen={this.state.modalBranchIsOpen}
                    onRequestClose={()=>this.closeModal(1)}
                    closeModal={()=>this.closeModal(1)}
                    title={this.state.modalTitle}
                    message={this.state.modalMessage}
                    />


            </div>
        )
    }
}

export default CompanyButtons