import React, { Component } from 'react'
import ErrorModal from '../Modal/ErrorModal'
import './AddEmployeeForm.css'
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
        this.props.hideEditBtn(false)
    }

    onAddEmployee = () => {

        // remove blanks of front and back
        this.setState( { 
            ate,
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
        axios.post( URL + '/api/employee', { name, code, professionId, color, cityId, branchId, assigned } )
            .then(res => {
console.log('[axios post res]', res)

                if( res.data.message !== 'OK') {
                    this.openModal( 'Error', res.data.message.errors[0].message, false)
                    return
                }
            })
            //.catch( err => console.log( '[ POST ERROR ]', err))
            .catch( err => {
                this.openModal( 'Error', err , false)
                return
            })


        // Success pop-up 
        this.openModal( 'Employee Added', `New employee '${name}' was successfully added.`, true)


    }

    onNameChange = (e) => {     
        this.setState({
            ate,
            name: e.target.value
        })
    }

    onCodeChange = (e) => {

        const v = e.target.value.toUpperCase()
    
        // length of code must be 4 characters
        if( v.length > 4 )
            return

        this.setState({
            ate,
            code: v
        })
    }

    onColorChange = (e) => {
        this.setState({
            ate,
            color : e.target.value
        })
    }
    onProfessionChange = (v) => {
        this.setState({
            ate,
            professionId : v
        })
    }
    onAssignedChange= (e) => {
        this.setState({
            ate,
            assigned : e.target.value
        })
    }
    onCityChange = (e) => {
        this.setState({
            ate,
            cityId : e.target.value
        })
    }
    onBranchChange= (e) => {
        this.setState({
            ate,
            branchId : e.target.value
        })
    }


    render() {

        const { professions, cities, branches } = this.state

        let professionSelect = []
        professionSelect[0] = ( <option disabled selected>Profession</option> )
        professions.forEach( p => {
            if( !p.active )
                return

            professionSelect[ p.professionId ] = ( <option value={p.professionId} >{p.name}</option>  )
        })



        let citySelect = []
        citySelect[0] = ( <option disabled selected>City</option> )
        cities.forEach( c => {
            if( !c.active )
                return
            citySelect[ c.cityId ] = ( <option value={c.cityId} >{c.name}</option>  )
        })


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

export default AddEmployeeForm