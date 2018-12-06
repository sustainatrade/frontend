import React from 'react';
import { Emoji } from 'emoji-mart';
import { getCustomEmoji } from '../emoji';
// import get from 'lodash/get';

const trimRegex = new RegExp(`^[:]+|[:]+$`, 'g');
const LOADING_EMOJI = {
  name: 'Loader',
  short_names: ['gif_loader'],
  text: '',
  emoticons: [],
  keywords: [],
  imageUrl:
    'https://storage.sustainatrade.com/file/eco-trade-assets/0a938baac1613a29309e162e229bf727a6e933c6.gif'
};
function CustomEmoji({ emoji, ...rest }) {
  const [emojiData, setEmojiData] = React.useState(null);
  React.useEffect(
    () => {
      (async () => {
        const emojiCode = emoji.replace(trimRegex, '');
        const eData = await getCustomEmoji(emojiCode);
        console.log('eData', eData); //TRACE
        setEmojiData(eData);
      })();
    },
    [emoji]
  );
  return <Emoji {...rest} emoji={emojiData || LOADING_EMOJI} />;
}

function EmojiWithCustomFallback(props) {
  return (
    <Emoji
      {...props}
      fallback={() => {
        //Try custom
        return <CustomEmoji {...props} />;
      }}
    />
  );
}

export default function Iconify({ type, emojiStyle, ...rest }) {
  console.log('type', type); //TRACE
  // const data = searchEmoji(emojiCode);
  // console.log('emoji data', data); //TRACE
  return (
    <span {...rest}>
      <EmojiWithCustomFallback emoji={type} set="emojione" size={16} style={emojiStyle} />
    </span>
  );
}
