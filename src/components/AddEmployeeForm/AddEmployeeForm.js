import React, { Component } from 'react'
import NoticeModal from '../Modal/NoticeModal'
import './AddEmployeeForm.css'
import * as tools from '../../tools'
import { URL } from '../../config'
import axios from 'axios'

class AddEmployeeForm extends Component {

    state = {
        addEmployeeForm : false,
        cities : [],
        branches : [],
        professions : [],

        // input employee form
        name : '',
        code : '',
        color : '',
        professionId : 0,
        cityId : 0,
        branchId : 0,
        assigned : 0,

        // modal
        modalIsOpen: false,
        modalTitle : '',
        modalMessage: '',
        reload : false,
    }

    addEmployee = () => {
        this.setState({ addEmployeeForm : true })
    }

    componentDidMount = async () => {

        await axios.get( URL + '/api/cities'  ).then( res => { 
            console.log('[cities]', res.data)
            this.setState( { cities : res.data } )
        })
        await axios.get( URL + '/api/branches'  ).then( res => {
            console.log('[branches]', res.data)
            this.setState( { branches : res.data } )
        })
        await axios.get( URL + '/api/professions'  ).then( res => {
            console.log('[professions]', res.data)
            this.setState( { professions : res.data } )
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
        this.props.onHideEditBtn(false)
    }

    onAddEmployee = async () => {

        // remove blanks at front and back of name, color, code
        this.setState( { 
            name: this.state.name.trim(),
            color : this.state.color.trim().toLocaleLowerCase(),
            code : this.state.code.trim()
        })
        const { name, code, professionId, color, cityId, branchId, assigned } = this.state

        // validate name
        if( name.trim().length < 4 ) {
            this.openModal( 'Error', 'Length of Name must be longer than Four!', false)
            return
        }

        // validate code
        if( code.length !== 4 ) {
            this.openModal( 'Error', 'Length of Code must be Four!', false)
            return
        }
        if( !/^([A-Z0-9]{4})$/.test( code )) {
            this.openModal( 'Error', 'Code accepts only alphabets or numbers!', false)
            return
        }

        // validate color
        //      #00AA56, #A1FFFF, ...
        let _color = this.state.color.trim()
        if( _color.charAt( 0 ) === '#' ) {
            if(   !/^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test( _color )  ) {
                this.openModal( 'Error', `${_color}. Wrong Color Expression!`, false)
                return
            }
        }
        else {      // white, yellow, red, ....
            if( tools.colorNames.findIndex( c => c === _color.toLocaleLowerCase() ) < 0 ) {
                this.openModal( 'Error', `${_color}. No matched Color!`, false)
                return
            }
        }

        // validate profession
        if( professionId < 1 ) {
            this.openModal( 'Error', 'Choose Profession!', false)
            return
        }

        // validate city
        if( cityId < 1 ) {
            this.openModal( 'Error', 'Choose City!', false)
            return
        }

        // validate branch
        if( branchId < 1 ) {
            this.openModal( 'Error', 'Choose Branch!', false)
            return
        }

        // validate assigned
        if( assigned < 1 ) {
            this.openModal( 'Error', 'Choose Assigned!', false)
            return
        }

        // if all is valid, save it
        const _assigned = assigned === 'true' ? true : false
        await axios.post( URL + '/api/employee', { name, code, professionId, color, cityId, branchId, assigned: _assigned } )
            .then(res => {
                if( res.data.message !== 'OK')
                    this.openModal( 'Error', res.data.message.errors[0].message, false)
                else 
                    // Success pop-up 
                    this.openModal( 'Employee Added', `New employee '${name}' was successfully added.`, true)
            })
            .catch( err => {    
                this.openModal( 'Error', `ID: ${this.state.editEmployeeId}, ${err.response.data.message}` , false)
            })
    }

    onNameChange = (e) => {     
        this.setState({
            name: e.target.value
        })
    }

    onCodeChange = (e) => {

        // change all the characters to upper case
        const v = e.target.value.toUpperCase()
    
        // length of code must be 4 characters
        if( v.length > 4 )
            return

        this.setState({
            code: v
        })
    }

    onColorChange = (e) => {
        this.setState({
            color : e.target.value
        })
    }
    onProfessionChange = (v) => {
        this.setState({
            professionId : v
        })
    }
    onAssignedChange= (e) => {
        this.setState({
            assigned : e.target.value
        })
    }
    onCityChange = (e) => {
        this.setState({
            cityId : e.target.value
        })
    }
    onBranchChange= (e) => {
        this.setState({
            branchId : e.target.value
        })
    }


    render() {

        const { professions, cities, branches } = this.state

        // Profession combobox
        let professionSelect = []
        professionSelect[0] = ( <option disabled selected>Profession</option> )
        professions.forEach( p => {
            if( !p.active )
                return

            professionSelect[ p.professionId ] = ( <option value={p.professionId} >{p.name}</option>  )
        })


        // City profession
        let citySelect = []
        citySelect[0] = ( <option disabled selected>City</option> )
        cities.forEach( c => {
            if( !c.active )
                return
            citySelect[ c.cityId ] = ( <option value={c.cityId} >{c.name}</option>  )
        })

        // Branch profession
        let branchSelect = []
        branchSelect[0] = ( <option disabled selected>Branch</option> )
        branches.forEach( b => {
            if( !b.active )
                return
            branchSelect[ b.branchId ] = ( <option value={b.branchId} >{b.name}</option>  )
        })


        return(
            <div className='addEmployeeForm'>

                <div className='grid-container'>
            
                    <div className='cell' onChange={this.onNameChange}>
                        <input className='inputText' type='text' placeholder='Name' value={this.state.name}/>
                    </div>
                    <div className='cell' onChange={this.onCodeChange}>
                        <input className='inputText' type='text' placeholder='Code' value={this.state.code}/>
                    </div>
                    <div className='cell'>
                        <select className='Select' onChange={(e)=>this.onProfessionChange(e.target.value)}>
                            {professionSelect}
                        </select></div>
                    <div className='cell' onChange={this.onColorChange}>
                        <input className='inputText' type='text' placeholder='Color' value={this.state.color}/>
                    </div>
                    <div className='cell'>
                        <select className='Select' onChange={this.onCityChange}>
                            {citySelect}
                        </select></div>
                        <div className='cell'>
                        <select className='Select' onChange={this.onBranchChange}>
                            {branchSelect}
                        </select></div>
                    <div className='cell'>
                        <select className='Select' onChange={this.onAssignedChange}>
                            <option disabled selected>Assigned</option>
                            <option  value="true">Yes</option>
                            <option  value="false">No</option>
                        </select></div>
                    <div className='btnContainer'>
                        <div></div>
                        <div className='btnAdd' onClick={this.onAddEmployee}>Add</div>
                        <div className='btnCancel' onClick={this.onCancel}>Cancel</div>
                    </div>
                    
                </div> 

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

export default AddEmployeeForm