import React, { useState, useContext, useCallback } from "react";
import { Dimmer, Button, Segment } from "semantic-ui-react";
import { Query } from "react-apollo";
import { REPLY_LIST } from "../../gql-schemas";
import get from "lodash/get";
import PostItem from "../post-item";
import { Link } from "@reach/router";
import { getUrl } from "../../contexts/PostFeedContext";
import "./PostReplies.css";
import PostReplyContext from "../../contexts/PostReplyContext";
import PostView from "./index";

function ReplyItem({ reply }) {
  // const { activeReplyStack } = useContext(PostReplyContext.Context);
  const [expanded, setExpanded] = useState(false);
  const dimmed = false;
  console.log("reply"); //TRACE
  console.log(reply); //TRACE
  return (
    <Dimmer.Dimmable as={Segment} blurring raised={dimmed} dimmed={dimmed}>
      <Dimmer active={dimmed} inverted onClickOutside={() => {}} />
      <div className="reply">
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
            <PostItem
              key={reply._refNo}
              isCompact
              post={reply}
              basic
              withLabels={false}
            />
          )}
        </div>
      </div>
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
        console.log("loading,data"); //TRACE
        console.log(loading, data); //TRACE
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
