import React, { useRef, useEffect } from 'react';
import Content from './../base/Content';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { Button } from 'semantic-ui-react';
import Input from 'antd/lib/input';
const { TextArea } = Input;

const Preview = props => (
  <div
    style={{
      textAlign: 'left',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      padding: '5px 15px',
      fontSize: props.fontSize
    }}
  >
    {get(props, 'values.text', <i style={{ color: 'lightgrey' }}>Empty Text</i>)}
  </div>
);

const TextEditor = React.memo(props => {
  const inputEl = useRef(null);
  console.log('props', props); //TRACE
  useEffect(
    () => {
      console.log('mounted');
      console.log('inputEl'); //TRACE
      console.log(inputEl); //TRACE
      if (inputEl) {
        const curText = get(inputEl, 'current.value', '');
        // inputEl.current.focus();
        // inputEl.current.selectionStart = curText.length;
        // inputEl.current.selectionEnd = curText.length;
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
    <div>
      <Button
        primary
        icon="chevron circle right"
        floated="right"
        size="large"
        circular
        disabled={props.submitting}
        onClick={() => {
          props.actions.save();
        }}
      />
      <div style={{ marginRight: 50 }}>
        <TextArea
          ref={inputEl}
          disabled={props.submitting}
          style={{
            width: '100%',
            marginBottom: 5,
            fontSize: 'large',
            height: 50
          }}
          defaultValue={get(props, 'defaultValues.text')}
          autosize={{ minRows: 1, maxRows: 6 }}
          placeholder="Enter Text..."
          onChange={e => {
            debounceUpdate(e.target.value);
          }}
        />
      </div>
    </div>
  );
});

export default class Text extends React.Component {
  render() {
    return (
      <Content
        previewData={{
          text: 'lorem ipsum dolor'
        }}
        editor={props => <TextEditor {...props} />}
        view={props => <Preview {...props} fontSize="larger" />}
        compact={props => <Preview {...props} />}
        {...this.props}
      />
    );
  }
}
