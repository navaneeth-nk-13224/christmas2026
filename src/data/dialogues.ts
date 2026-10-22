import type { Line } from '../components/DialogueBox'

// Every line is short and plain. Pip never gives away a puzzle answer.
export const D = {
  title: [{ who: 'pip', text: 'Santa is missing! We need to find him before Christmas!', mood: 'worried' }],

  l1Intro: [
    { who: 'pip', text: "Detective, Santa has gone missing, and it's Christmas tomorrow!", mood: 'worried', pose: 'wave' },
    {
      who: 'pip',
      text: "We've got to save him before then. Let's search his workbench. Maybe we'll find something.",
      mood: 'determined',
      pose: 'hips',
    },
  ],
  l1Done: [
    { who: 'pip', text: 'Rovaniemi! Santa always visits the post office there before Christmas.', mood: 'excited', pose: 'cheer' },
    { who: 'pip', text: "Maybe someone there has seen him. Let's go!", mood: 'determined', pose: 'point' },
  ],

  l2Intro: [
    { who: 'pip', text: "We're looking for Santa. Have you seen him?", mood: 'worried', pose: 'wave' },
    { who: 'postmaster', text: 'Santa had a parcel waiting for him, but he never collected it.', mood: 'worried' },
    { who: 'pip', text: 'Can we take a look?', mood: 'happy', pose: 'point' },
  ],
  l2Done: [{ who: 'pip', text: "A research laboratory? Let's check it out.", mood: 'thinking', pose: 'think' }],

  l3Intro: [{ who: 'pip', text: "There's nobody here.", mood: 'worried' }],
  l3Signal: [{ who: 'pip', text: "Wait. What's that signal?", mood: 'surprised', pose: 'point' }],
  l3Done: [{ who: 'pip', text: "Meet by the lake? There's a monitoring station nearby. Let's go.", mood: 'excited', pose: 'point' }],

  l4Photo: [
    { who: 'pip', text: 'Look, a family photo. This must be one of the researchers.', mood: 'surprised', pose: 'point' },
    { who: 'pip', text: 'I wonder what place that is in the background. Maybe his family lives there.', mood: 'thinking', pose: 'think' },
  ],
  l4Done: [{ who: 'pip', text: 'Santa Claus Village! Maybe we can find his family there.', mood: 'excited', pose: 'cheer' }],

  l5Intro: [
    { who: 'pip', text: 'We found this photograph at the research station.', mood: 'neutral' },
    { who: 'elina', text: "That's my husband, Nicholas. He's missing too.", mood: 'worried' },
    { who: 'elina', text: 'He left me a note to open if he disappeared.', mood: 'neutral' },
  ],
  l5Done: [{ who: 'pip', text: "A toy factory? Let's investigate.", mood: 'determined', pose: 'hips' }],

  l6Intro: [
    { who: 'pip', text: "Someone's been using this factory.", mood: 'thinking', pose: 'think' },
    { who: 'pip', text: "Look, there's a security camera.", mood: 'surprised', pose: 'point' },
  ],
  l6Done: [
    { who: 'pip', text: 'Santa and Nicholas sneaked into that truck!', mood: 'surprised' },
    { who: 'pip', text: 'I wonder what they were investigating.', mood: 'thinking', pose: 'think' },
    { who: 'pip', text: 'We need to find out where it went.', mood: 'determined', pose: 'hips' },
  ],

  l7Intro: [{ who: 'pip', text: "Maybe the truck's details can help us track it.", mood: 'thinking', pose: 'think' }],
  l7Done: [
    { who: 'pip', text: 'The truck went to this warehouse!', mood: 'excited', pose: 'point' },
    { who: 'pip', text: "Let's go. Santa might be there.", mood: 'determined', pose: 'hips' },
  ],

  l8Intro: [{ who: 'pip', text: 'Santa might be inside! We need to get this door open.', mood: 'determined', pose: 'point' }],
  l8Rescue: [
    { who: 'santa', text: 'You found us!', mood: 'excited' },
    { who: 'santa', text: 'The thieves stole the Christmas presents. We tried to stop them, but they caught us.', mood: 'worried' },
  ],

  end1: [
    { who: 'santa', text: 'You found me, rescued my friend, and caught the thieves.', mood: 'happy' },
    { who: 'santa', text: "You've saved me and Christmas!", mood: 'excited' },
  ],
  end2: [{ who: 'pip', text: "We couldn't have done it without you, Detective!", mood: 'excited', pose: 'cheer' }],
  end3: [{ who: 'santa', text: 'The children are waiting! Merry Christmas!', mood: 'excited' }],
} satisfies Record<string, Line[]>
