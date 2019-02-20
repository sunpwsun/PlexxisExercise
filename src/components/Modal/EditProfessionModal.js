import React, { Component } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import ToggleButton from 'react-toggle-button'
import ErrorModal from './ErrorModal'

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

Modal.setAppElement("#root");

const URL = 'http://localhost:8080'




class EditProfessionModal extends Component {
 
    state = {

        cities : [],
        branches : [],
        professions : [],

        rows : [],
        active : [],
        professionName : '',

        // info, error modal
        modalIsOpen: false,
        modalTitle : '',
        modalMessage: '',
        reload: false,
    }

    onProfessionChange = (e) => {

        this.setState({
            ...this.state,
            professionName: e.target.value
        })
    }

    onAddProfession = async () => {


        // check input is empty
        if( !this.state.professionName || this.state.professionName.length <= 0 ) {

            // popup message
            this.openModal( 'Error', 'Input profession name!', false)
            return
        }


        // remove frnt and back blanks
        const name = this.state.professionName.trim()

        this.setState({
            ...this.state,
            professionName: name
        })

        // name length must be longer than three
        if( name.length < 3 ) {

            // popup message
            this.openModal( 'Error', 'Length of Name must be longer than three!', false)
            return
        }


        // check duplicated name
        if( this.state.professions.findIndex( c=>c.name === name) > -1 ) {

            // popup message
            this.openModal( 'Error', 'Duplicated. Use another name', false)
            return
        }


        // save
        await axios.post( URL + '/api/profession', { name, active:true } )
            .then(res => {

                if( res.data.message !== 'OK') {
                    this.openModal( 'Error', res.data.message.errors[0].message, false)
                    return
                }
            })
            .catch( err => {
                this.openModal( 'Error', err , false)
                return
            })


        this.openModal( 'Profession Added', `Profession '${name}' was successfully added.`, false )
        

        // fetch updated professions
        await axios.get( URL + '/api/professions'  ).then( res => { 
            //console.log('[edit modal professions]', res.data)
            this.setState( { professions : res.data, professionName : '' } )
        })

    

    }

    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    toggleSwitch = async ( i, value ) => {

        // update toggle value
        await axios.put( URL + '/api/profession/' + this.state.professions[ i ].professionId, {name: this.state.professions[ i ].name, active : !this.state.professions[ i ].active })
            .then(res => {

                if( res.data.message !== 'OK') {
                    this.openModal( 'Error', 'Updata Error! Try again.', false)
                    return
                }
            })
            .catch( err => {
                this.openModal( 'Error', err , false)
                return
            })

        // fetch updated professions
        await axios.get( URL + '/api/professions'  ).then( res => { 
            //console.log('[edit modal professions]', res.data)
            this.setState( { professions : res.data, professionName : null } )
        })
    }

    openModal = ( modalTitle, modalMessage, reload ) => {      
        this.setState({modalIsOpen: true, modalTitle, modalMessage, reload })
    }
    
    closeModal = ( title ) => {
        this.setState({modalIsOpen: false})

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

        await axios.get( URL + '/api/professions'  ).then( res => { 
            console.log('[edit modal professions]', res.data)
            this.setState( { professions : res.data } )
        })

        let active = []
        for( let i = 0 ; i < this.state.professions.length ; i++ ) {
            active[ i ] = this.state.professions[ i ].active
        }
        this.setState({
            ...this.setState,
            active
        })
    }

    render() {

        let rows = []
        rows.push(
            <div className='rowHeader' style={{color:'black'}}>
                <div style={{textAlign:'center'}}>Name</div>
                <div style={{textAlign:'center'}}>Active</div>
            </div>
        )
        for( let i = 0 ; i < this.state.professions.length ; i++ ) {
            rows.push(
                <div className='rowContainer'>
                    <div className='rowName'>{this.state.professions[ i ].name}</div>
                    <div className='switch' >
                        <ToggleButton
                            value={ this.state.professions[ i ].active }
                            onToggle={(value) => this.toggleSwitch(i, value)} />
                    </div>
                </div>
            )
        }


        return(
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    onAfterOpen={this.afterOpenModal}
                    // onRequestClose={this.props.onRequestClose}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle}>{this.props.title}</h2>
                    <hr />
                    {rows}
                    <br />
                    
                    <div className='cityInputForm rowContainer' >
                        <input className='inputText' type='text' placeholder='Profession' value={this.state.professionName} onChange={this.onProfessionChange}/>
                        <div className='addBtn' onClick={this.onAddProfession}>ADD</div>
                    </div>
                    <br />
                    <div className='modalCloseBtn' onClick={() => this.props.closeModal(`${this.props.title}`)}>Close</div>
                </Modal>

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

export default EditProfessionModal