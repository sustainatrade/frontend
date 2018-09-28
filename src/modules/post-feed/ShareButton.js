import React, { Component } from "react";
import { FOLLOW_POST } from "gql-schemas";
import { Label, Button, Icon } from "semantic-ui-react";
import { Share } from "react-facebook";
import { getShareUrl } from "./PostItem";
import config from "config";

const ACTION_BUTTON_SIZE = config.posts.actionButtonSize;

export default class ShareButton extends Component {
  render() {
    const { post } = this.props;
    return (
      <Share href={getShareUrl(post)}>
        <Button
          icon
          color="facebook"
          size={ACTION_BUTTON_SIZE}
          title={getShareUrl(post)}
        >
          <Icon name="facebook f" title="Comments" />
        </Button>
      </Share>
    );
  }
}
