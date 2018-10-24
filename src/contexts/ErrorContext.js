import React from "react";
import get from "lodash/get";
import { emitter } from "../components/ms-graphql-client/MsGraphqlClient";
const Context = React.createContext({});

class Provider extends React.Component {
  state = {
    clear: key => {
      this.setState({ [key]: undefined });
    }
  };

  componentWillMount() {
    const self = this;
    emitter.on("NEW_ERROR", err => {
      console.log("err"); //TRACE
      console.log(err); //TRACE
      const paths = get(err, "path", []);
      const newErrors = {};
      for (const path of paths) {
        const oldPathErrors = get(self, ["state", path], []);
        newErrors[path] = [...oldPathErrors, err];
      }
      self.setState(newErrors);
    });
  }
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
