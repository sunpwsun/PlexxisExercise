import React, { Component } from 'react'
import EditCityModal from '../Modal/EditCityModal'
import EditBranchModal from '../Modal/EditBranchModal'
import EditProfessionModal from '../Modal/EditProfessionModal'
import './CompanyButtons.css'

class CompanyButtons extends Component {

    state = {
       
        // edit modal
        modalCityIsOpen: false,       
        modalBranchIsOpen: false,      
        modalProfessionIsOpen: false,  
        modalTitle : '',
        modalMessage: '',
        reload: false,
    }

    openProfessionModal = ( modalTitle, modalMessage, reload ) => this.setState({modalProfessionIsOpen: true, modalTitle, modalMessage, reload })
    openCityModal = ( modalTitle, modalMessage, reload ) => this.setState({modalCityIsOpen: true, modalTitle, modalMessage, reload })
    openBranchModal = ( modalTitle, modalMessage, reload ) => this.setState({modalBranchIsOpen: true, modalTitle, modalMessage, reload })
    closeProfessionModal = () => this.setState({modalProfessionIsOpen: false })
    closeCityModal = () => this.setState({modalCityIsOpen: false })
    closeBranchModal = () => this.setState({modalBranchIsOpen: false })

    render() {
        return(
            <div>
                <div className='companyButtons' >
                    <div className='professionBtn' onClick={()=>this.openProfessionModal('Edit Profession', '', false)}>Profession</div>
                    <div className='cityBtn' onClick={()=>this.openCityModal('Edit Cities', '', false)} >City</div>
                    <div className='branchBtn' onClick={()=>this.openBranchModal('Edit Branches', '', false)} >Branch</div>
                </div> 
  

                 
                <EditProfessionModal 
                    isOpen={this.state.modalProfessionIsOpen}
                    onRequestClose={this.closeProfessionModal}
                    closeModal={this.closeProfessionModal}
                    title={this.state.modalTitle}
                    message={this.state.modalMessage}
                    />
                <EditCityModal 
                    isOpen={this.state.modalCityIsOpen}
                    onRequestClose={this.closeCityModal}
                    closeModal={this.closeCityModal}
                    title={this.state.modalTitle}
                    message={this.state.modalMessage}
                    />

                <EditBranchModal 
                    isOpen={this.state.modalBranchIsOpen}
                    onRequestClose={this.closeBranchModal}
                    closeModal={this.closeBranchModal}
                    title={this.state.modalTitle}
                    message={this.state.modalMessage}
                    />


            </div>
        )
    }
}

export default CompanyButtons