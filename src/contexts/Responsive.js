import React from "react";
import { Responsive } from "semantic-ui-react";

export const Context = React.createContext({});

class Provider extends React.Component {
  state = {
    isMobile: true,
    stretched: false,
    setStretched: flag => {
      this.setState({ stretched: flag });
    }
  };

  handleOnUpdate = (e, { width }) => {
    const { isMobile } = this.state;
    const newIsMobile = width < 780;

    if (isMobile !== newIsMobile) {
      this.setState({
        isMobile: newIsMobile,
        width
      });
    }
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        <Responsive fireOnMount onUpdate={this.handleOnUpdate}>
          {this.props.children}
        </Responsive>
      </Context.Provider>
    );
  }
}

export default {
  Provider,
  Consumer: Context.Consumer
};
