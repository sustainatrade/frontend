import React, { Component } from "react";
import {
  Item,
  Label,
  Menu,
  Icon,
  Visibility,
  Button,
  Divider
} from "semantic-ui-react";
// import { Query } from 'react-apollo'
// import gql from 'graphql-tag'
import ContentLoader from "react-content-loader";
import { startCase } from "lodash";
import TagList from "./TagList";
import PostItem from "./PostItem";
import Searches from "./Searches";
import Post from "./../post-view";
import PostFeedContext from "./../../contexts/PostFeedContext";
import PostViewContext from "./../../contexts/PostViewContext";
import ResponsiveContext from "./../../contexts/Responsive";
import { GlobalConsumer } from "./../../contexts";
import Modal from "antd/lib/modal";
import PropHandler from "../../components/prophandler/PropHandler";

const PlaceHolder = ({ isMobile, ...props }) => (
  <ContentLoader
    height={50}
    width={isMobile ? 130 : 700}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="60" y="5" rx="4" ry="4" width="189.54" height="15" />
    <rect x="60" y="23" rx="3" ry="3" width="60" height="10" />
    <rect x="60" y="40" rx="3" ry="3" width="60.82" height="10" />
    <rect x="60" y="55" rx="3" ry="3" width="60.82" height="10" />
    <rect x="60" y="75" rx="2" ry="2" width="60" height="18" />
    <rect x="240" y="75" rx="2" ry="2" width="60" height="18" />
    <rect x="0" y="5" rx="0" ry="0" width="50" height="50" />
  </ContentLoader>
);

export default class PostFeed extends Component {
  state = {
    activeMenu: "latest",
    fetchTimeStamp: Date.now()
  };

  renderFeed(categories) {
    return (
      <ResponsiveContext.Consumer>
        {({ isMobile }) => (
          <PostFeedContext.Consumer>
            {({
              setFiltersFn,
              filters,
              skip,
              limit,
              list,
              loadingMore,
              noMore
            }) => {
              return (
                <Item.Group divided unstackable={isMobile}>
                  {list.map(post => {
                    return (
                      <PostItem
                        isMobile={isMobile}
                        key={post._refNo}
                        post={post}
                        categories={categories}
                        basic
                      />
                    );
                  })}
                  {loadingMore &&
                    !noMore && <PlaceHolder isMobile={isMobile} />}
                  {noMore && (
                    <Button
                      fluid
                      basic
                      color="green"
                      content="Ooops. No more post here!!"
                    />
                  )}
                  <Divider key="more-trigger" />
                </Item.Group>
              );
            }}
          </PostFeedContext.Consumer>
        )}
      </ResponsiveContext.Consumer>
    );
  }

  renderPostView() {
    //TODO: move this to globals
    return (
      <PostViewContext.Consumer>
        {({ post, closeFn }) => {
          return (
            <Modal
              width="1024px"
              visible={post !== undefined}
              title={
                <div>
                  <Icon name="sticky note" />Post View
                </div>
              }
              footer={null}
              keyboard={false}
              onCancel={closeFn}
            >
              {post && <Post />}
            </Modal>
          );
        }}
      </PostViewContext.Consumer>
    );
  }

  createTabMenu = ({ name, icon, count, countColor, onClickFn }) => (
    <Menu.Item
      fitted
      name={name}
      active={this.state.activeMenu === name}
      onClick={() => {
        this.setState({
          activeMenu: name,
          fetchTimeStamp: Date.now()
        });
        onClickFn && onClickFn();
      }}
    >
      <Icon name={icon} />
      {startCase(name)}
      {count > 0 && (
        <Label
          size="mini"
          color={countColor || "yellow"}
          content={`${count}`}
        />
      )}
    </Menu.Item>
  );

  render() {
    return (
      <div>
        <TagList />
        <Divider />
        <GlobalConsumer>
          {({
            category: { loading, categories },
            user: { user },
            responsive: { isMobile },
            postFeed: {
              unreadPosts,
              clearUnreadFn,
              loadingFollowedPostsFn,
              loadUserPostsFn,
              loadMoreFn,
              loadPostCountFn,
              postCount
            }
          }) => {
            return (
              <React.Fragment>
                <PropHandler
                  prop={user}
                  handler={user => user && loadPostCountFn(user.id)}
                />
                <Searches />
                <Divider />
                <Menu
                  secondary
                  pointing
                  {...(isMobile ? { size: "mini" } : {})}
                >
                  {this.createTabMenu({
                    name: "latest",
                    icon: "time",
                    count: unreadPosts.length,
                    onClickFn: clearUnreadFn
                  })}
                  {user &&
                    this.createTabMenu({
                      name: "following",
                      icon: "bookmark",
                      count: postCount.followed,
                      countColor: "grey",
                      onClickFn: loadingFollowedPostsFn
                    })}
                  {user &&
                    this.createTabMenu({
                      name: "my posts",
                      icon: "pen square",
                      count: postCount.myPosts,
                      countColor: "grey",
                      onClickFn: () => loadUserPostsFn(user.id)
                    })}
                </Menu>
                <Visibility
                  fireOnMount
                  offset={[10, 10]}
                  onUpdate={(e, { calculations }) => {
                    if (calculations.bottomVisible) {
                      loadMoreFn();
                    }
                  }}
                >
                  {categories && this.renderFeed(categories)}
                </Visibility>
              </React.Fragment>
            );
          }}
        </GlobalConsumer>
        {this.renderPostView()}
      </div>
    );
  }
}
