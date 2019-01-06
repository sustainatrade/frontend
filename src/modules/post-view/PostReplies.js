import React, { useState, useContext, useRef, useCallback } from 'react';
import { Visibility, List, Transition, Icon, Segment } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import { REPLY_LIST } from '../../gql-schemas';
import get from 'lodash/get';
// import debounce from 'lodash/debounce';
import PostItem from '../post-item';
import UserLabel from './../user-profile/UserLabel';
// import { Link } from '@reach/router';
// import { getUrl } from '../../contexts/PostFeedContext';
import './PostReplies.css';
// import PostReplyContext from '../../contexts/PostReplyContext';
import PostStackContext from '../../contexts/PostStackContext';
// import PostView from './index';
import { useOnMount, useOnUnmount } from 'react-hanger';
import LayoutContext from '../../contexts/LayoutContext';

// const DEPTH_INDENT = 50;

function IconController({ post, head, tail }) {
  const itemEl = useRef(null);
  const { add, remove } = useContext(PostStackContext.Context);
  // const { contentStyle } = useContext(LayoutContext.Context);
  // const ctrlOffsetY = contentStyle.paddingTop;

  useOnMount(() => {
    const obj = { post, offset: {} };
    head && (obj.headEl = itemEl);
    tail && (obj.tailEl = itemEl);
    add(obj);
  });
  useOnUnmount(() => {
    // const curEl = get(itemEl, "ref.current");
    // const { y: offsetTop } = curEl.getBoundingClientRect();
    // if (head && offsetTop > ctrlOffsetY) {
    //   remove(post.id);
    // }
    // if (tail && offsetTop < ctrlOffsetY) {
    //   remove(post.id);
    // }
    remove(post.id);
  });

  return <div ref={itemEl} />;
}

const PostItemCompact = React.memo(({ reply, onContentClick }) => {
  return (
    <div style={{ padding: 5 }}>
      <PostItem
        key={reply._refNo}
        isCompact
        post={reply}
        basic
        withLabels={false}
        onContentClick={onContentClick}
        allowReply
      />
    </div>
  );
});

const PostItemDetailed = React.memo(({ reply, onContentClick }) => {
  return (
    <PostItem
      key={reply._refNo}
      post={reply}
      basic
      withLabels={false}
      onContentClick={onContentClick}
      allowReply
    />
  );
});

function ReplyItem({ reply, showDivider }) {
  // const { activeReplyStack } = useContext(PostReplyContext.Context);
  const [expanded, setExpanded] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const { contentStyle, iconScrollWidth } = useContext(LayoutContext.Context);
  const ctrlOffsetY = contentStyle.paddingTop;

  // !onScreen && calculations.onScreen && this.setState({ onScreen: true });
  let vStyle = { marginBottom: 15 };
  if (expanded) {
    vStyle.borderLeft = 'solid 5px steelblue';
  }
  return (
    <React.Fragment>
      {expanded && onScreen && <IconController head onScreen={onScreen} post={reply} />}
      <Visibility
        fireOnMount
        continuous
        style={vStyle}
        offset={[0, ctrlOffsetY]}
        onOnScreen={() => {
          if (!onScreen) {
            // console.log("on " + reply.id);
            setOnScreen(true);
          }
        }}
        onOffScreen={() => {
          if (onScreen) {
            // console.log("off " + reply.id);
            setOnScreen(false);
          }
        }}
      >
        <Segment style={{ marginLeft: iconScrollWidth, marginRight: 5, marginBottom: 0, padding: 0 }}>
          <div className="reply">
            <div className="reply-header">
              <span className="name">
                <UserLabel refNo={reply.createdBy} />
              </span>
            </div>
            <div className="reply-content">
              {expanded ? (
                <PostItemDetailed
                  reply={reply}
                  onContentClick={useCallback(() => {
                    setExpanded(false);
                  })}
                />
              ) : (
                <PostItemCompact
                  reply={reply}
                  onContentClick={useCallback(() => {
                    setExpanded(true);
                  })}
                />
              )}
            </div>
          </div>
        </Segment>
        <PostReplies post={reply} expanded={expanded} />
      </Visibility>
      {expanded && onScreen && <IconController tail onScreen={onScreen} post={reply} />}
    </React.Fragment>
  );
}

function ReplyHeader({ edges, limit, large }) {
  const { iconScrollWidth } = useContext(LayoutContext.Context);
  const totalReply = edges.length >= limit ? `${limit}+` : edges.length;
  if (totalReply === 0) return <div />;
  return (
    <div
      className="replies-header"
      style={{
        marginLeft: iconScrollWidth,
        fontSize: large ? 'large' : 'small'
      }}
    >
      <span>Replies ({totalReply})</span>
    </div>
  );
}

export default function PostReplies({ post, expanded, isRoot }) {
  const limit = 10;
  return (
    <Query
      query={REPLY_LIST.query}
      variables={{
        input: {
          parentPostRefNo: post._refNo,
          limit
        }
      }}
    >
      {({ loading, data }) => {
        const edges = get(data, 'PostList.edges', []);

        return (
          <div className="replies">
            <ReplyHeader edges={edges} limit={limit} large={isRoot} />
            <Transition.Group as={List} duration={200}>
              {expanded &&
                edges.map((edge, ii) => {
                  const reply = edge.node;
                  return (
                    <List.Item key={edge.cursor}>
                      <ReplyItem key={edge.cursor} showDivider={ii > 0} reply={reply} />
                    </List.Item>
                  );
                })}
            </Transition.Group>
          </div>
        );
      }}
    </Query>
  );
}
