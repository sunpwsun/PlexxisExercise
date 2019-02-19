import React from 'react'
import Title from './components/Title/Title'
import EmployeeButtons from './components/Buttons/EmployeeButtons'
import TableContainer from './components/TableContainer/TableContainer'
import './App.css'


class App extends React.Component {

    state = {

        showDeleteButton : false,
        selected : [],
        refresh : 0,
        hideAddBtn : false,
        hideEditBtn : false
    }

    // for deleting, hand seleted
    onShowDeleteButton = ( tf, newSelected ) => {
    
        this.setState({
            ...this.state,
            showDeleteButton : tf,
            selected : newSelected
        })
    }

    hideAddBtn = (tf) => {
        this.setState({
            ...this.state,
            hideAddBtn : tf,
        }) 
    }

    hideEditBtn = (tf) => {
        this.setState({
            ...this.state,
            hideEditBtn : tf,
        }) 
    }
    render() {
        const { employees, cities, branches, professions } = this.state

        return (
            <div className="App">
            <Title />
                <div className='bodyContainer'>
                  
                    <h1 style={{marginTop:20}}>Plexxis Employees</h1>
                    <EmployeeButtons showDeleteButton={this.state.showDeleteButton} 
                                    selected={this.state.selected} 
                                    hideAddBtn={this.state.hideAddBtn} 
                                    hideEditBtn={this.hideEditBtn} />

                    <TableContainer onShowDeleteButton={this.onShowDeleteButton}
                                    hideAddBtn={this.hideAddBtn}  
                                    hideEditBtn={this.state.hideEditBtn}  />
                </div>
            </div>
        )
    }
}

export default App

