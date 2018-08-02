import React, { Component } from "react";
import Modal from "antd/lib/modal";
import { Label, Icon, Divider } from "semantic-ui-react";
import PostViewContext from "./../../../contexts/PostViewContext";

export default class HidePostModal extends Component {
  state = {};
  render() {
    const { opened } = this.state;
    const { post } = this.props;
    return (
      <PostViewContext.Consumer>
        {({ removePostFn }) => {
          return (
            <React.Fragment>
              <a onClick={() => this.setState({ opened: true })}>
                <Icon name="cancel" color="grey" size="large" />Remove Post{" "}
                <Label size="mini" style={{ float: "right" }} color="green">
                  admin
                </Label>
              </a>
              <Modal
                title={"Remove " + post._refNo}
                visible={opened}
                onCancel={() => this.setState({ opened: false })}
                onOk={async () => {
                  await removePostFn(post._refNo);
                  this.setState({ opened: false });
                }}
                okText="Remove"
                okType="danger"
              >
                <div style={{ fontSize: "larger" }}>
                  Are you sure to remove this post?
                  <Divider />
                  <center>
                    <Label size="large" image color="red">
                      {post._refNo}
                      <Label.Detail>{post.title}</Label.Detail>
                    </Label>
                  </center>
                </div>
              </Modal>
            </React.Fragment>
          );
        }}
      </PostViewContext.Consumer>
    );
  }
}
