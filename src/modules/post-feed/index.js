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
import { history } from "./../../lib/history";
import PostItem from "./PostItem";
import Filters from "./Filters";
import Post from "./../post-view";
import PostFeedContext from "./../../contexts/PostFeedContext";
import PostViewContext from "./../../contexts/PostViewContext";
import ResponsiveContext from "./../../contexts/Responsive";
import { GlobalConsumer } from "./../../contexts";
import Modal from "antd/lib/modal";
import PropChangeHandler from "../../components/prop-change-handler/PropChangeHandler";
import ContentWrapper from "./../../components/content-wrapper/ContentWrapper";

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
                      isRemoved={post.isRemoved}
                    />
                  );
                })}
                {loadingMore && !noMore && <PlaceHolder isMobile={isMobile} />}
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
                  <Button
                    content="Show More"
                    basic
                    fluid
                    onClick={() => loadMoreFn()}
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
            return (
              <React.Fragment>
                <PropChangeHandler
                  prop={user}
                  handler={user => user && loadPostCountFn(user.id)}
                />
                <Filters isMobile={isMobile} />
                <Divider />
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
                <Visibility
                  fireOnMount
                  continuous
                  offset={[10, 10]}
                  onUpdate={(e, { calculations }) => {
                    if (calculations.bottomVisible) {
                      loadMoreFn();
                    }
                  }}
                >
                  {categories && <Feed categories={categories} />}
                </Visibility>
              </React.Fragment>
            );
          }}
        </GlobalConsumer>
      </div>
    );
  }
}
