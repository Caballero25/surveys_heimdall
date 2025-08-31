import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/NavBar.css'

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <nav className="navbar">
      <div className="navbar-toggler" onClick={toggleMenu}>
        <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
      </div>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li>
          <Link to="/">Pozos</Link>
        </li>
        <li>
          <Link to="/">Login</Link>
        </li>
      </ul>
    </nav>
  )
}
