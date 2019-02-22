import React, { Component } from 'react'
import ErrorModal from '../Modal/ErrorModal'
import './EditEmployeeForm.css'
import * as tools from '../../tools'

import axios from 'axios'

const styles = {
    wrapper: {
        height: '100vh',
        width: '80%',
        margin: '0 auto'
    },
    header: {},
    content: {
        paddingTop: '20px',
        paddingBottom: '300px'
    }
}

const URL = 'http://localhost:8080'


class EditEmployeeForm extends Component {

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


        professionSelect : [],
        citySelect : [],
        branchSelect : [],
        assignedSelect  : [],
        editEmployeeId : 0,

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


        const { data, editCellId } = this.props
        //console.log('[data, editCellId]', data, editCellId )
        
        const index = data.findIndex( d => d.id === editCellId)
     




        let professionSelect = []
        professionSelect[0] = ( <option disabled>Profession</option> )
        this.state.professions.forEach( p => {
            if( !p.active )
                return
            if( data[ index ].professionId === p.professionId )
                professionSelect[ p.professionId ] = ( <option selected value={p.professionId} >{p.name}</option> )
            else
                professionSelect[ p.professionId ] = ( <option value={p.professionId} >{p.name}</option> )
        })

        let citySelect = []
        citySelect[0] = ( <option disabled>City</option> )
        this.state.cities.forEach( c => {

            if( !c.active )
                return

            if( data[ index ].cityId === c.cityId )
                citySelect[ c.cityId ] = ( <option selected value={c.cityId} >{c.name}</option>  )
            else 
                citySelect[ c.cityId ] = ( <option value={c.cityId} >{c.name}</option>  )
        })


        let branchSelect = []
        branchSelect[0] = ( <option disabled>Branch</option> )
        this.state.branches.forEach( b => {
            if( !b.active )
                return

            if( data[ index ].branchId === b.branchId )
                branchSelect[ b.branchId ] = ( <option selected value={b.branchId} >{b.name}</option>  )
            else
                branchSelect[ b.branchId ] = ( <option value={b.branchId} >{b.name}</option>  )
        })


        let assignedSelect = []
        assignedSelect[0] = ( <option disabled>Assigned</option> )   

        if( 'true' === data[ index ].assigned ) {
            assignedSelect[1] = ( <option selected value="true">Yes</option> )
            assignedSelect[2] = ( <option  value="false">No</option> )
        }
        else {     
            assignedSelect[1] = ( <option  value="true">Yes</option> )
            assignedSelect[2] = ( <option selected value="false">No</option> )
        }


console.log( '[assignedSelect]' , assignedSelect)


        this.setState({
            name : data[ index ].name,
            code : data[ index ].code,
            professionId : data[ index ].professionId,
            color : data[ index ].color,
            cityId : data[ index ].cityId,
            branchId : data[ index ].branchId,
            assigned : data[ index ].assigned,
            professionSelect,
            citySelect,
            branchSelect,
            assignedSelect,
            editEmployeeId : editCellId
        })
    }

    openModal = ( modalTitle, modalMessage, reload ) => {      
        this.setState({ 
            modalIsOpen: true, 
            modalTitle, 
            modalMessage, 
            reload 
        })
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
        this.props.hideAddBtn(false)
    }

    onSaveEmployee = () => {

        // remove blanks of front and back
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

        // if all is valid, save
        axios.put( URL + '/api/employee/' + this.state.editEmployeeId, { name, code, professionId, color, cityId, branchId, assigned } )
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


        // Success pop-up 
        this.openModal( 'Employee Updated', `Employee '${name}' was successfully updated.`, true)


    }

    onNameChange = (e) => {     
        this.setState({
            name: e.target.value
        })
    }

    onCodeChange = (e) => {

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
  console.log('onAssignedChange', e.target.value)      
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

        const { name, code, color, professionSelect, citySelect, branchSelect, assignedSelect } = this.state
        const { data, editCellId } = this.props

        const index = data.findIndex( d => d.id === editCellId)
  
        return(
            <div className='editEmployeeForm'>

                <div className='edit-form-grid-container'>
            
                    <div className='indexText'>{data[ index ].id}</div>
                    <div className='cell' onChange={this.onNameChange}>
                        <input className='inputText' type='text' value={name}/>
                    </div>
                    <div className='cell' onChange={this.onCodeChange}>
                        <input className='inputText' type='text' placeholder='Code' value={code}/>
                    </div>
                    <div className='cell'>
                        <select className='Select' onChange={(e)=>this.onProfessionChange(e.target.value)}>
                            {professionSelect}
                        </select></div>
                    <div className='cell' onChange={this.onColorChange}>
                        <input className='inputText' type='text' placeholder='Color' value={color}/>
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
                            {assignedSelect}
                        </select></div>
                    <div className='btnContainer'>
                        <div></div>
                        <div className='btnSave' onClick={this.onSaveEmployee}>Save</div>
                        <div className='btnCancel' onClick={this.onCancel}>Cancel</div>
                    </div>
                    
                </div> 

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

export default EditEmployeeForm