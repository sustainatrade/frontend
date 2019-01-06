import React, { useContext, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import Icon from 'components/icon-provider/Icon';
import './PostActions.css';
import get from 'lodash/get';
import MoreButton from './../post-feed/MoreButton';
import FollowButton from './../post-feed/FollowButton';
import PostViewContext from '../../contexts/PostViewContext';
import UserContext from '../../contexts/UserContext';
import PostReplyContext from '../../contexts/PostReplyContext';
import ErrorContext from '../../contexts/ErrorContext';
import { TYPES } from '../../errors';

export default function({ post }) {
  const { editting, setEditMode } = useContext(PostViewContext.Context);
  const { setParentPost } = useContext(PostReplyContext.Context);
  const user = useContext(UserContext.Context);
  const error = useContext(ErrorContext.Context);

  const currentUserId = get(user, 'user.id');
  const myPost = currentUserId === post.createdBy;
  if (!myPost) return null;
  if (editting) return null;
  return (
    <div className="post-actions">
      {/* <FollowButton post={post} /> */}
      <Button.Group floated="right" basic>
        {/* <Button
          content="Reply"
          icon="comment"
          onClick={useCallback(() => {
            if (!currentUserId) {
              error.emit(TYPES.NOT_LOGGED_IN);
              return;
            }
            setParentPost(post);
          })}
        /> */}
        {myPost && <Button content="Edit" icon="edit" onClick={() => setEditMode(true, post._refNo)} />}
        <MoreButton post={post} userContext={user} floated="right" />
      </Button.Group>
    </div>
  );
}
