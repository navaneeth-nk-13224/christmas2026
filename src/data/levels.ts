export type Vehicle = 'train' | 'plane' | 'snowmobile' | 'van' | 'walk' | 'sleigh'

export interface LevelMeta {
  id: number
  title: string
  location: string
  /** The journey shown before this level begins. Level 1 starts from the title screen. */
  arrival?: { vehicle: Vehicle; title: string; subtitle?: string; palette: 'day' | 'dusk' | 'night' | 'arctic' }
}

export const LEVELS: LevelMeta[] = [
  { id: 1, title: "Santa's Missing Ticket", location: "Santa's Workshop" },
  {
    id: 2,
    title: 'The Uncollected Parcel',
    location: 'Santa Claus Post Office',
    arrival: { vehicle: 'train', title: 'ROVANIEMI, FINLAND', subtitle: 'Santa Claus Post Office', palette: 'day' },
  },
  {
    id: 3,
    title: 'The Silent Laboratory',
    location: 'Arctic Research Laboratory',
    arrival: { vehicle: 'plane', title: 'THE ARCTIC', subtitle: 'Arctic Research Laboratory', palette: 'arctic' },
  },
  {
    id: 4,
    title: 'The Family Photograph',
    location: 'Frozen Lake Monitoring Station',
    arrival: { vehicle: 'snowmobile', title: 'THE FROZEN LAKE', subtitle: 'Monitoring Station', palette: 'arctic' },
  },
  {
    id: 5,
    title: "The Researcher's Secret Note",
    location: "Professor Nicholas's Home",
    arrival: { vehicle: 'plane', title: 'SANTA CLAUS VILLAGE', subtitle: 'Rovaniemi, Finland', palette: 'dusk' },
  },
  {
    id: 6,
    title: 'The Broken Security Footage',
    location: 'Abandoned Toy Factory',
    arrival: { vehicle: 'van', title: 'THE OLD TOY FACTORY', subtitle: 'Outskirts of Rovaniemi', palette: 'night' },
  },
  {
    id: 7,
    title: 'Track the Missing Truck',
    location: 'Toy Factory Security Room',
    arrival: { vehicle: 'walk', title: 'SECURITY ROOM', subtitle: 'Old Toy Factory', palette: 'night' },
  },
  {
    id: 8,
    title: 'The Christmas Rescue',
    location: 'North Star Warehouse',
    arrival: { vehicle: 'van', title: 'NORTH STAR WAREHOUSE', subtitle: '24 Frost Road, Rovaniemi Industrial District', palette: 'night' },
  },
]

export const levelMeta = (id: number) => LEVELS[id - 1]
