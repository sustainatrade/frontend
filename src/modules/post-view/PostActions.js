import React, { useContext, useCallback } from "react";
import { Button } from "semantic-ui-react";
import Icon from "antd/lib/icon";
import "./PostActions.css";
import get from "lodash/get";
import MoreButton from "./../post-feed/MoreButton";
import FollowButton from "./../post-feed/FollowButton";
import PostViewContext from "../../contexts/PostViewContext";
import UserContext from "../../contexts/UserContext";
import PostReplyContext from "../../contexts/PostReplyContext";

export default function({ post }) {
  const { editting, setEditMode } = useContext(PostViewContext.Context);
  const { setParentPost, parentPost } = useContext(PostReplyContext.Context);
  const user = useContext(UserContext.Context);

  const myPost = get(user, "user.id") === post.createdBy;
  if (editting) return null;
  return (
    <div className="post-actions">
      <FollowButton post={post} />
      <Button.Group floated="right" basic>
        <Button
          content="Reply"
          icon="comment"
          onClick={useCallback(() => {
            setParentPost(post);
          })}
        />
        {myPost && (
          <Button onClick={() => setEditMode(true, post._refNo)}>
            <Icon type="edit" theme="outlined" /> Edit
          </Button>
        )}
        <MoreButton post={post} userContext={user} floated="right" />
      </Button.Group>
    </div>
  );
}
