import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { FOLLOW_POST } from "gql-schemas";
import { Label, Button, Icon } from "semantic-ui-react";
import config from "config";

const ACTION_BUTTON_SIZE = config.posts.actionButtonSize;

export default class CommentButton extends Component {
  state = { commentCount: 0 };

  render() {
    const {
      isCompact,
      postViewContext: { viewPostFn },
      post
    } = this.props;
    if (isCompact)
      return (
        <Label as="a" className="actn-lbl">
          <Icon name="quote left" />
          {this.state.commentCount}
        </Label>
      );
    if (!isCompact)
      return (
        <Button
          as="div"
          size={ACTION_BUTTON_SIZE}
          labelPosition="right"
          title="Comments"
          onClick={() => viewPostFn(post._refNo)}
        >
          <Button icon size={ACTION_BUTTON_SIZE}>
            <Icon name="quote left" title="Comments" />
          </Button>
          <Label as="a" basic pointing="left">
            {this.state.commentCount}
          </Label>
        </Button>
      );
  }
}
