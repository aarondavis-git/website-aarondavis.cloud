const Home = () => {
  return (
    <div className="mt-32 text-center px-4 py-1">
      <h1 className="text-2xl md:text-4xl font-bold mb-2">
        Aaron Davis
      </h1>
      <h2 className="text-sm md:text-xl font-semibold leading-none">
        Machine Learning Engineer & Full-Stack Developer
      </h2>
      <p className="mt-4">
        Building intelligent solutions through code, data, and design
      </p>
      <button className="mt-6 px-6 py-2 text-inherit text-shadow-outline bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 hover:text-[#2a353f] dark:hover:text-[#f4dec2] rounded-xl">
        View My Work
      </button>
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        <div className="flex flex-row">
          Deep Learning
        </div>
        <div className="flex flex-row">
          Back End
        </div>
        <div className="flex flex-row">
          React TailwindCSS Node.js
        </div>
        <div className="flex flex-row">
          Flutter Swift
        </div>
      </div>

    </div>
  );
};

export default Home;