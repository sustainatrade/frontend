import React, { useRef } from 'react';
import Content from './../../base/Content';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { Button } from 'semantic-ui-react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { Label } from 'semantic-ui-react';
import Iconify from '../../../icon-provider/Icon';
import Text from './Text';
import './text.css';

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

const TextEditor = props => {
  const inputEl = useRef(null);
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  const [focused, setFocused] = React.useState(false);
  console.log('props', props); //TRACE
  const onChange = x => {
    console.log('x.toJS()', x.toJS()); //TRACE
    setEditorState(x);
  };
  const debounceUpdate = debounce(value => {
    props.updateValues({
      text: value
    });
  }, 200);
  return (
    <div style={{ padding: '5px 10px 10px 10px' }}>
      <div className="style-controls">
        <Label basic as="a" className="emoji" color="teal">
          <Iconify type=":slightly_smiling_face:" />
        </Label>
        <Label
          basic
          as="a"
          className={true ? 'inactive' : 'active'}
          onClick={() => {
            onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
          }}
        >
          <Iconify type="ant-design:bold-outline" />
        </Label>
        <Label basic as="a" className={true ? 'inactive' : 'active'}>
          <Iconify type="ant-design:italic-outline" />
        </Label>
        <Label basic as="a" className={true ? 'inactive' : 'active'}>
          <Iconify type="icons8-header" />
        </Label>
        <Label basic as="a" className={true ? 'inactive' : 'active'}>
          <Iconify type="ant-design:link-outline" />
        </Label>
        <Label basic as="a" className={true ? 'inactive' : 'active'}>
          <Iconify type="octicon-mention" />
        </Label>
      </div>
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
      <div
        style={{
          marginRight: 50,
          backgroundColor: 'white',
          padding: 5,
          border: `solid 1px ${focused ? 'lightsteelblue' : 'gainsboro'}`,
          borderRadius: 5,
          minHeight: 40,
          fontSize: 'large'
        }}
      >
        <Editor
          editorState={editorState}
          onChange={onChange}
          placeholder="Enter."
          onFocus={React.useCallback(() => setFocused(true))}
          onBlur={React.useCallback(() => setFocused(false))}
        />
        {/* <TextArea
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
        /> */}
      </div>
    </div>
  );
};

export default class TextContent extends React.Component {
  render() {
    return (
      <Content
        previewData={{
          text: 'lorem ipsum dolor'
        }}
        editor={props => <Text {...props} />}
        view={props => <Preview {...props} fontSize="larger" />}
        compact={props => <Preview {...props} />}
        {...this.props}
      />
    );
  }
}
