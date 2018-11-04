import React from "react";
import { Segment, Button } from "semantic-ui-react";
import { Query } from "react-apollo";
import { REPLY_LIST } from "../../gql-schemas";
import get from "lodash/get";
import PostItem from "../post-item";
import { Link } from "@reach/router";
import { getUrl } from "../../contexts/PostFeedContext";
import "./PostReplies.css";

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
              return (
                <div
                  style={{ padding: 5, borderBottom: "solid 1px gainsboro" }}
                >
                  <Button
                    floated="right"
                    as={Link}
                    to={getUrl(reply)}
                    size="tiny"
                    basic
                    content="View Reply"
                  />
                  <PostItem
                    key={reply._refNo}
                    isCompact
                    post={reply}
                    basic
                    withLabels={false}
                  />
                </div>
              );
            })}
          </div>
        );
      }}
    </Query>
  );
}
