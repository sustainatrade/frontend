import React, { Component } from "react";

export default class PropChangeHandler extends Component {
  componentDidMount() {
    const { triggerOnMount, prop, handler } = this.props;
    if (triggerOnMount) handler && handler(prop);
  }
  componentDidUpdate({ prop: prevProp }, prevState) {
    const { prop, handler } = this.props;
    if (prevProp !== prop) {
      handler && handler(prop);
    }
  }
  render = () => <span />;
}
