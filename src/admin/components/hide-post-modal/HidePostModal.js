import React, { Component } from "react";
import Modal from "antd/lib/modal";
import { Label } from "semantic-ui-react";
console.log("imported");
export default class HidePostModal extends Component {
  state = {};
  render() {
    const { opened } = this.state;
    return (
      <div>
        <span onClick={() => this.setState({ opened: true })}>
          <Label size="mini">admin</Label>
          Hide Post d d d
        </span>
        <Modal
          title="Basic Modal"
          visible={opened}
          onCancel={() => this.setState({ opened: false })}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}
