import React from "react";
import { Segment, Header, Item } from "semantic-ui-react";
import { PostItemPlaceHolder } from "./../post-feed/PostItem";
import PostItem from "./../post-item";
import { GlobalConsumer } from "./../../contexts";
import { Link } from "@reach/router";
import PostFeedContext from "./../../contexts/PostFeedContext";
import { range } from "lodash";

const Posts = ({ list }) => {
  return (
    <GlobalConsumer>
      {({ responsive: { isMobile } }) => (
        <Item.Group divided unstackable={isMobile}>
          {list
            ? list.map(post => {
                let postObj = post.node;
                if (post.isRemoved) {
                  postObj = postObj.post;
                }
                return (
                  <PostItem
                    isCompact={isMobile}
                    key={postObj.id}
                    post={postObj}
                    basic
                    isRemoved={postObj.isRemoved}
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
    const { content, posts } = this.props;
    const { code, name } = content;
    return (
      <React.Fragment>
        <Header as="h5" attached="top" color="grey" style={{ width: "100%" }}>
          Recent {name}
          <PostFeedContext.Consumer>
            {({ setFiltersFn }) => (
              <Link
                style={{ float: "right" }}
                to={`/p`}
                onClick={() => setFiltersFn({ content: code })}
              >
                More >>
              </Link>
            )}
          </PostFeedContext.Consumer>
        </Header>
        <Segment attached color="grey" style={{ width: "100%" }}>
          <Posts list={posts} />
        </Segment>
      </React.Fragment>
    );
  }
}
