import React, { Component } from "react";
import WidgetBase from "./../base/WidgetBase";

export default class BuyItem extends Component {
  render() {
    return (
      <WidgetBase
        editor={<div>editing</div>}
        view={<div>viewing</div>}
        compact={<div>compact</div>}
        {...this.props}
      />
    );
  }
}
