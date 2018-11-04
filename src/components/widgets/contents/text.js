import React, { useRef, useEffect } from "react";
import WidgetBase from "./../base/WidgetBase";
import get from "lodash/get";
import debounce from "lodash/debounce";
// import { TextArea } from "semantic-ui-react";
import Input from "antd/lib/input";
const { TextArea } = Input;

const Preview = props => (
  <div
    style={{
      textAlign: "left",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word"
    }}
  >
    {get(
      props,
      "values.text",
      <i style={{ color: "lightgrey" }}>Empty Text</i>
    )}
  </div>
);

const TextEditor = React.memo(props => {
  const inputEl = useRef(null);
  useEffect(
    () => {
      console.log("mounted");
      console.log("inputEl"); //TRACE
      console.log(inputEl); //TRACE
      if (inputEl) {
        const curText = get(inputEl, "current.value", "");
        inputEl.current.focus();
        inputEl.current.selectionStart = curText.length;
        inputEl.current.selectionEnd = curText.length;
      }
    },
    [inputEl]
  );
  const debounceUpdate = debounce(value => {
    props.updateValues({
      text: value
    });
  }, 200);
  return (
    <TextArea
      ref={inputEl}
      disabled={props.submitting}
      style={{ width: "100%", marginBottom: 5 }}
      defaultValue={get(props, "defaultValues.text")}
      autosize={{ minRows: 2, maxRows: 6 }}
      placeholder="Enter Text..."
      onChange={e => {
        debounceUpdate(e.target.value);
      }}
    />
  );
});

export default class Text extends React.Component {
  render() {
    return (
      <WidgetBase
        previewData={{
          text: "lorem ipsum dolor"
        }}
        editor={props => <TextEditor {...props} />}
        view={props => <Preview {...props} />}
        compact={props => <Preview {...props} />}
        {...this.props}
      />
    );
  }
}
