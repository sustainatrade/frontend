import React from 'react';
import data from 'emoji-mart/data/emojione.json';
import { NimbleEmojiIndex } from 'emoji-mart';

let emojiIndex = new NimbleEmojiIndex(data);

export async function getCustomEmojis() {
  return [
    {
      name: 'Octocat',
      short_names: ['octocat'],
      text: '',
      emoticons: [],
      keywords: ['github'],
      imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7'
    },
    {
      name: 'Parrot',
      short_names: ['parrot'],
      text: '',
      emoticons: [],
      keywords: ['parrot'],
      imageUrl: 'https://cultofthepartyparrot.com/parrots/hd/parrot.gif'
    }
  ];
}

export async function getCustomEmoji(key) {
  const emojis = await getCustomEmojis();
  return emojis.find(emoji => {
    return emoji.short_names.includes(key);
  });
}

export function searchEmoji(code) {
  console.log('emojiIndex', emojiIndex); //TRACE
  return emojiIndex.search(code);
}
