import React from "react";
import Content from "./../base/Content";
import { Button, Divider } from "semantic-ui-react";

export function DefaultSaveButton(props) {
  return (
    <div style={{ marginTop: 5, marginBottom: 0 }}>
      <Divider clearing />
      <Button
        primary
        icon="save"
        size="large"
        content="Submit"
        disabled={props.submitting}
        loading={props.submitting}
        onClick={() => {
          props.actions.save();
        }}
      />
    </div>
  );
}

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
