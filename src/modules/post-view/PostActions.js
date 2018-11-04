import React, { useContext } from "react";
import { Button } from "semantic-ui-react";
import Icon from "antd/lib/icon";
import "./PostActions.css";
import get from "lodash/get";
import MoreButton from "./../post-feed/MoreButton";
import FollowButton from "./../post-feed/FollowButton";
import PostViewContext from "../../contexts/PostViewContext";
import UserContext from "../../contexts/UserContext";

export default function({ post }) {
  const { editting, setEditMode } = useContext(PostViewContext.Context);
  const user = useContext(UserContext.Context);

  const myPost = get(user, "user.id") === post.createdBy;
  if (editting) return null;
  return (
    <div className="post-actions">
      <FollowButton post={post} />
      <MoreButton post={post} userContext={user} floated="right" />
      {myPost && (
        <Button color="blue" floated="right" onClick={() => setEditMode(true)}>
          <Icon type="edit" theme="outlined" /> Edit
        </Button>
      )}
    </div>
  );
}
