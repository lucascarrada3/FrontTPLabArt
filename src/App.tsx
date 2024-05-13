import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import logo from './Imagenes/BuenSabor.png';
import './App.css'

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="BuenSabor" />
      </div>
      <div className="actions">
        <button className="btn">Iniciar sesión</button>
        <button className="btn">Registrarse</button>
        <div className="cart-icon">
          {/* Aquí agregaríamos el icono del carrito */}
        </div>
      </div>
    </header>
  );
}

export default Header;