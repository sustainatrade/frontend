import React from "react";
import Content from "./../base/Content";

export default class Text extends React.Component {
  render() {
    return (
      <Content
        previewData={{
          test: "haha"
        }}
        editor={props => {
          return <div />;
        }}
        view={props => <div />}
        compact={props => <div />}
        {...this.props}
      />
    );
  }
}
