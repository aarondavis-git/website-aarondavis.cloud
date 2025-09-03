import {NavLink} from 'react-router-dom'
import './index.css'

const Portfolio = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Portfolio
        </h2>
      </section>

      <div className="flex flex-col md:flex-row gap-8 items-stretch text-center">
        {/* Front-End */}
        <div className="portfolio-container flex-1 aspect-square">
          <h2 className="text-xl md:text-2xl font-bold">
            {'Front-End'}
          </h2>
          <p className="text-lg md:text-xl font-semibold">
            Front-end Projects
          </p>
        </div>

        {/* Back-End */}
        <div className="portfolio-container flex-1 aspect-square">
          <h2 className="text-xl md:text-2xl font-bold">
            {'Back-End'}
          </h2>
          <p className="text-lg md:text-xl font-semibold">
            Data Architecture
          </p>
        </div>

        {/* Artificial Intelligence */}
        <NavLink to="/portfolio/machinelearningresearch" className="portfolio-container flex-1 aspect-square">
          <h2 className="text-xl md:text-2xl font-bold">
            {'Artifical Intelligence'}
          </h2>
          <p className="text-lg md:text-xl font-semibold">
            Machine Learning Research
          </p>
        </NavLink>
        
        {/* Mobile App Development */}
        <div className="portfolio-container flex-1 aspect-square">
          <h2 className='text-xl md:text-2xl font-bold'>
            {'Android and iOS'}
          </h2>
          <p className="text-lg md:text-xl font-semibold">
            Flutter and Swift
          </p>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
