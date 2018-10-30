import React from "react";
import { Item, Divider, Icon, Button } from "semantic-ui-react";
import { contents, MODES } from "../../components/widgets";
import AntButton from "antd/lib/button";
import { getUrl } from "../../contexts/PostFeedContext";
import { Link } from "@reach/router";
import MoreButton from "../post-feed/MoreButton";
import FollowButton from "../post-feed/FollowButton";
import { GlobalConsumer } from "../../contexts";
import "./post-item.css";
console.log("contents"); //TRACE
console.log(contents); //TRACE

const WidgetMeta = ({ widget }) => {
  const ContentWidget = contents[widget.code].component;
  return (
    <ContentWidget
      mode={MODES.COMPACT}
      defaultValues={widget.values}
      basic
      fitted
    />
  );
};

const Actions = ({ post }) => (
  <GlobalConsumer>
    {({ user }) => (
      <>
        <FollowButton post={post} size="mini" />
        <MoreButton
          post={post}
          userContext={user}
          size="mini"
          floated="right"
        />
      </>
    )}
  </GlobalConsumer>
);

export default class PostItem extends React.Component {
  render() {
    const { post } = this.props;
    return (
      <Item className="post-item">
        <Item.Content>
          <Item.Header as="h4">
            <Link to={getUrl(post)}>{post.title}</Link>
          </Item.Header>
          {post.widgets.map((widget, ii) => (
            <WidgetMeta widget={widget} key={ii} />
          ))}
          <Item.Extra>
            <Actions post={post} />
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}
