// Word pool for the game

const FRUITS = [
  'apple', 'banana', 'orange', 'grape', 'strawberry',
  'watermelon', 'pineapple', 'mango', 'peach', 'cherry',
  'kiwi', 'lemon', 'pear', 'plum', 'coconut'
];

const ANIMALS = [
  'cat', 'dog', 'elephant', 'lion', 'tiger',
  'giraffe', 'monkey', 'penguin', 'dolphin', 'rabbit',
  'horse', 'bear', 'fox', 'owl', 'butterfly',
  'fish', 'bird', 'snake', 'turtle', 'frog'
];

const EMOJIS = [
  'smile', 'heart', 'star', 'sun', 'moon',
  'fire', 'rainbow', 'cloud', 'lightning', 'snowflake',
  'flower', 'tree', 'mountain', 'ocean', 'rocket'
];

const MEMES = [
  'thumbs up', 'peace sign', 'ok hand', 'clapping hands',
  'thinking face', 'crying laughing', 'sunglasses', 'party hat',
  'pizza', 'hamburger', 'ice cream', 'birthday cake'
];

const ALL_WORDS = [...FRUITS, ...ANIMALS, ...EMOJIS, ...MEMES];

export function getRandomWord(): string {
  return ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
}
