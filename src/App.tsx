import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import logo from './Imagenes/Buen Sabor.png';
import carrito from './Imagenes/carrito.png';
import './App.css'

function Header() {
  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="BuenSabor" />
      </div>
      <nav className="navbar-nav">
        <ul>
          {/* <li><button className="btn">Iniciar sesión</button></li>
          <li><button className="btn">Registrarse</button></li> */}
          <li><div className="cart-icon">{
            <img src={carrito} alt="Carrito"/>
          }</div></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;