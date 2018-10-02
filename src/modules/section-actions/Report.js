import React from "react";
import { Button } from "semantic-ui-react";

export default class Report extends React.Component {
  render() {
    return (
      <Button {...this.props} basic negative>
        Report
      </Button>
    );
  }
}
