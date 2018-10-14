import React, { Component } from "react";
// import { FOLLOW_POST } from "gql-schemas";
import { Button, Icon } from "semantic-ui-react";
import { Share } from "react-facebook";
import { getShareUrl } from "./../../contexts/PostFeedContext";
import config from "config";

const ACTION_BUTTON_SIZE = config.posts.actionButtonSize;

export default class ShareButton extends Component {
  render() {
    const { post } = this.props;
    return (
      <Share href={getShareUrl(post)}>
        {({ handleClick, loading }) => (
          <Button
            icon
            color="facebook"
            loading={loading}
            size={ACTION_BUTTON_SIZE}
            title={getShareUrl(post)}
            onClick={handleClick}
          >
            <Icon name="facebook f" title="Comments" />
          </Button>
        )}
      </Share>
    );
  }
}
