import React, { useState } from 'react';
import logo from './Imagenes/Buen Sabor.png';
import carrito from './Imagenes/carrito.png';
import './App.css';

type Carta = {
  id: number;
  foto: string;
  descripcion: string;
  precio: string;
  ingredientes: string;
  titulo: string;
};

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [nuevaCarta, setNuevaCarta] = useState<Carta>({
    id: 0,
    foto: '',
    descripcion: '',
    precio: '',
    ingredientes: '',
    titulo: ''
  });
  const [editandoCarta, setEditandoCarta] = useState<number | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNuevaCarta(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNuevaCarta(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAgregarCarta = () => {
    if (editandoCarta !== null) {
      const nuevasCartas = cartas.map(carta =>
        carta.id === editandoCarta ? nuevaCarta : carta
      );
      setCartas(nuevasCartas);
      setEditandoCarta(null);
    } else {
      const nuevasCartas = [...cartas, { ...nuevaCarta, id: cartas.length + 1 }];
      setCartas(nuevasCartas);
    }
    setNuevaCarta({
      id: 0,
      foto: '',
      descripcion: '',
      precio: '',
      ingredientes: '',
      titulo: ''
    });
    setModalOpen(false);
  };

  const handleEliminarCarta = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      const nuevasCartas = cartas.filter(carta => carta.id !== id);
      setCartas(nuevasCartas);
    }
  };

  const handleEditarCarta = (id: number) => {
    const cartaEditar = cartas.find(carta => carta.id === id);
    if (cartaEditar) {
      setNuevaCarta(cartaEditar);
      setEditandoCarta(id);
      setModalOpen(true);
    }
  };

  return (
<div>
  <header className="navbar">
    <div className="logo">
      <img src={logo} alt="BuenSabor" />
    </div>
    <nav className="navbar-nav">
      <ul>
        <li>
          <div className="cart-icon" onClick={() => setModalOpen(true)}>
            <img src={carrito} alt="Carrito" />
          </div>
        </li>
      </ul>
    </nav>
  </header>

  <button className="btn-agregar" onClick={() => setModalOpen(true)}>Agregar Carta</button>

  <div className="content">
  <ul className="card-list">
          {cartas.map(carta => (
            <li key={carta.id} className="card">
              <img src={carta.foto} alt="Imagen de la carta" />
              <div className="card-info">
              <h2>{carta.titulo}</h2>
                <h3>{carta.descripcion}</h3>
                <p>{carta.ingredientes}</p>
                <p>{carta.precio}</p>
                <div>
                  <button onClick={() => handleEliminarCarta(carta.id)}>                    
                    <span role="img" aria-label="Eliminar">🗑️</span>
                  </button>
                  {' '}
                  <button onClick={() => handleEditarCarta(carta.id)}>✏️</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>{editandoCarta !== null ? 'Editar Carta' : 'Agregar Carta'}</h2>
            <form>
              <div className="form-group">
                <label htmlFor="foto">URL de la imagen:</label>                
                <input
                  type="text"
                  id="foto"
                  name="foto"
                  value={nuevaCarta.foto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="titulo">Título:</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={nuevaCarta.titulo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción:</label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={nuevaCarta.descripcion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="precio">Precio:</label>
                <input
                  type="text"
                  id="precio"
                  name="precio"
                  value={nuevaCarta.precio}
                  onChange={handleInputChange}
                />
              </div>
              <div id="ingredientes-container">
              <textarea
                id="ingredientes"
                name="ingredientes"
                value={nuevaCarta.ingredientes}
                onChange={handleTextAreaChange}
                placeholder="Escribe aquí tus ingredientes..."
              />
            </div>
              <button type="button" onClick={handleAgregarCarta}>
                {editandoCarta !== null ? 'Guardar' : 'Agregar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
