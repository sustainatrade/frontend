import React, { Component } from "react";

export default class PropHandler extends Component {
  componentDidUpdate({ prop: prevProp }, prevState) {
    const { prop, handler } = this.props;
    if (prevProp !== prop) {
      handler && handler(prop);
    }
  }
  render = () => <span />;
}
