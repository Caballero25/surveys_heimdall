import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
//import Image from "../../shared/assets/overtechLogo.png";
import Image from "../../shared/assets/drill_logo_hd.png";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="navbar">
      <div className="navbar-toggler" onClick={toggleMenu}>
        <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
        <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
        <div className={`burger-bar ${isOpen ? "open" : ""}`}></div>
      </div>
      <div className="d-flex w-100">
        <img
          src={Image}
          alt="Logo Overtech"
          className="navbar-logo"
          style={{ height: "40px" }}
        />
        <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
          <li>
            <Link to="/">Proyectos - pozos</Link>
          </li>
          <li>
            <Link to="/">Cerrar sesión</Link>
          </li>
        </ul>
        <div className="user-info">
          <i className="bi bi-person-circle"></i>
          <span className="admin-text">ADMINISTRADOR</span>
        </div>
      </div>
    </nav>
  );
}
