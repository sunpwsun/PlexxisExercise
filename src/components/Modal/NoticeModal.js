import React, { Component } from 'react'
import Modal from 'react-modal'
import './NoticeModal.css'

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

class NoticeModal extends Component {
 
    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00'
      }

    render() {

        return(

            <Modal
                isOpen={this.props.isOpen}
                onAfterOpen={this.afterOpenModal}
                style={customStyles}
                >

                <h2 className='modalTitle' ref={subtitle => this.subtitle = subtitle}>{this.props.title}</h2>
                <hr />
                <br />
                <div>{this.props.message}</div>
                <br />
                <br />
                <br />
                {   
                    !this.props.reload ?
                    <div className='modalCloseBtn' onClick={() => this.props.closeModal(`${this.props.title}`)}>Close</div>
                    :
                    <form>
                        <button className='modalOkBtn' >OK</button>
                    </form>
                }
            </Modal>
        )
    }
}

export default NoticeModal