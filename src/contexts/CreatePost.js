import React from 'react';
import { manifests } from './../components/widgets';

const Context =  React.createContext();


class Provider extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            modalOpened: false,
            widgets:[],
            closeModal: () => {
                this.setState({modalOpened:false});
            },
            openModal: () => {
                this.setState({modalOpened:true});
            },
            setPhotos: (photos)=> {
                this.setState({photos});
            },
            addWidget: async(widgetData)=> {
                this.setState({widgets:[...this.state.widgets,widgetData]});
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
