import React from 'react'
import Title from './components/Title/Title'
import EmployeeButtons from './components/Buttons/EmployeeButtons'
import CompanyButtons from './components/Buttons/CompanyButtons'
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
            showDeleteButton : tf,
            selected : newSelected
        })
    }

    onHideAddBtn = (tf) => {
        this.setState({
            hideAddBtn : tf,
        }) 
    }

    onHideEditBtn = (tf) => {
        this.setState({
            hideEditBtn : tf,
        }) 
    }
    
    render() {
  
        return (
            <div className="App">
            <Title />
                <div className='bodyContainer'>
                  
                    <h1 style={{marginTop:20}}>Plexxis Employees</h1>
                    <EmployeeButtons showDeleteButton={this.state.showDeleteButton} 
                                    selected={this.state.selected} 
                                    hideAddBtn={this.state.hideAddBtn} 
                                    onHideEditBtn={this.onHideEditBtn} />

                    <TableContainer onShowDeleteButton={this.onShowDeleteButton}
                                    onHideAddBtn={this.onHideAddBtn}  
                                    hideEditBtn={this.state.hideEditBtn}
                                    onHideEditBtn={this.onHideEditBtn}   />
                    <CompanyButtons />
                </div>
            </div>
        )
    }
}

export default App

