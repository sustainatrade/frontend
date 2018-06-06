import React from 'react'
import {
    Responsive
} from 'semantic-ui-react'

const Context =  React.createContext({});


class Provider extends React.Component {
    
    state = {};
    
    handleOnUpdate = (e, { width }) => {
        const { isMobile } = this.state;
        const newIsMobile = width<780;
        if(isMobile!==newIsMobile)
            this.setState({ isMobile:newIsMobile })
    }
    
    render() {
        return (
            <Context.Provider value={this.state}>
                <Responsive
                    fireOnMount
                    onUpdate={this.handleOnUpdate}
                >
                    {this.props.children}   
                </Responsive>
                
            </Context.Provider>
        )
    }
}

export default {
    Provider,
    Consumer:Context.Consumer
} 