import React from 'react';
import findWithRegex from 'find-with-regex';
import Icon from './../../../icon-provider/Icon';
import data from 'emoji-mart/data/emojione.json';

const EMOJI_CLOSURE = ':';
// const REPLACE_CHARS = {
//   ":": "_"
// };

console.log('data', data); //TRACE

const ICON_SET = Object.keys(data.emojis);
const MATCH_STR = ICON_SET.map(code => {
  let cleanedCode = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Object.keys(REPLACE_CHARS).forEach(key => {
  //   const rKey = new RegExp(key, "g");
  //   cleanedCode = cleanedCode.replace(rKey, REPLACE_CHARS[key]);
  // });
  // console.log("cleanedCode", cleanedCode); //TRACE

  return `${EMOJI_CLOSURE}${cleanedCode}${EMOJI_CLOSURE}`;
}).join('|');
const unicodeRegex = new RegExp(MATCH_STR, 'g');

function handleStrategy(contentBlock, callback, contentState) {
  findWithRegex(unicodeRegex, contentBlock, callback);
}

function EmojiComponent(props) {
  // console.log("props", props); //TRACE
  const { decoratedText, offsetKey, entityKey } = props;
  let emojiCode = decoratedText;
  return <Icon type={emojiCode} data-entity-key={entityKey} data-offset-key={offsetKey} />;
}

export default {
  strategy: handleStrategy,
  component: EmojiComponent
};
