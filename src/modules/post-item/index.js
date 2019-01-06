import React, { useContext } from 'react';
import { Item, Icon, Menu, Label, Divider } from 'semantic-ui-react';
import { contents, MODES } from '../../components/widgets';
// import AntButton from 'antd/lib/button';
import { getUrl } from '../../contexts/PostFeedContext';
import { Link } from '@reach/router';
import get from 'lodash/get';
import PostReply from '../post-view/PostReply';
import MoreButton from '../post-feed/MoreButton';
import FollowButton from '../post-feed/FollowButton';
import { GlobalConsumer } from '../../contexts';
import './post-item.css';
import PostReplyContext from '../../contexts/PostReplyContext';
import BasicButton from '../../components/basic-button/BasicButton';
import UserContext from '../../contexts/UserContext';
import ErrorContext from '../../contexts/ErrorContext';
import { TYPES } from '../../errors';
import Iconify from '../../components/icon-provider/Icon';

const WidgetMeta = ({ widget, mode }) => {
  const ContentWidget = contents[widget.code].component;
  return (
    <>
      {mode === MODES.VIEW && <Divider fitted style={{ borderColor: 'ghostwhite' }} />}
      <ContentWidget mode={mode} defaultValues={widget.values} basic fitted />
    </>
  );
};
const Actions = React.memo(({ post, canReply }) => {
  const { parentPost, setParentPost } = useContext(PostReplyContext.Context);
  const user = useContext(UserContext.Context);
  const error = useContext(ErrorContext.Context);

  const currentUserId = get(user, 'user.id');
  const replyMode = get(parentPost, '_refNo') === post._refNo;
  return (
    <div style={{ cursor: 'default', margin: 0 }}>
      <GlobalConsumer>
        {({ user }) => (
          <div className="post-item-actions">
            <Menu secondary icon="labeled" size="mini">
              <Menu.Item name="gamepad">
                <Icon name="arrow up" />
                Up
              </Menu.Item>

              <Menu.Item name="video camera">
                <Icon name="arrow down" />
                Down
              </Menu.Item>

              <Menu.Item name="smile outline">
                <Icon name="smile outline" />
                React
              </Menu.Item>

              <Menu.Item
                name="smile outline"
                onClick={() => {
                  if (!currentUserId) {
                    error.emit(TYPES.NOT_LOGGED_IN);
                    return;
                  }
                  setParentPost(post);
                }}
              >
                <Icon name="talk" />
                Comment
              </Menu.Item>
            </Menu>
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
    let widgets = [];
    if (isCompact) {
      widgets.push(post.widgets[0]);
      post.widgets[1] && widgets.push(post.widgets[1]);
      post.widgets[2] && widgets.push(post.widgets[2]);
    } else widgets = post.widgets;

    const subjectContent = contents[widgets[0].code];
    return (
      <Item className="post-item">
        <Item.Content>
          {post.title && (
            <Item.Header as="h4">
              <Link to={getUrl(post)}>{post.title}</Link>
              <Label
                size="mini"
                style={{ marginLeft: 5, position: 'relative', top: -4 }}
                color={subjectContent.color}
              >
                {subjectContent.name}
              </Label>
            </Item.Header>
          )}
          <div
            onClick={() => {
              onContentClick && onContentClick(post);
            }}
          >
            {widgets.map((widget, ii) => (
              <WidgetMeta widget={widget} mode={mode} key={ii} />
            ))}
          </div>
          <Item.Extra style={{ marginTop: 0 }}>
            {post.widgets && post.widgets.length > 3 && (
              <div className="blurrer">+{post.widgets.length - 3} More Contents</div>
            )}
            {/* {withActions && <Actions post={post} canReply />} */}
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}
