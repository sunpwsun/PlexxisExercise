import React, { Component } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import ToggleButton from 'react-toggle-button'
import NoticeModal from './NoticeModal'
import { URL } from '../../config'

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
}

Modal.setAppElement("#root")



class EditBranchModal extends Component {
 
    state = {

        branches : [],

        rows : [],
        active : [],
        branchName : '',

        // info, error modal
        modalIsOpen: false,
        modalTitle : '',
        modalMessage: '',
        reload: false,
    }

    onBranchChange = (e) => {

        this.setState({
            branchName: e.target.value
        })
    }

    onAddBranch = async () => {


        // check input is empty
        if( !this.state.branchName || this.state.branchName.length <= 0 ) {

            // popup message
            this.openModal( 'Error', 'Input branch name!', false)
            return
        }


        // remove front and back blanks
        const name = this.state.branchName.trim()

        this.setState({
            branchName: name
        })

        // name length must be longer than three
        if( name.length < 3 ) {

            // popup message
            this.openModal( 'Error', 'Length of Name must be longer than three!', false)
            return
        }


        // check duplicated name
        if( this.state.branches.findIndex( c=>c.name === name) > -1 ) {

            // popup message
            this.openModal( 'Error', 'Duplicated. Use another name', false)
            return
        }


        // save the new city
        await axios.post( URL + '/api/branch', { name, active:true } )
            .then(res => {

                if( res.data.message !== 'OK') {
                    this.openModal( 'Error', res.data.message.errors[0].message, false)
                }
                else 
                    // Success pop-up 
                    this.openModal( 'Branch Added', `Branch '${name}' was successfully added.`, false )
            })
            .catch( err => {
                this.openModal( 'Error', `ID: ${this.state.branchName}, ${err.response.data.message}` , false)
            })

        // fetch updated branches
        await axios.get( URL + '/api/branches'  ).then( res => { 
            this.setState( { branches : res.data, branchName : '' } )
        })
    }

    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    toggleSwitch = async ( i ) => {

        // update toggle value
        await axios.put( URL + '/api/branch/' + this.state.branches[ i ].branchId, {name: this.state.branches[ i ].name, active : !this.state.branches[ i ].active })
            .then(res => {

                if( res.data.message !== 'OK') {
                    this.openModal( 'Error', 'Updata Error! Try again.', false)
                }
            })
            .catch( err => {
                this.openModal( 'Error', `Branch : ${this.state.branches[ i ].name}, ${err.response.data.message}` , false)
            })

        // fetch updated branches
        await axios.get( URL + '/api/branches'  ).then( res => { 
            //console.log('[edit modal branches]', res.data)
            this.setState( { branches : res.data, branchName : null } )
        })
    }

    openModal = ( modalTitle, modalMessage, reload ) => {      
        this.setState({modalIsOpen: true, modalTitle, modalMessage, reload })
    }
    
    closeModal = ( title ) => {

        this.setState({
            modalIsOpen: false
        })

        // close the employee add form
        if( title === 'Employee Added' ) {
            this.props.onHide()
        }
    }

    onCancel = () => {
        this.props.onHide()
        this.props.hideEditBtn(false)
    }

    componentDidMount = async () => {

        await axios.get( URL + '/api/branches'  ).then( res => { 
            console.log('[edit modal branches]', res.data)
            this.setState( { branches : res.data } )
        })

        let active = []
        for( let i = 0 ; i < this.state.branches.length ; i++ ) {
            active[ i ] = this.state.branches[ i ].active
        }
        this.setState({
            active
        })
    }

    render() {

        // build branch list
        let rows = []
        rows.push(
            <div className='rowHeader' style={{color:'black'}}>
                <div style={{textAlign:'center'}}>Name</div>
                <div style={{textAlign:'center'}}>Active</div>
            </div>
        )
        for( let i = 0 ; i < this.state.branches.length ; i++ ) {
            rows.push(
                <div className='rowContainer' >
                    <div className='rowName'>{this.state.branches[ i ].name}</div>
                    <div className='switch' >
                        <ToggleButton
                            value={ this.state.branches[ i ].active }
                            onToggle={() => this.toggleSwitch( i )} />
                    </div>
                </div>
            )
        }


        return(
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    onAfterOpen={this.afterOpenModal}
                    style={customStyles}
                    contentLabel='BranchModal'
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle}>{this.props.title}</h2>
                    <hr />
                    {rows}
                    <br />
                    
                    <div className='cityInputForm rowContainer' >
                        <input className='inputText' type='text' placeholder='Branch' value={this.state.branchName} onChange={this.onBranchChange}/>
                        <div className='addBtn' onClick={this.onAddBranch}>ADD</div>
                    </div>
                    <br />
                    <div className='modalCloseBtn' onClick={() => this.props.closeModal(`${this.props.title}`)}>Close</div>
                </Modal>

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

export default EditBranchModal