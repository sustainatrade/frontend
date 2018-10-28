import React from "react";
import WidgetBase from "./../base/WidgetBase";
import get from "lodash/get";
import debounce from "lodash/debounce";
import { TextArea } from "semantic-ui-react";

const Preview = props => (
  <div
    style={{
      textAlign: "left",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word"
    }}
  >
    {get(props, "values.text")}
  </div>
);

export default class Text extends React.Component {
  render() {
    return (
      <WidgetBase
        previewData={{
          text: "lorem ipsum dolor"
        }}
        editor={props => {
          return (
            <TextArea
              style={{ width: "100%" }}
              defaultValue={get(props, "defaultValues.text")}
              rows={3}
              placeholder="Enter Text..."
              onChange={debounce((_, { value }) => {
                // const newPrice = Object.assign(oldPrice, { amount: value });
                props.updateValues({
                  text: value
                });
              }, 200)}
            />
          );
        }}
        view={props => <Preview {...props} />}
        compact={props => <Preview {...props} />}
        {...this.props}
      />
    );
  }
}
