import React, { Component } from "react";
import {
  Item,
  Label,
  Menu,
  Segment,
  Icon,
  Button,
  Divider
} from "semantic-ui-react";
// import { Query } from 'react-apollo'
// import gql from 'graphql-tag'
import { startCase } from "lodash";
import PostItem, { PostItemPlaceHolder } from "./PostItem";
import Filters from "./Filters";
import PostFeedContext from "./../../contexts/PostFeedContext";
import ResponsiveContext from "./../../contexts/Responsive";
import { GlobalConsumer } from "./../../contexts";
import PropChangeHandler from "../../components/prop-change-handler/PropChangeHandler";
import VisibilityButton from "./../../components/visibility-button/VisibilityButton";
import Post from "./../post-view";
import { Router } from "@reach/router";

const PostView = props => <Post {...props} />;

const TabMenu = ({ self, name, icon, count, countColor, onClickFn }) => (
  <Menu.Item
    fitted
    name={name}
    active={self.state.activeMenu === name}
    onClick={() => {
      self.setState({
        activeMenu: name,
        fetchTimeStamp: Date.now()
      });
      onClickFn && onClickFn();
    }}
  >
    <Icon name={icon} />
    {startCase(name)}
    {count > 0 && (
      <Label size="mini" color={countColor || "yellow"} content={`${count}`} />
    )}
  </Menu.Item>
);

const Feed = ({ categories }) => {
  return (
    <ResponsiveContext.Consumer>
      {({ isMobile }) => (
        <PostFeedContext.Consumer>
          {({
            setFiltersFn,
            filters,
            skip,
            limit,
            loadMoreFn,
            list,
            loadingMore,
            noMore
          }) => {
            return (
              <Segment basic style={{ paddingTop: 0, marginBottom: 20 }}>
                <Item.Group divided unstackable={isMobile}>
                  {list.map(post => {
                    let postObj = post;
                    if (post.isRemoved) {
                      postObj = post.post;
                    }
                    return (
                      <PostItem
                        isCompact={isMobile}
                        key={post._refNo}
                        post={postObj}
                        categories={categories}
                        basic
                        withLabels={false}
                        isRemoved={post.isRemoved}
                      />
                    );
                  })}
                  {loadingMore &&
                    !noMore && <PostItemPlaceHolder isMobile={isMobile} />}
                  {noMore ? (
                    <Button
                      fluid
                      basic
                      color="green"
                      content="Ooops. No more post here!!"
                    />
                  ) : loadingMore ? (
                    <React.Fragment />
                  ) : (
                    <VisibilityButton
                      content="Show More"
                      basic
                      fluid
                      onClick={() => loadMoreFn()}
                      onUpdate={(e, { calculations }) => {
                        if (calculations.bottomVisible) {
                          loadMoreFn();
                        }
                      }}
                    />
                  )}
                  <Divider key="more-trigger" />
                </Item.Group>
              </Segment>
            );
          }}
        </PostFeedContext.Consumer>
      )}
    </ResponsiveContext.Consumer>
  );
};

export default class PostFeed extends Component {
  state = {
    activeMenu: "latest",
    fetchTimeStamp: Date.now()
  };

  render() {
    return (
      <div>
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
            const FeedContent = () => (
              <React.Fragment>
                <Filters isMobile={isMobile} />
                <Menu
                  secondary
                  pointing
                  {...(isMobile ? { size: "mini" } : {})}
                >
                  <TabMenu
                    {...{
                      self: this,
                      name: "latest",
                      icon: "time",
                      count: unreadPosts.length,
                      onClickFn: clearUnreadFn
                    }}
                  />
                  {user && (
                    <TabMenu
                      {...{
                        self: this,
                        name: "following",
                        icon: "bookmark",
                        count: postCount.followed,
                        countColor: "grey",
                        onClickFn: loadingFollowedPostsFn
                      }}
                    />
                  )}
                  {user && (
                    <TabMenu
                      {...{
                        self: this,
                        name: "my posts",
                        icon: "pen square",
                        count: postCount.myPosts,
                        countColor: "grey",
                        onClickFn: () => loadUserPostsFn(user.id)
                      }}
                    />
                  )}
                </Menu>
                {categories && <Feed categories={categories} />}
              </React.Fragment>
            );
            return (
              <React.Fragment>
                <PropChangeHandler
                  prop={user}
                  handler={user => user && loadPostCountFn(user.id)}
                />
                <Router primary={false}>
                  <PostView path="/:postTitle/:postRefNo" />
                  <FeedContent default />
                </Router>
              </React.Fragment>
            );
          }}
        </GlobalConsumer>
      </div>
    );
  }
}
