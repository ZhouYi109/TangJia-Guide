import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NodeDetail from './pages/NodeDetail'
import Collection from './pages/Collection'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/node/:id" element={<NodeDetail />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </div>
  )
}

export default App
