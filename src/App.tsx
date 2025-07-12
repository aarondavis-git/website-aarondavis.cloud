import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import NavigationBar from './components/NavigationBar'



import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Services from './pages/Services'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-32 bg-white/20 list-none backdrop-blur-lg rounded-2xl shadow-lg text-grey-700">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
