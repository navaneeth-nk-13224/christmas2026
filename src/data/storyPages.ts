export interface StoryPage {
  heading: string
  lines: string[]
}

export const STORY_PAGES: StoryPage[] = [
  {
    heading: 'The Missing Presents',
    lines: [
      'Professor Nicholas noticed that Christmas presents were disappearing.',
      'He investigated the shipments and began to suspect an old toy factory.',
      'Just in case, he left a secret note with his wife.',
    ],
  },
  {
    heading: 'The Warning',
    lines: [
      'Nicholas warned Santa about the missing presents, and Santa hurried north to help.',
      'Santa sent a secret message to the lab in Morse code: MEET BY LAKE.',
      'He used Morse because he didn’t know who in the lab he could trust.',
    ],
  },
  {
    heading: 'The Meeting',
    lines: [
      'Santa met Nicholas near the frozen lake.',
      'They decided to investigate the toy factory together.',
      'In their hurry, Nicholas accidentally left his family photograph behind.',
    ],
  },
  {
    heading: 'The Trap',
    lines: [
      'At the factory, they discovered the stolen presents.',
      'They sneaked into a truck to follow the thieves.',
      'But the thieves discovered them and locked them inside a warehouse.',
    ],
  },
  {
    heading: 'Christmas Saved',
    lines: [
      'Pip and the detective followed the clues and found the warehouse.',
      'They rescued Santa, caught the thieves, and recovered the presents.',
      'Christmas was saved!',
    ],
  },
]
