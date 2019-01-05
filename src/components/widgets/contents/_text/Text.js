import React from 'react';
import { Editor, EditorState, Modifier, CompositeDecorator } from 'draft-js';
// import Icon from './../../../icon-provider/Icon';
import EmojiDecorator from './EmojiDecorator';
import 'emoji-mart/css/emoji-mart.css';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/emojione.json';
import { Map } from 'immutable';
import { Button, Divider, Segment } from 'semantic-ui-react';
import 'draft-js/dist/Draft.css';
import get from 'lodash/get';

const customEmojis = [
  {
    name: 'Octocat',
    short_names: ['octocat'],
    text: '',
    emoticons: [],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7'
  }
];

function BackButtonHandler({ onBack }) {
  const [historyLength, setHistoryLength] = React.useState(window.history.length);
  React.useEffect(() => {
    setHistoryLength(window.history.length);
    window.history.pushState({ fake: true }, null, null);
    window.onpopstate = function() {
      onBack && onBack();
    };
    return () => {
      if (historyLength === window.history.length) {
        window.history.back();
      }
    };
  }, []);
  return null;
}

export default function Text(props) {
  const editorRef = React.useRef(null);
  const [state, setState] = React.useState(
    Map({
      editorState: EditorState.createEmpty(new CompositeDecorator([EmojiDecorator])),
      showSelector: false
    })
  );
  const editorState = state.get('editorState');
  const showSelector = state.get('showSelector');
  React.useEffect(
    () => {
      const defaultText = get(props, 'defaultValues.text');
      if (!defaultText) {
        if (editorRef) {
          editorRef.current.focus();
        }
        return;
      }
      const contentState = editorState.getCurrentContent();

      const contentStateDefaultValue = Modifier.insertText(
        contentState,
        contentState.getSelectionAfter(),
        defaultText,
        null,
        null
      );

      const newEditorState = EditorState.push(editorState, contentStateDefaultValue);
      onChange(newEditorState);
    },
    [props.defaultValues, editorRef]
  );
  React.useEffect(
    () => {
      // console.log('editState.toJS()', editorState.toJS()); //TRACE
    },
    [editorState]
  );
  const onChange = state => {
    // setEditorState(state);
    setState(oldState => oldState.set('editorState', state).set('showSelector', false));
    const text = state.getCurrentContent().getPlainText();
    props.updateValues({
      text
    });
  };
  return (
    <>
      {!showSelector && (
        <Segment basic>
          <div style={{ float: 'right' }}>
            <Button
              circular
              basic
              color="blue"
              icon="smile outline"
              onClick={() => setState(oldState => oldState.set('showSelector', !showSelector))}
            />
            <Button
              circular
              icon="arrow alternate circle right"
              primary
              disabled={props.submitting}
              onClick={() => {
                props.actions.save();
              }}
            />
          </div>
          <div style={{ fontSize: 'large', marginRight: 100 }}>
            <Editor
              ref={editorRef}
              editorState={editorState}
              placeholder="Message here..."
              onChange={onChange}
            />
          </div>
          <Divider fitted clearing style={{ marginRight: 100, borderColor: '#1678c2' }} />
        </Segment>
      )}
      {showSelector && (
        <div>
          <BackButtonHandler
            onBack={() => {
              console.log('back');
              setState(oldState => oldState.set('showSelector', false));
            }}
          />
          <NimblePicker
            set="emojione"
            custom={customEmojis}
            data={data}
            showSkinTones={false}
            skin={1}
            exclude={['flags']}
            sheetSize={32}
            showPreview={false}
            perLine={4}
            style={{ width: '100%', border: 'none' }}
            onSelect={emoji => {
              const contentState = editorState.getCurrentContent();
              const contentStateWithEmojiEntity = contentState.createEntity('EMOJI', 'IMMUTABLE', {
                emoji: emoji.colons
              });
              const entityKey = contentStateWithEmojiEntity.getLastCreatedEntityKey();

              const contentStateWithEmoji = Modifier.insertText(
                contentStateWithEmojiEntity,
                contentStateWithEmojiEntity.getSelectionAfter(),
                `${emoji.colons} `,
                null,
                entityKey
              );

              const newEditorState = EditorState.push(editorState, contentStateWithEmoji);
              onChange(newEditorState);
            }}
          />
          <Button
            content="CLOSE"
            primary
            icon="x"
            fluid
            onClick={() => {
              setState(oldState => oldState.set('showSelector', false));
            }}
          />
        </div>
      )}
    </>
  );
}
