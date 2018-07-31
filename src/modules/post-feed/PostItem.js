import React, { Component } from "react";
import {
  Label,
  Item,
  Button,
  List,
  Icon
  // Container
} from "semantic-ui-react";
import { HLink } from "./../../lib/history";
import axios from "axios";
import get from "lodash/get";
import PostViewContext from "./../../contexts/PostViewContext";
import PostFeedContext from "./../../contexts/PostFeedContext";
import CategoryContext from "./../../contexts/CategoryContext";
import imagePlaceholder from "./placeholder.png";
import { GlobalConsumer } from "./../../contexts";
import moment from "moment";
import { Share } from "react-facebook";
import { kebabCase } from "lodash";
import UserLabel from "./../user-profile/UserLabel";
import { MsImage } from "./../../components";
import FollowButton from "./FollowButton";
import MoreProps from "./MoreProps";

import "./PostItem.css";
import Popover from "antd/lib/popover";
const path = localStorage.getItem("postPhotoPath");
const storage = localStorage.getItem("storage");

export function getShareUrl(post) {
  return `https://sustainatrade.com/posts/${kebabCase(
    post.title.substring(0, 30)
  )}/${post._refNo}`;
}

export default class PostItem extends Component {
  state = { commentCount: 0 };

  renderActions(post, isMobile) {
    return (
      <GlobalConsumer>
        {({ postView: { viewPostFn } }) => (
          <React.Fragment>
            <FollowButton post={post} isMobile={isMobile} />
            {(() => {
              if (isMobile)
                return (
                  <Label as="a" className="actn-lbl">
                    <Icon name="quote left" />
                    {this.state.commentCount}
                  </Label>
                );
              if (!isMobile)
                return (
                  <Button
                    as="div"
                    labelPosition="right"
                    title="Comments"
                    onClick={() => viewPostFn(post._refNo)}
                  >
                    <Button icon>
                      <Icon name="quote left" title="Comments" />
                    </Button>
                    <Label as="a" basic pointing="left">
                      {this.state.commentCount}
                    </Label>
                  </Button>
                );
            })()}
            {!isMobile && (
              <Share href={getShareUrl(post)}>
                <Button icon color="facebook" title={getShareUrl(post)}>
                  <Icon name="facebook f" title="Comments" />
                </Button>
              </Share>
            )}
            {(() => {
              const poProps = {
                placement: "bottomRight"
              };
              if (isMobile) {
                poProps.placement = "rightBottom";
              }
              return (
                <Popover
                  content={
                    <div
                      style={{ width: 200 }}
                      onClick={() => this.setState({ showMore: false })}
                    >
                      <MoreProps post={post} isMobile={isMobile} />
                    </div>
                  }
                  trigger="click"
                  visible={this.state.showMore}
                  onVisibleChange={showMore => this.setState({ showMore })}
                  {...poProps}
                >
                  {isMobile ? (
                    <Label basic as="a" className="actn-lbl">
                      <center>
                        <Icon name="ellipsis horizontal" />
                      </center>
                    </Label>
                  ) : (
                    <Button basic icon="ellipsis horizontal" title="More" />
                  )}
                </Popover>
              );
            })()}
          </React.Fragment>
        )}
      </GlobalConsumer>
    );
  }

  renderImage() {
    const { post, isMobile } = this.props;

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
        {({ viewPostFn, loading, loadingRefNo }) => {
          const loadingImg = loadingRefNo === post._refNo && loading;
          return (
            <React.Fragment>
              {isMobile && (
                <div className="image">
                  <MsImage
                    {...msImageProps}
                    loading={loadingImg}
                    onClick={() => viewPostFn(post._refNo)}
                  />
                  {this.renderActions(post, true)}
                </div>
              )}
              {!isMobile && (
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
    const { post, isMobile, basic } = this.props;
    return (
      <Item className="post">
        <PostFeedContext.Consumer>
          {({ setSearchesFn }) => (
            <PostViewContext.Consumer>
              {({ viewPostFn, loading }) => (
                <React.Fragment>
                  {this.renderImage()}
                  <Item.Content>
                    {!isMobile && (
                      <div style={{ float: "right" }}>
                        {this.renderActions(post)}
                      </div>
                    )}
                    <Item.Header
                      className="title"
                      as={HLink}
                      to={`/posts/${kebabCase(post.title.substring(0, 30))}/${
                        post._refNo
                      }`}
                    >
                      <Label
                        color={post.section === "sell" ? "green" : "orange"}
                        basic
                        size="small"
                      >
                        {post.section.toUpperCase()}
                      </Label>
                      <span>{post.title}</span>
                    </Item.Header>
                    <Item.Meta
                      className={isMobile ? "mobile-meta" : "desktop-meta"}
                    >
                      <List horizontal={!isMobile}>
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
                            {moment(new Date(post.createdDate)).fromNow()}
                          </List.Content>
                        </List.Item>
                      </List>
                    </Item.Meta>
                    {!basic && (
                      <Item.Description>{post.description}</Item.Description>
                    )}
                    <Item.Extra>
                      {/* <Label
                        color={post.section === "sell" ? "green" : "orange"}
                      >
                        <Icon name="weixin" />
                        <Label.Detail>
                          {post.section.toUpperCase()}
                        </Label.Detail>
                      </Label> */}
                      {post.tags.map(tag => (
                        <Label
                          key={tag}
                          onClick={() => setSearchesFn({ PostTag: tag })}
                          style={{ cursor: "pointer" }}
                          content={tag}
                        />
                      ))}
                    </Item.Extra>
                  </Item.Content>
                </React.Fragment>
              )}
            </PostViewContext.Consumer>
          )}
        </PostFeedContext.Consumer>
      </Item>
    );
  }
}
