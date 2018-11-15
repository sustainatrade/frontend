import React, { useContext } from "react";
import { Item, Divider, Icon, Button } from "semantic-ui-react";
import { contents, MODES } from "../../components/widgets";
import AntButton from "antd/lib/button";
import { getUrl } from "../../contexts/PostFeedContext";
import { Link } from "@reach/router";
import get from "lodash/get";
import PostReply from "../post-view/PostReply";
import MoreButton from "../post-feed/MoreButton";
import FollowButton from "../post-feed/FollowButton";
import { GlobalConsumer } from "../../contexts";
import "./post-item.css";
import PostReplyContext from "../../contexts/PostReplyContext";
import BasicButton from "../../components/basic-button/BasicButton";
console.log("contents"); //TRACE
console.log(contents); //TRACE

const WidgetMeta = ({ widget, mode }) => {
  const ContentWidget = contents[widget.code].component;
  return (
    <ContentWidget mode={mode} defaultValues={widget.values} basic fitted />
  );
};
const Actions = React.memo(({ post, canReply }) => {
  const { parentPost, setParentPost } = useContext(PostReplyContext.Context);
  const replyMode = get(parentPost, "_refNo") === post._refNo;
  return (
    <div
      style={{ cursor: "default" }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {replyMode ? (
        <PostReply />
      ) : (
        <GlobalConsumer>
          {({ user }) => (
            <div className="post-item-actions">
              <FollowButton post={post} size="mini" />
              <MoreButton
                post={post}
                userContext={user}
                size="mini"
                floated="right"
              />
              {canReply && (
                <BasicButton
                  content="Reply"
                  name="reply"
                  floated="right"
                  onClick={() => setParentPost(post)}
                />
              )}
            </div>
          )}
        </GlobalConsumer>
      )}
    </div>
  );
});

export default class PostItem extends React.Component {
  render() {
    const { post, onContentClick, isCompact } = this.props;
    const mode = isCompact ? MODES.COMPACT : MODES.VIEW;
    return (
      <Item
        className="post-item"
        onClick={() => {
          onContentClick && onContentClick(post);
        }}
      >
        <Item.Content>
          <Item.Header as="h4">
            <Link to={getUrl(post)}>{post.title}</Link>
          </Item.Header>
          {post.widgets.map((widget, ii) => (
            <WidgetMeta widget={widget} mode={mode} key={ii} />
          ))}
          <Item.Extra>
            <Actions post={post} canReply />
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}
