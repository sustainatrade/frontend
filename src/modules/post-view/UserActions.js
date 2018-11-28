import React, { useContext, useCallback, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import './UserActions.css';
import get from 'lodash/get';
import PostReplyContext from '../../contexts/PostReplyContext';
import PostViewContext from '../../contexts/PostViewContext';

const BUTTON_SIZE = 'huge';

export default function(props) {
  const { post, size } = props;
  const { setParentPost, parentPost } = useContext(PostReplyContext.Context);
  const { editting } = useContext(PostViewContext.Context);
  if (!!parentPost || editting) return null;
  return (
    <div className="post-user-actions" style={{ width: size.width - 1 }}>
      {/* <Button icon="smile outline" size={BUTTON_SIZE} /> */}
      <Button
        content="Reply"
        icon="comment"
        color="green"
        size={BUTTON_SIZE}
        onClick={useCallback(() => {
          setParentPost(post);
        })}
      />
    </div>
  );
}
