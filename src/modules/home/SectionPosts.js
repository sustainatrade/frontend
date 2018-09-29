import React from "react";
import { Segment, Header, Item } from "semantic-ui-react";
import PostItem, { PostItemPlaceHolder } from "./../post-feed/PostItem";
import { GlobalConsumer } from "./../../contexts";
import { Link } from "@reach/router";
import PostFeedContext from "./../../contexts/PostFeedContext";
import { range } from "lodash";

const Posts = ({ list }) => {
  return (
    <GlobalConsumer>
      {({ category: { categories }, responsive: { isMobile } }) => (
        <Item.Group divided unstackable={isMobile}>
          {list
            ? list.map(post => {
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
              })
            : range(5).map(i => (
                <PostItemPlaceHolder key={"pl" + i} isMobile={isMobile} />
              ))}
        </Item.Group>
      )}
    </GlobalConsumer>
  );
};

export default class SectionPosts extends React.Component {
  render() {
    const { section, posts } = this.props;
    const { color, displayName } = section;
    return (
      <React.Fragment>
        <Header as="h5" attached="top" color={color} style={{ width: "100%" }}>
          Recent {displayName}
          <PostFeedContext.Consumer>
            {({ setFiltersFn }) => (
              <Link
                style={{ float: "right" }}
                to={`/posts`}
                onClick={() => setFiltersFn({ section: section.key })}
              >
                More >>
              </Link>
            )}
          </PostFeedContext.Consumer>
        </Header>
        <Segment attached color={color} style={{ width: "100%" }}>
          <Posts list={posts} />
        </Segment>
      </React.Fragment>
    );
  }
}
