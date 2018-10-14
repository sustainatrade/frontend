import React, { Component } from "react";
import FeedContent from "./../post-feed/FeedContent";
import { Header, Icon, Segment } from "semantic-ui-react";
import { GlobalConsumer } from "./../../contexts";

class TagFeed extends Component {
  state = {
    disableInfiniteScroll: true
  };
  async componentWillMount() {
    const { tagName, context } = this.props;
    const {
      // category: { loading, categories },
      // user: { user },
      // responsive: { isMobile },
      postFeed: { setSearchesFn }
    } = context;
    await setSearchesFn({ PostTag: tagName });
    this.setState({ disableInfiniteScroll: false });
  }
  render() {
    const { tagName } = this.props;
    const { disableInfiniteScroll } = this.state;
    return (
      <div>
        <FeedContent
          disableInfiniteScroll={disableInfiniteScroll}
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
