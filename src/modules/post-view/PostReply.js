import React, { useContext, Suspense } from 'react';
import PostReplyContext from '../../contexts/PostReplyContext';
// import { Loader, Dimmer } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import { LAST_DRAFT } from '../../gql-schemas';
import get from 'lodash/get';
import './PostReply.css';
import nanoid from 'nanoid';
import { useOnMount, useOnUnmount } from 'react-hanger';

const PostEditor = React.lazy(() => import('./../create-post/PostEditor'));
const PageLoader = () => <div />;
export default function PostReply() {
  const { activeReplyUuid, setActiveReplyUuid, parentPost, postReply, submitting, reset } = useContext(
    PostReplyContext.Context
  );
  const [uuid] = React.useState(nanoid());
  console.log('submitting,parentPost'); //TRACE
  console.log(submitting, parentPost); //TRACE
  useOnMount(() => {
    setActiveReplyUuid(oldUuid => {
      return oldUuid ? oldUuid : uuid;
    });
  });
  useOnUnmount(() => {
    setActiveReplyUuid(oldUuid => {
      return oldUuid === uuid ? null : oldUuid;
    });
  });

  if (activeReplyUuid !== uuid) return null;

  return (
    <div>
      <Suspense fallback={<PageLoader />}>
        <Query
          query={LAST_DRAFT.query}
          variables={{
            parentPostRefNo: get(parentPost, '_refNo')
          }}
        >
          {({ loading, data }) => {
            const reply = get(data, 'LastDraft.post');

            if (loading) return null;
            return (
              <div className="create-reply">
                {/* <div className="create-reply-header">
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
                </div> */}
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
