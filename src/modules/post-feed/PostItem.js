import React, { Component } from "react";
import {
  Label,
  Item,
  Button,
  List,
  Icon,
  Divider
  // Container
} from "semantic-ui-react";
// import axios from "axios";
// import get from "lodash/get";
import PostViewContext from "./../../contexts/PostViewContext";
// import PostFeedContext from "./../../contexts/PostFeedContext";
import CategoryContext from "./../../contexts/CategoryContext";
import imagePlaceholder from "./placeholder.png";
import { GlobalConsumer } from "./../../contexts";
import moment from "moment";
import { Share } from "react-facebook";
import { kebabCase } from "lodash";
import UserLabel from "./../user-profile/UserLabel";
import { MsImage } from "./../../components";
import FollowButton from "./FollowButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import MoreButton from "./MoreButton";
import { VIEW_MODES } from "./../../contexts/PostViewContext";
import WidgetGroup from "./../post-view/WidgetGroup";

import { Link } from "@reach/router";

import "./PostItem.css";

const path = localStorage.getItem("postPhotoPath");
const storage = localStorage.getItem("storage");

export function getShareUrl(post) {
  return `https://sustainatrade.com/posts/${kebabCase(
    post.title.substring(0, 30)
  )}/${post._refNo}`;
}

export const PostActions = ({
  post,
  isCompact,
  isDetailed,
  noLabels = true
}) => (
  <GlobalConsumer>
    {({ postView, user, postFeed: { setSearchesFn } }) => {
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
            {!isCompact && isDetailed && <ShareButton post={post} />}
            <MoreButton isCompact={isCompact} post={post} userContext={user} />
          </div>
          <Divider fitted hidden clearing />
          <Divider
            fitted={!isDetailed}
            hidden={!isDetailed}
            style={dividerStyle}
          />
          {!noLabels &&
            !isCompact &&
            post.tags.map(tag => (
              <Label
                key={tag}
                onClick={() => setSearchesFn({ PostTag: tag })}
                style={{ cursor: "pointer", float }}
                content={tag}
              />
            ))}
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
        color={post.section === "sell" ? "green" : "orange"}
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

    return (
      <GlobalConsumer>
        {({
          postFeed: { setSearchesFn },
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
                <Item.Header
                  className="title"
                  as={Link}
                  to={`/posts/${kebabCase(post.title.substring(0, 30))}/${
                    post._refNo
                  }`}
                >
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
                  <List horizontal={!(isCompact || isMobile)}>
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
                          <List.Icon name={icons[post.category]} />
                          <List.Content>
                            {categories[post.category]}
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
                  <Item.Description>{post.description}</Item.Description>
                )}
                <Item.Extra>
                  <WidgetGroup entity={post} />
                  {detailed && (
                    <div>
                      <PostActions
                        isDetailed={this.props.detailed}
                        post={post}
                        noLabels={false}
                      />
                    </div>
                  )}
                </Item.Extra>
              </Item.Content>
            </Item>
          );
        }}
      </GlobalConsumer>
    );
  }
}
