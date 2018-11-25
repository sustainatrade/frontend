import React, { useContext, useCallback, Suspense } from "react";
import PostReplyContext from "../../contexts/PostReplyContext";
import { Loader, Button } from "semantic-ui-react";
import { Query, Mutation } from "react-apollo";
import { LAST_DRAFT } from "../../gql-schemas";
import get from "lodash/get";
import "./PostReply.css";
// import Modal from "antd/lib/modal";

const PostEditor = React.lazy(() => import("./../create-post/PostEditor"));

export default function PostReply() {
  const { parentPost, postReply, submitting, reset } = useContext(
    PostReplyContext.Context
  );
  console.log("submitting,parentPost"); //TRACE
  console.log(submitting, parentPost); //TRACE
  return (
    <div>
      <Suspense fallback={<Loader active inline="centered" />}>
        <Query
          query={LAST_DRAFT.query}
          variables={{
            parentPostRefNo: get(parentPost, "_refNo")
          }}
        >
          {({ loading, data }) => {
            const reply = get(data, "LastDraft.post");

            if (loading) return <Loader active inline="centered" />;
            return (
              <div className="create-reply">
                <div className="create-reply-header">
                  <span>Reply</span>
                  <Button
                    size="large"
                    content="Post"
                    icon="send"
                    color="teal"
                    loading={submitting}
                    disabled={get(reply, "widgets", []).length === 0}
                    floated="right"
                    onClick={() => {
                      postReply({ refNo: reply._refNo });
                    }}
                  />
                  <Button
                    size="large"
                    color="teal"
                    content="Cancel"
                    icon="ban"
                    loading={submitting}
                    floated="right"
                    onClick={() => {
                      reset();
                    }}
                  />
                </div>
                <PostEditor
                  post={{ ...reply, parentPost }}
                  onSubmit={() => {
                    postReply({ refNo: reply._refNo });
                  }}
                  onCancel={() => {
                    reset();
                  }}
                />
              </div>
            );
          }}
        </Query>
      </Suspense>
    </div>
  );
}
