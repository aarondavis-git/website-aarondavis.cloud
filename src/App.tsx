import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import './index.css'


import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import MachineLearningResearch from './pages/Portfolio/MachineLearningResearch'
import Services from './pages/Services'
import Writings from './pages/Writings'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="container max-w-6xl mx-auto px-4 md:px-8 pt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/machinelearningresearch" element={<MachineLearningResearch />}/>
          <Route path="/services" element={<Services />} />
          <Route path="/writings" element={<Writings />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
