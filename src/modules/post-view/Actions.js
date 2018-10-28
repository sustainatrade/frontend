import React from "react";
import { Button } from "semantic-ui-react";
import Icon from "antd/lib/icon";
import "./Actions.css";
import { GlobalConsumer } from "./../../contexts";
import get from "lodash/get";
import MoreButton from "./../post-feed/MoreButton";
import FollowButton from "./../post-feed/FollowButton";

export default class Actions extends React.Component {
  render() {
    const { post, size, onEdit } = this.props;
    return (
      <div className="post-page-actions" style={{ width: size.width }}>
        <GlobalConsumer>
          {({ user, postView }) => {
            const myPost = get(user, "user.id") === post.createdBy;
            if (postView.editting)
              return (
                <Button
                  content="Back"
                  icon="angle left"
                  onClick={() => postView.setEditMode(false)}
                />
              );
            return (
              <>
                <FollowButton post={post} />
                <MoreButton post={post} userContext={user} floated="right" />
                {myPost && (
                  <Button
                    color="blue"
                    floated="right"
                    onClick={() => postView.setEditMode(true)}
                  >
                    <Icon type="edit" theme="outlined" /> Edit
                  </Button>
                )}
              </>
            );
          }}
        </GlobalConsumer>
      </div>
    );
  }
}
