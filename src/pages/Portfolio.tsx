import './Portfolio.css'

const Portfolio = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-rose-700 mb-4">
          Portfolio
        </h2>
      </section>

      <div className="flex flex-row md:flex-row gap-8 items-stretch text-center">
        {/* Front-end */}
        <div className="container flex-1 aspect-square backdrop-blur-md rounded p-6 flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-rose-700">
            {'</>'}
          </h2>
          <p className="text-lg md:text-xl font-semibold text-rose-700">
            Front-end Projects
          </p>
        </div>

        {/* Back-End */}
        <div className="container flex-1 aspect-square backdrop-blur-md rounded p-6 flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-rose-700">
            {'Back-end'}
          </h2>
          <p className="text-lg md:text-xl font-semibold text-rose-700">
            Data Architecture
          </p>
        </div>

        {/* Data Science */}
        <div className="container flex-1 aspect-square backdrop-blur-md rounded p-6 flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-rose-700">
            {'Data'}
          </h2>
          <p className="text-lg md:text-xl font-semibold text-rose-700">
            Data Science Projects
          </p>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
