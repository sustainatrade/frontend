import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from "react";
import {
  Dimmer,
  Visibility,
  Button,
  Divider,
  Segment
} from "semantic-ui-react";
import { Query } from "react-apollo";
import { REPLY_LIST } from "../../gql-schemas";
import get from "lodash/get";
import debounce from "lodash/debounce";
import PostItem from "../post-item";
import UserLabel from "./../user-profile/UserLabel";
import { Link } from "@reach/router";
import { getUrl } from "../../contexts/PostFeedContext";
import "./PostReplies.css";
import PostReplyContext from "../../contexts/PostReplyContext";
import PostStackContext from "../../contexts/PostStackContext";
import PostView from "./index";
import { useOnMount, useOnUnmount } from "react-hanger";
import LayoutContext from "../../contexts/LayoutContext";

function IconController({ post }) {
  const itemEl = useRef(null);
  const { add, remove } = useContext(PostStackContext.Context);

  useOnMount(() => {
    add({ post, offset: {}, ref: itemEl });
  });
  useOnUnmount(() => {
    remove(post.id);
  });

  return <div ref={itemEl} />;
}

const PostItemCompact = React.memo(({ reply, onContentClick }) => {
  return (
    <PostItem
      key={reply._refNo}
      isCompact
      post={reply}
      basic
      withLabels={false}
      onContentClick={onContentClick}
      allowReply
    />
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
  const dimmed = false;
  const { showIconScroller, setShowIconScroller, iconScrollWidth } = useContext(
    LayoutContext.Context
  );
  // !onScreen && calculations.onScreen && this.setState({ onScreen: true });
  return (
    <React.Fragment>
      <Segment style={{ marginLeft: iconScrollWidth }}>
        {onScreen && <IconController onScreen={onScreen} post={reply} />}
        <Visibility
          fireOnMount
          continuous
          offset={[0, 200]}
          onOnScreen={useCallback(() => {
            !onScreen && setOnScreen(true);
          })}
          onOffScreen={useCallback(() => {
            onScreen && setOnScreen(false);
          })}
        >
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
                    console.log("content clicked"); //TRACE
                  })}
                />
              ) : (
                <PostItemCompact
                  reply={reply}
                  onContentClick={useCallback(() => {
                    console.log("content clicked"); //TRACE
                    setExpanded(true);
                  })}
                />
              )}
            </div>
          </div>
        </Visibility>
      </Segment>
    </React.Fragment>
  );
}

function ReplyHeader({ edges, limit }) {
  const { iconScrollWidth } = useContext(LayoutContext.Context);
  const totalReply = edges.length >= limit ? `${limit}+` : edges.length;
  return (
    <div className="replies-header" style={{ marginLeft: iconScrollWidth }}>
      <span>Replies ({totalReply})</span>
    </div>
  );
}

export default function PostReplies({ post }) {
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
        const edges = get(data, "PostList.edges", []);

        return (
          <div className="replies">
            <ReplyHeader edges={edges} limit={limit} />
            {edges.map((edge, ii) => {
              const reply = edge.node;
              return (
                <React.Fragment key={edge.cursor}>
                  <ReplyItem
                    key={edge.cursor}
                    showDivider={ii > 0}
                    reply={reply}
                  />
                  <PostReplies post={reply} />
                </React.Fragment>
              );
            })}
          </div>
        );
      }}
    </Query>
  );
}
