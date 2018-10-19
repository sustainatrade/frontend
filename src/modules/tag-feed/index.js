import React, { Component } from "react";
import FeedContent from "./../post-feed/FeedContent";
import { Header, Icon, Segment } from "semantic-ui-react";
import { GlobalConsumer } from "./../../contexts";

class TagFeed extends Component {
  render() {
    const { tagName, context } = this.props;
    return (
      <div>
        <FeedContent
          postFeedContext={context.postFeed}
          search={{ PostTag: tagName }}
          header={
            <Segment basic>
              <Header as="h1">
                <Icon name="tag" color="grey" />
                <Header.Content>{tagName}</Header.Content>
              </Header>
            </Segment>
          }
        />
      </div>
    );
  }
}

export default props => (
  <GlobalConsumer>
    {context => <TagFeed key={props.tagName} context={context} {...props} />}
  </GlobalConsumer>
);
