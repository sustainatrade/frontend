import React, { Component } from "react";
import {
  Label,
  Item,
  List,
  Segment,
  Divider
  // Container
} from "semantic-ui-react";
// import axios from "axios";
// import get from "lodash/get";
import PostViewContext from "./../../contexts/PostViewContext";
import { getTagUrl } from "./../../contexts/PostFeedContext";
import CategoryContext from "./../../contexts/CategoryContext";
import imagePlaceholder from "./placeholder.png";
import { GlobalConsumer } from "./../../contexts";
import moment from "moment";
import UserLabel from "./../user-profile/UserLabel";
import { MsImage } from "./../../components";
import FollowButton from "./FollowButton";
import CommentButton from "./CommentButton";
import FbShareButton from "./FbShareButton";
import MoreButton from "./MoreButton";
import { VIEW_MODES } from "./../../contexts/PostViewContext";
import { getUrl } from "./../../contexts/PostFeedContext";
import WidgetGroup from "./../post-view/WidgetGroup";
import get from "lodash/get";
import config from "config";

import BaseLoader from "components/base-loader/BaseLoader";
import { Link } from "@reach/router";

import "./PostItem.css";

const path = localStorage.getItem("postPhotoPath");
const storage = localStorage.getItem("storage");

export const ShareButtons = ({ post }) => (
  <GlobalConsumer>
    {({ postView, user, postFeed: { setSearchesFn } }) => {
      return (
        <React.Fragment>
          <FbShareButton post={post} />
        </React.Fragment>
      );
    }}
  </GlobalConsumer>
);

const PostTags = ({ post, floated, postFeedContext: { setSearchesFn } }) => {
  return post.tags.map(tag => (
    <Label
      as={Link}
      to={getTagUrl({ name: tag })}
      key={tag}
      style={{ cursor: "pointer", float: floated }}
    >
      {tag}
    </Label>
  ));
};

export const PostActions = ({
  post,
  isCompact,
  isDetailed,
  noLabels = true
}) => (
  <GlobalConsumer>
    {({ postView, user, postFeed: postFeedContext }) => {
      const float = isDetailed ? "left" : "right";
      const dividerStyle = isDetailed ? {} : { margin: "4px 0px" };
      return (
        <React.Fragment>
          {isDetailed && <Divider style={dividerStyle} />}
          <div style={{ float }}>
            <FollowButton post={post} isCompact={isCompact} />
            <CommentButton
              post={post}
              isCompact={isCompact}
              postViewContext={postView}
            />
            <MoreButton isCompact={isCompact} post={post} userContext={user} />
          </div>
          <Divider fitted hidden clearing />
          <Divider
            fitted={!isDetailed}
            hidden={!isDetailed}
            style={dividerStyle}
          />
          {!noLabels &&
            !isCompact && (
              <PostTags
                post={post}
                floated={float}
                postFeedContext={postFeedContext}
              />
            )}
        </React.Fragment>
      );
    }}
  </GlobalConsumer>
);

export const TitleLabels = ({ post, isRemoved, withLabels }) => {
  const sectionContent = withLabels ? (
    <React.Fragment>
      Section
      <Label.Detail>{post.section.toUpperCase()}</Label.Detail>
    </React.Fragment>
  ) : (
    post.section.toUpperCase()
  );
  return (
    <React.Fragment>
      <Label
        color={get(config.sections.find(s => s.key === post.section), "color")}
        size="small"
        image={withLabels}
        basic={!withLabels}
      >
        {sectionContent}
      </Label>
      {isRemoved && (
        <Label color="red" size="small">
          REMOVED
        </Label>
      )}
    </React.Fragment>
  );
};
export default class PostItem extends Component {
  state = {};

