import { Link } from 'react-router-dom'
import { GAMES } from '../lib/games'

export function HomePage() {
  return (
    <section className="w-full h-full">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center">Games</h1>
        <div className="grid grid-cols-2 gap-4">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              to={game.path}
              className="block border-3 border-fg shadow-[5px_5px_0_0_#000] bg-bg p-6 transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{game.icon}</span>
                <div>
                  <h2 className="font-bold text-lg">{game.name}</h2>
                  <p className="text-sm opacity-70">{game.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
