import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from "react";
import { Dimmer, Visibility, Button, Segment, Icon } from "semantic-ui-react";
import { Query } from "react-apollo";
import { REPLY_LIST } from "../../gql-schemas";
import get from "lodash/get";
import debounce from "lodash/debounce";
import PostItem from "../post-item";
import { Link } from "@reach/router";
import { getUrl } from "../../contexts/PostFeedContext";
import "./PostReplies.css";
import PostReplyContext from "../../contexts/PostReplyContext";
import PostStackContext from "../../contexts/PostStackContext";
import PostView from "./index";
import { useOnMount, useOnUnmount } from "react-hanger";

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

const PostItemStatic = React.memo(({ reply }) => {
  return (
    <PostItem
      key={reply._refNo}
      isCompact
      post={reply}
      basic
      withLabels={false}
    />
  );
});

function ReplyItem({ reply }) {
  // const { activeReplyStack } = useContext(PostReplyContext.Context);
  const [expanded, setExpanded] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const dimmed = false;
  // !onScreen && calculations.onScreen && this.setState({ onScreen: true });
  return (
    <Dimmer.Dimmable as={Segment} blurring raised={dimmed} dimmed={dimmed}>
      <Dimmer active={dimmed} inverted onClickOutside={() => {}} />
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
        <div
          className="reply"
          // style={onScreen ? { backgroundColor: "blue" } : {}}
        >
          <div className="reply-header">
            <Button
              floated="right"
              onClick={useCallback(() => {
                const x = getUrl(reply);
                console.log("x"); //TRACE
                console.log(x); //TRACE
                setExpanded(!expanded);
              })}
              size="tiny"
              basic
              content={`${expanded ? "Close" : "View"} Reply`}
            />
          </div>
          <div className="reply-content">
            {expanded ? (
              <PostView postRef={reply} asReply />
            ) : (
              <PostItemStatic reply={reply} />
            )}
          </div>
        </div>
      </Visibility>
    </Dimmer.Dimmable>
  );
}

export default function PostReplies({ post }) {
  return (
    <Query
      query={REPLY_LIST.query}
      variables={{
        input: {
          parentPostRefNo: post._refNo,
          limit: 10
        }
      }}
    >
      {({ loading, data }) => {
        const edges = get(data, "PostList.edges", []);
        return (
          <div>
            <div className="replies-header">
              <span>Replies ({edges.length})</span>
            </div>
            {edges.map(edge => {
              const reply = edge.node;
              return <ReplyItem key={edge.cursor} reply={reply} />;
            })}
          </div>
        );
      }}
    </Query>
  );
}