  renderImage() {
    const { post, isCompact } = this.props;

    let feedPhoto = imagePlaceholder;
    if (post.photos[0]) feedPhoto = `${storage}${path}/${post.photos[0]}`;
    const msImageProps = {
      as: Item.Image,
      src: feedPhoto,
      height: 75,
      width: 75,
      block: true
    };
    return (
      <PostViewContext.Consumer>
        {({ viewPostFn, loading, postViewMode, loadingRefNo }) => {
          const loadingImg = loadingRefNo === post._refNo && loading;
          if (postViewMode === VIEW_MODES.compact && !isCompact) {
            return <React.Fragment />;
          }
          return (
            <React.Fragment>
              {isCompact && (
                <div className="image">
                  {postViewMode !== VIEW_MODES.compact && (
                    <MsImage
                      {...msImageProps}
                      loading={loadingImg}
                      onClick={() => viewPostFn(post._refNo)}
                    />
                  )}
                  <PostActions
                    isDetailed={this.props.detailed}
                    post={post}
                    isCompact
                  />
                </div>
              )}
              {!isCompact && (
                <MsImage
                  style={{
                    width: 75
                  }}
                  {...msImageProps}
                  loading={loadingImg}
                  onClick={() => viewPostFn(post._refNo)}
                />
              )}
            </React.Fragment>
          );
        }}
      </PostViewContext.Consumer>
    );
  }

  render() {
    const { post, isCompact, isRemoved, basic, detailed } = this.props;

    if (!post) {
      return <React.Fragment />;
    }

    const section = config.sections.find(s => s.key === post.section);
    if (!section) {
      return <React.Fragment />;
    }

    return (
      <GlobalConsumer>
        {({
          postFeed: postFeedContext,
          postView: { viewPostFn, postViewMode, loading },
          responsive: { isMobile },
          user: { user }
        }) => {
          return (
            <Item className="post">
              {this.renderImage()}
              <Item.Content>
                {!isCompact &&
                  !detailed && (
                    <div style={{ float: "right" }}>
                      <PostActions
                        isDetailed={this.props.detailed}
                        post={post}
                      />
                    </div>
                  )}
                <Item.Header className="title" as={Link} to={getUrl(post)}>
                  {detailed ? (
                    <h1>{post.title}</h1>
                  ) : (
                    <React.Fragment>
                      <TitleLabels post={post} isRemoved={isRemoved} />
                      {post.title}
                    </React.Fragment>
                  )}
                </Item.Header>
                <Item.Meta
                  className={
                    isCompact || isMobile ? "mobile-meta" : "desktop-meta"
                  }
                >
                  <List size="tiny" horizontal={!(isCompact || isMobile)}>
                    {!basic && (
                      <List.Item>
                        <List.Icon name="user" />
                        <List.Content>
                          <UserLabel refNo={post.createdBy} />
                        </List.Content>
                      </List.Item>
                    )}
                    <CategoryContext.Consumer>
                      {({ icons, categories }) => (
                        <List.Item>
                          <List.Icon
                            name={get(icons, post.category, "spinner")}
                          />
                          <List.Content>
                            {get(categories, post.category, "---")}
                          </List.Content>
                        </List.Item>
                      )}
                    </CategoryContext.Consumer>
                    <List.Item>
                      <List.Icon name="clock" />
                      <List.Content>
                        {moment(parseInt(post.createdDate, 10)).fromNow()}
                      </List.Content>
                    </List.Item>
                  </List>
                </Item.Meta>
                {!basic && (
                  <Item.Description>
                    <PostTags post={post} postFeedContext={postFeedContext} />
                    <Segment
                      basic
                      secondary
                      size="large"
                      style={{ marginBottom: 10 }}
                    >
                      <p style={{ whiteSpace: "pre-wrap" }}>
                        {post.description}
                      </p>
                    </Segment>
                  </Item.Description>
                )}
                <Item.Extra>
                  <WidgetGroup entity={post} />
                </Item.Extra>
              </Item.Content>
            </Item>
          );
        }}
      </GlobalConsumer>
    );
  }
}

export const PostItemPlaceHolder = props => (
  <BaseLoader
    desktopHeight={50}
    mobileHeight={70}
    desktopWidth={660}
    mobileWidth={225}
    {...props}
  >
    {height => (
      <React.Fragment>
        <rect x="60" y="5" rx="4" ry="4" width="189.54" height="15" />
        <rect x="60" y="23" rx="3" ry="3" width="60" height="10" />
        <rect x="60" y="40" rx="3" ry="3" width="60.82" height="10" />
        <rect x="60" y="55" rx="3" ry="3" width="60.82" height="10" />
        <rect x="60" y="75" rx="2" ry="2" width="60" height="18" />
        <rect x="240" y="75" rx="2" ry="2" width="60" height="18" />
        <rect x="0" y="5" rx="0" ry="0" width="50" height="50" />
      </React.Fragment>
    )}
  </BaseLoader>
);
