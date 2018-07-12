import React, { Component } from "react";
import {
  Label,
  Item,
  Button,
  List,
  Icon
  // Container
} from "semantic-ui-react";
import PostViewContext from "./../../contexts/PostViewContext";
import PostFeedContext from "./../../contexts/PostFeedContext";
import CategoryContext from "./../../contexts/CategoryContext";
import imagePlaceholder from "./placeholder.png";
import { GlobalConsumer } from "./../../contexts";
import { Mutation } from "react-apollo";
import moment from "moment";
import UserLabel from "./../user-profile/UserLabel";
import { MsImage } from "./../../components";
import { FOLLOW_POST } from "./../../gql-schemas";
import "./PostItem.css";
import Popover from "antd/lib/popover";
const path = localStorage.getItem("postPhotoPath");
const storage = localStorage.getItem("storage");

class FollowButton extends Component {
  state = {};
  render() {
    const { post, isMobile } = this.props;
    return (
      <Mutation mutation={FOLLOW_POST}>
        {(followPost, { data, loading, error }) => {
          let followerColor = "black";
          let title = "Click to follow";
          let followers = post.followerCount;
          const { newFollowing } = this.state;
          let following = post.isFollowing;
          const iconProps = { name: "bookmark" };
          if (loading) {
            iconProps.name = "spinner";
            iconProps.loading = true;
          }
          if (data) {
            following = newFollowing;
            if (post.isFollowing) {
              if (!following) followers--;
            } else if (following) followers++;
          }

          if (following) {
            title = "Unfollow";
            followerColor = post.section === "sell" ? "green" : "orange";
          }
          const onClickHandler = async () => {
            // const { toggles } = this.state;
            followPost({
              variables: {
                postRefNo: post._refNo,
                revoke: following
              }
            });
            this.setState({ newFollowing: !following });
          };
          return (
            <React.Fragment>
              {isMobile && (
                <Label
                  as="a"
                  className="actn-lbl"
                  color={followerColor}
                  onClick={onClickHandler}
                >
                  <Icon {...iconProps} /> {followers} Followers
                </Label>
              )}
              {!isMobile && (
                <Button
                  as="div"
                  labelPosition="right"
                  title={title}
                  onClick={onClickHandler}
                >
                  <Button color={followerColor} icon>
                    <Icon {...iconProps} />
                  </Button>
                  <Label color={followerColor} as="a" basic pointing="left">
                    {followers}
                  </Label>
                </Button>
              )}
            </React.Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default class PostItem extends Component {
  state = {};

  renderMoreProps(post, isMobile) {
    return (
      <GlobalConsumer>
        {({
          createPost: { openModal },
          user: { user },
          postView: { reportPostFn }
        }) => {
          const isMyPost = user && post.createdBy === user.id;
          return (
            <List divided relaxed>
              {isMyPost && (
                <List.Item
                  as="a"
                  onClick={() => {
                    openModal(post._refNo);
                  }}
                >
                  <List.Icon name="edit" size="large" verticalAlign="middle" />
                  <List.Content>Edit Post</List.Content>
                </List.Item>
              )}
              <List.Item
                as="a"
                onClick={() => {
                  reportPostFn(post._refNo);
                }}
              >
                <List.Icon name="flag" size="large" verticalAlign="middle" />
                <List.Content>Report</List.Content>
              </List.Item>
            </List>
          );
        }}
      </GlobalConsumer>
    );
  }
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
                    0 Comments
                    {/* <CommentsCount href={`https://sustainatrade.com/posts/${post._refNo}`} /> */}
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
                    <Button color="black" icon>
                      <Icon name="quote left" title="Comments" />
                    </Button>
                    <Label as="a" basic pointing="left">
                      0
                      {/* <CommentsCount href={`https://sustainatrade.com/posts/${post._refNo}`} /> */}
                    </Label>
                  </Button>
                );
            })()}
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
                    <div onClick={() => this.setState({ showMore: false })}>
                      {this.renderMoreProps(post)}
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
    return (
      <PostViewContext.Consumer>
        {({ viewPostFn, loading }) => (
          <React.Fragment>
            {isMobile && (
              <div className="image">
                <MsImage
                  as={Item.Image}
                  src={feedPhoto}
                  height={125}
                  width={125}
                  loading={loading}
                  block
                  style={{
                    cursor: "pointer",
                    minHeight: 125
                  }}
                  onClick={() => viewPostFn(post._refNo)}
                />
                {this.renderActions(post, true)}
              </div>
            )}
            {!isMobile && (
              <MsImage
                as={Item.Image}
                src={feedPhoto}
                height={200}
                width={200}
                loading={loading}
                block
                style={{
                  cursor: "pointer",
                  minHeight: 200
                }}
                onClick={() => viewPostFn(post._refNo)}
              />
            )}
          </React.Fragment>
        )}
      </PostViewContext.Consumer>
    );
  }

  render() {
    const { post, isMobile } = this.props;
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
                    <Item.Header as="a" onClick={() => viewPostFn(post._refNo)}>
                      {post.title}
                    </Item.Header>
                    <Item.Meta>
                      <List>
                        <List.Item>
                          <List.Icon name="user" />
                          <List.Content>
                            <UserLabel refNo={post.createdBy} />
                          </List.Content>
                        </List.Item>
                        <List.Item>
                          <List.Icon name="clock" />
                          <List.Content>
                            {moment(new Date(post.createdDate)).fromNow()}
                          </List.Content>
                        </List.Item>
                      </List>
                      <div>
                        <Label
                          color={post.section === "sell" ? "green" : "orange"}
                        >
                          <Icon name="weixin" />
                          <Label.Detail>
                            {post.section.toUpperCase()}
                          </Label.Detail>
                        </Label>
                        <CategoryContext.Consumer>
                          {({ icons, categories }) => (
                            <Label color={"black"}>
                              <Icon name={icons[post.category]} />
                              <Label.Detail>
                                {categories[post.category]}
                              </Label.Detail>
                            </Label>
                          )}
                        </CategoryContext.Consumer>
                      </div>
                    </Item.Meta>
                    <Item.Description>{post.description}</Item.Description>
                    <Item.Extra>
                      <div>
                        {post.tags.map(tag => (
                          <Label
                            key={tag}
                            size="small"
                            onClick={() => setSearchesFn({ PostTag: tag })}
                            style={{ cursor: "pointer" }}
                            content={tag}
                          />
                        ))}
                      </div>
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
