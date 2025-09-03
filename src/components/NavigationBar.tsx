import {NavLink} from 'react-router-dom';
import {useState, useEffect} from 'react';
import './NavigationBar.css';

const NavigationBar = () => {
  const [darkMode, setdarkMode] = useState(() =>
      {return localStorage.getItem('darkMode') === 'true' || false;});
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);
  
    const toggleDarkMode = () => setdarkMode(prev => !prev);

  return (
    <nav className="sticky top-0 left-0 w-full h-fit px-4 md:px-6 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center py-2">
        <button
          onClick={toggleDarkMode}
          aria-label='Toggle dark mode'
          className="navbar-title cursor-pointer"
          type='button'>
          <h1 className="text-2xl leading-none">
            Aaron
          </h1>
        </button>
        <ul className="navbar-links flex space-x-6 list-none font-medium">
          <li><NavLink to="/"className={({ isActive }) =>isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink></li>
          <li><NavLink to="/portfolio" className={({ isActive }) => isActive ? "active" : ""}>Portfolio</NavLink></li>
          <li><NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>Services</NavLink></li>
          <li><NavLink to="/writings" className={({ isActive }) => isActive ? "active" : ""}>Writings</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
