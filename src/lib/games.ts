export interface Game {
  id: string
  name: string
  description: string
  icon: string
  path: string
}

export const GAMES: Game[] = [
  {
    id: 'connects',
    name: 'Connects',
    description: 'A question card game',
    icon: '💬',
    path: '/connects',
  },
]
