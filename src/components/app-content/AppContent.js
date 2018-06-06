import React from 'react';
import { Container, Segment } from 'semantic-ui-react'
/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
export default class AppContent extends React.Component {

  render() {
    const { fluid } = this.props;
    let content = (<Segment basic>
        {this.props.children} 
      </Segment>)
    if(fluid)
      content = this.props.children;
    return (
      <Container {...this.props}>
      {content}
      </Container>
    )
  }
}