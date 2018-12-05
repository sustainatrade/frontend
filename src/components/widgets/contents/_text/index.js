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

const EMOJI_MATCH = /:[^:\s]*:/g;

function matchSplitter(text, matcher) {
  const parts = [];
  let matches = [{ offset: 0 }];
  text.replace(matcher, (match, i) => matches.push({ text: match, anchor: i, offset: i + match.length }));
  matches.sort((a, b) => a.anchor < b.anchor);
  matches.forEach((match, ii) => {
    const nextMatch = matches[ii + 1] || {
      text: text.substring(match.offset, text.length),
      anchor: text.length
    };
    console.log(match, nextMatch);

    parts.push(text.substring(match.offset, nextMatch.anchor));
    nextMatch.offset && parts.push({ matched: true, text: nextMatch.text });
  });
  return parts;
}

const Preview = props => {
  const text = get(props, 'values.text');
  return (
    <div
      style={{
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        padding: '5px 15px',
        fontSize: props.fontSize
      }}
    >
      {text ? (
        matchSplitter(text, EMOJI_MATCH).map((mData, ii) => {
          if (mData.matched) return <Iconify key={ii} type={mData.text} />;
          else return mData;
        })
      ) : (
        <i style={{ color: 'lightgrey' }}>Empty Text</i>
      )}
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
