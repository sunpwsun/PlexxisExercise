import React, { Component } from 'react'
import Modal from 'react-modal'
import './EditModal.css'
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


class EditCityModal extends Component {
 
    state = {

        cities : [],

        rows : [],
        active : [],
        cityName : '',

        // info, error modal
        modalIsOpen: false,
        modalTitle : '',
        modalMessage: '',
        reload: false,
    }

    onCityChange = (e) => {

        this.setState({
            cityName: e.target.value
        })
    }

    onAddCity = async () => {


        // check input is empty
        if( !this.state.cityName || this.state.cityName.length <= 0 ) {

            // popup message
            this.openModal( 'Error', 'Input city name!', false)
            return
        }


        // remove front and back blanks
        const name = this.state.cityName.trim()

        this.setState({
            cityName: name
        })

        // name length must be longer than three
        if( name.length < 3 ) {

            // popup message
            this.openModal( 'Error', 'Length of Name must be longer than three!', false)
            return
        }


        // check duplicated name
        if( this.state.cities.findIndex( c=>c.name === name) > -1 ) {

            // popup message
            this.openModal( 'Error', 'Duplicated. Use another name', false)
            return
        }

        // save the new city
        await axios.post( URL + '/api/city', { name, active:true } )
            .then(res => {

                if( res.data.message !== 'OK') {
                    this.openModal( 'Error', res.data.message.errors[0].message, false)
                }
                else 
                    // Success pop-up 
                    this.openModal( 'City Added', `City '${name}' was successfully added.`, false )
            })
            .catch( err => {
                this.openModal( 'Error', `ID: ${this.state.cityName}, ${err.response.data.message}` , false)
                return
            })


        // fetch updated cities
        await axios.get( URL + '/api/cities'  ).then( res => { 
            this.setState( { cities : res.data, cityName : '' } )
        })
    }

    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00'
    }

    toggleSwitch = async ( i ) => {
      
        // update toggle value
        await axios.put( URL + '/api/city/' + this.state.cities[ i ].cityId, {name: this.state.cities[ i ].name, active : !this.state.cities[ i ].active })
            .then(res => {
                if( res.data.message !== 'OK') {
                    this.openModal( 'Error', 'Updata Error! Try again.', false)
                }
            })
            .catch( err => {
                this.openModal( 'Error', `City : ${this.state.cities[ i ].name}, ${err.response.data.message}` , false)
            })

        // fetch updated cities
        await axios.get( URL + '/api/cities'  ).then( res => { 
            this.setState( { cities : res.data, cityName : null } )
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

        await axios.get( URL + '/api/cities'  ).then( res => { 
            console.log('[edit modal cities]', res.data)
            this.setState( { cities : res.data } )
        })

        let active = []
        for( let i = 0 ; i < this.state.cities.length ; i++ ) {
            active[ i ] = this.state.cities[ i ].active
        }
        this.setState({
            active
        })
    }

    render() {
        
        // build city list
        let rows = []
        rows.push(
            <div className='rowHeader' style={{color:'black'}} >
                <div style={{textAlign:'center'}}>Name</div>
                <div style={{textAlign:'center'}}>Active</div>
            </div>
        )
        for( let i = 0 ; i < this.state.cities.length ; i++ ) {
            rows.push(
                <div className='rowContainer'  >
                    <div className='rowName'>{this.state.cities[ i ].name}</div>
                    <div className='switch' >
                        <ToggleButton
                            value={ this.state.cities[ i ].active }
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
                    contentLabel='CityModal'
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle}>{this.props.title}</h2>
                    <hr />
                    {rows}
                    <br />
                    
                    <div className='cityInputForm rowContainer' >
                        <input className='inputText' type='text' placeholder='City' value={this.state.cityName} onChange={this.onCityChange}/>
                        <div className='addBtn' onClick={this.onAddCity}>ADD</div>
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

export default EditCityModal