import React, { Component } from "react";
import { GlobalConsumer } from "./../../contexts";
import PropChangeHandler from "../../components/prop-change-handler/PropChangeHandler";
import Filters from "./Filters";
import {
  Item,
  Label,
  Menu,
  Segment,
  Icon,
  Button,
  Divider
} from "semantic-ui-react";
import { startCase } from "lodash";
import { PostItemPlaceHolder } from "./PostItem";
import PostItem from "../post-item";

import PostFeedContext from "./../../contexts/PostFeedContext";
import ResponsiveContext from "./../../contexts/Responsive";

import VisibilityButton from "./../../components/visibility-button/VisibilityButton";

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

const Feed = ({ categories, disableInfiniteScroll }) => {
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
                    !disableInfiniteScroll && (
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
                    )
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

export default class FeedContent extends Component {
  state = {
    activeMenu: "latest",
    fetchTimeStamp: Date.now(),
    disableInfiniteScroll: true
  };

  componentDidCatch(error, info) {
    console.log("error"); //TRACE
    console.log(error, info); //TRACE
  }

  async componentDidMount() {
    const {
      search = {},
      postFeedContext: { scrollPos, searches = {}, setSearchesFn }
    } = this.props;

    if (JSON.stringify(search) !== JSON.stringify(searches)) {
      console.log("search feedcontent"); //TRACE
      console.log(search); //TRACE
      await setSearchesFn(search);
    } else {
      window.scrollTo(0, scrollPos);
    }
    this.setState({ disableInfiniteScroll: false });
  }

  componentWillUnmount() {
    const {
      postFeedContext: { setScrollPos }
    } = this.props;
    const scrollHeight = window.pageYOffset;
    setScrollPos(scrollHeight);
  }

  render() {
    const { header } = this.props;
    const { disableInfiniteScroll } = this.state;
    return (
      <GlobalConsumer>
        {({
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
        }) => (
          <React.Fragment>
            <PropChangeHandler
              prop={user}
              handler={user => user && loadPostCountFn(user.id)}
            />
            <Filters isMobile={isMobile} />
            {header}
            <Menu secondary pointing {...(isMobile ? { size: "mini" } : {})}>
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
            <Feed disableInfiniteScroll={disableInfiniteScroll} />
          </React.Fragment>
        )}
      </GlobalConsumer>
    );
  }
}
