import React from 'react'

const Context =  React.createContext();


class Provider extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            modalOpened: false,
            closeModal: () => {
                this.setState({modalOpened:false});
            },
            openModal: () => {
                this.setState({modalOpened:true});
            },
            setPhotos: (photos)=> {
                this.setState({photos});
            }
        }
    }
    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export default {
    Provider,
    Consumer: Context.Consumer
}
