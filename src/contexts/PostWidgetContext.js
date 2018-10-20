import React from "react";

const Context = React.createContext({});

class Provider extends React.Component {
  state = {};

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default {
  Provider,
  Consumer: Context.Consumer
};
