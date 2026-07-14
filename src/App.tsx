import { Routes, Route, Link } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ConnectsGame } from './pages/ConnectsGame'
import { SpinGame } from './pages/SpinGame'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connects" element={<ConnectsGame />} />
      <Route path="/spin-dare" element={<SpinGame />} />
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <h1 className="text-2xl font-bold">404</h1>
            <Link
              to="/"
              className="bg-primary px-6 py-3 font-bold text-black uppercase shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Go Home
            </Link>
          </div>
        }
      />
    </Routes>
  )
}
