import React from 'react';
import Content from './../../base/Content';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import Iconify from '../../../icon-provider/Icon';
import { Loader, Popup, Button, Divider } from 'semantic-ui-react';
import './text.css';
import { FOOTER_STYLES } from '../_template';

const Text = React.lazy(() => import('./Text'));

const EMOJI_MATCH = /:[^:\s]*:/g;
const COMPACT_LENGTH = 90;

function matchSplitter(text, matcher) {
  const parts = [],
    textTmp = text;
  let matches = [{ offset: 0 }];
  textTmp.replace(matcher, (match, i) => matches.push({ text: match, anchor: i, offset: i + match.length }));
  matches = sortBy(matches, ['offset']);
  matches.forEach((match, ii) => {
    const nextMatch = matches[ii + 1] || {
      text: text.substring(match.offset, text.length),
      anchor: text.length
    };

    parts.push(text.substring(match.offset, nextMatch.anchor));
    nextMatch.offset && parts.push({ matched: true, text: nextMatch.text });
  });
  return parts;
}

const Preview = props => {
  const text = get(props, 'values.text');
  return (
    <>
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
      <div style={FOOTER_STYLES}>
        1 Comment
        <Popup trigger={<Button floated="right" basic icon="reply" size="mini" />} content="Add Comment" />
        <Divider hidden fitted clearing />
      </div>
    </>
  );
};

const PreviewCompact = props => {
  const [textCap, setTextCap] = React.useState(COMPACT_LENGTH);
  const text = get(props, 'values.text');
  let renderedCharLength = 0;
  return (
    <div style={{ fontSize: 'smaller' }}>
      {text ? (
        matchSplitter(text, EMOJI_MATCH).map((mData, ii) => {
          console.log('renderedCharLength', renderedCharLength, mData); //TRACE
          if (renderedCharLength > textCap) return '';
          if (mData.matched) {
            renderedCharLength += 1;
            return <Iconify key={ii} type={mData.text} />;
          } else {
            renderedCharLength += mData.length;
            if (renderedCharLength > textCap) {
              const excess = renderedCharLength - textCap;
              console.log('excess', excess); //TRACE
              return mData.substring(0, mData.length - excess);
            } else return mData;
          }
        })
      ) : (
        <i style={{ color: 'lightgrey' }}>Empty Text</i>
      )}
      {renderedCharLength > textCap && '...'}
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
        editor={props => (
          <React.Suspense fallback={<Loader active inline="centered" />}>
            <Text {...props} />
          </React.Suspense>
        )}
        view={props => <Preview {...props} fontSize="larger" />}
        compact={props => <PreviewCompact {...props} />}
        {...this.props}
      />
    );
  }
}
