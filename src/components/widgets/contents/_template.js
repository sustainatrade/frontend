import React from "react";
import WidgetBase from "./../base/WidgetBase";

export default class Text extends React.Component {
  render() {
    return (
      <WidgetBase
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
