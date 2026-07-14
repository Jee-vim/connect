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
  {
    id: 'spin-dare',
    name: 'Spin & Dare',
    description: 'Truth or dare with a twist',
    icon: '🎯',
    path: '/spin-dare',
  },
]
