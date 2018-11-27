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
import UserContext from "../../contexts/UserContext";
import ErrorContext from "../../contexts/ErrorContext";
import { TYPES } from "../../errors";
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
  const user = useContext(UserContext.Context);
  const error = useContext(ErrorContext.Context);

  const currentUserId = get(user, "user.id");
  const replyMode = get(parentPost, "_refNo") === post._refNo;
  return (
    <div style={{ cursor: "default" }}>
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
                onClick={() => {
                  if (!currentUserId) {
                    error.emit(TYPES.NOT_LOGGED_IN);
                    return;
                  }
                  setParentPost(post);
                }}
              />
            )}
          </div>
        )}
      </GlobalConsumer>
      {replyMode && <PostReply />}
    </div>
  );
});

export default class PostItem extends React.Component {
  render() {
    const { post, onContentClick, isCompact, withActions = true } = this.props;
    const mode = isCompact ? MODES.COMPACT : MODES.VIEW;
    return (
      <Item className="post-item">
        <Item.Content>
          <Item.Header as="h4">
            <Link to={getUrl(post)}>{post.title}</Link>
          </Item.Header>
          <div
            onClick={() => {
              onContentClick && onContentClick(post);
            }}
          >
            {post.widgets.map((widget, ii) => (
              <WidgetMeta widget={widget} mode={mode} key={ii} />
            ))}
          </div>
          <Item.Extra>
            {withActions && <Actions post={post} canReply />}
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}
