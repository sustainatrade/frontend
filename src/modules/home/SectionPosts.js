import React from "react";
import { Segment, Header, Loader, Item } from "semantic-ui-react";
import PostItem from "./../post-feed/PostItem";
import { GlobalConsumer } from "./../../contexts";
import { HLink } from "./../../lib/history";
import { Link } from "@reach/router";
import PostFeedContext from "./../../contexts/PostFeedContext";

const Posts = ({ list }) => {
  return (
    <GlobalConsumer>
      {({ category: { categories }, responsive: { isMobile } }) => (
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
        <Header as="h5" attached="top" color={color}>
          Recent {displayName}
          <PostFeedContext.Consumer>
            {({ setFiltersFn }) => (
              <Link
                style={{ float: "right" }}
                to={`/p`}
                onClick={() => setFiltersFn({ section: section.key })}
              >
                More >>
              </Link>
            )}
          </PostFeedContext.Consumer>
        </Header>
        <Segment attached color={color}>
          {posts ? <Posts list={posts} /> : <Loader active inline="centered" />}
        </Segment>
      </React.Fragment>
    );
  }
}
