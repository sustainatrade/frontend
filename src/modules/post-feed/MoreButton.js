import React, { Component } from "react";
import { Label, Button, Icon } from "semantic-ui-react";
import Popover from "antd/lib/popover";
// import { Share } from "react-facebook";
import MoreProps from "./MoreProps";

import config from "config";

const ACTION_BUTTON_SIZE = config.posts.actionButtonSize;

export default class MoreButton extends Component {
  state = {};
  render() {
    const {
      userContext: { isAdmin },
      isCompact,
      post,
      size,
      ...rest
    } = this.props;
    const poProps = {
      placement: "bottomRight"
    };
    if (isCompact) {
      poProps.placement = "rightBottom";
    }
    return (
      <Popover
        content={
          <div
            style={{ width: 200 }}
            onClick={() => this.setState({ showMore: false })}
          >
            <MoreProps post={post} isAdmin={isAdmin} />
          </div>
        }
        trigger="click"
        visible={this.state.showMore}
        onVisibleChange={showMore => this.setState({ showMore })}
        {...poProps}
      >
        {isCompact ? (
          <Label basic as="a" className="actn-lbl">
            <center>
              <Icon name="ellipsis horizontal" />
            </center>
          </Label>
        ) : (
          <Button
            basic
            size={size || ACTION_BUTTON_SIZE}
            icon="ellipsis horizontal"
            title="More"
            {...rest}
          />
        )}
      </Popover>
    );
  }
}
