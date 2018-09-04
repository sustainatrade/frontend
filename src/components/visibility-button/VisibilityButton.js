import React, { Component } from "react";
import { Visibility, Button } from "semantic-ui-react";

export default class VisibilityButton extends Component {
  render() {
    const { onUpdate, ...rest } = this.props;
    return (
      <Visibility
        fireOnMount
        continuous
        offset={[10, 10]}
        // onUpdate={(e, { calculations }) => {
        //   if (calculations.bottomVisible) {
        //     loadMoreFn();
        //   }
        // }}
        onUpdate={onUpdate}
      >
        <Button {...rest} />
      </Visibility>
    );
  }
}
