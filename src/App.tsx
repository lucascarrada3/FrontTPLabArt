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
  contadores: { [key: string]: number }; // Agrega este campo
};


function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [nuevaCarta, setNuevaCarta] = useState<Carta>({
    id: 0,
    foto: '',
    descripcion: '',
    precio: '$',
    ingredientes: '',
    titulo: '',
    contadores: { tomate: 0, lechuga: 0, carne: 0, huevo: 0, cheddar: 0 }
  });
  const [editandoCarta, setEditandoCarta] = useState<number | null>(null);
  const [contadores, setContadores] = useState({
    tomate: 0,
    lechuga: 0,
    carne: 0,
    huevo: 0,
    cheddar: 0
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNuevaCarta(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, checked } = event.target;
  //   const ingredientes = [...nuevaCarta.ingredientes.split(',')];

  //   if (checked) {
  //     ingredientes.push(name);
  //     incrementarContador(name as keyof typeof contadores);
  //   } else {
  //     const index = ingredientes.indexOf(name);
  //     if (index !== -1) {
  //       ingredientes.splice(index, 1);
  //       decrementarContador(name as keyof typeof contadores);
  //     }
  //   }

  //   setNuevaCarta(prevState => ({
  //     ...prevState,
  //     ingredientes: ingredientes.join(',')
  //   }));
  // };
  
  const incrementarContador = (name: keyof typeof contadores) => {
    setContadores(prevState => ({
      ...prevState,
      [name]: prevState[name] + 1
    }));
    setNuevaCarta(prevState => ({
      ...prevState,
      ingredientes: prevState.ingredientes ? prevState.ingredientes + ',' + name : name
    }));
  };

  const decrementarContador = (name: keyof typeof contadores) => {
    setContadores(prevState => ({
      ...prevState,
      [name]: Math.max(prevState[name] - 1, 0)
    }));
    setNuevaCarta(prevState => {
      const ingredientesArray = prevState.ingredientes.split(',');
      const index = ingredientesArray.indexOf(name);
      if (index !== -1) {
        ingredientesArray.splice(index, 1);
      }
      return {
        ...prevState,
        ingredientes: ingredientesArray.join(',')
      };
    });
  };

  // const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const { name, value } = event.target;
  //   setNuevaCarta(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // };

  const handleAgregarCarta = () => {
    if (editandoCarta !== null) {
      const nuevasCartas = cartas.map(carta =>
        carta.id === editandoCarta ? { ...nuevaCarta, contadores: contadores } : carta
      );
      setCartas(nuevasCartas);
      setEditandoCarta(null);
    } else {
      const nuevasCartas = [...cartas, { ...nuevaCarta, id: cartas.length + 1, contadores: { ...contadores } }];
      setCartas(nuevasCartas);
    }
    resetearFormulario();
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
      // Restablecer los contadores
      const newContadores: { [key: string]: number } = {
        tomate: 0,
        lechuga: 0,
        carne: 0,
        huevo: 0,
        cheddar: 0
      };
  
      // Incrementar los contadores con los ingredientes de la carta que se está editando
      const ingredientesArray = cartaEditar.ingredientes.split(',');
      for (const ingrediente of ingredientesArray) {
        if (newContadores.hasOwnProperty(ingrediente)) {
          newContadores[ingrediente as keyof typeof newContadores] += 1;
        }
      }
  
      // Actualizar el estado de los contadores
      setContadores(newContadores as { tomate: number; lechuga: number; carne: number; huevo: number; cheddar: number; });
  
      // Establecer la carta a editar y abrir el modal de edición
      setNuevaCarta(cartaEditar);
      setEditandoCarta(id);
      setModalOpen(true);
    }
  };
  
  const resetearFormulario = () => {
    setNuevaCarta({
      id: 0,
      foto: '',
      descripcion: '',
      precio: '$',
      ingredientes: '',
      titulo: '',
      contadores: { tomate: 0, lechuga: 0, carne: 0, huevo: 0, cheddar: 0 }
    });
    setContadores({
      tomate: 0,
      lechuga: 0,
      carne: 0,
      huevo: 0,
      cheddar: 0
    });
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
      <div>
        {Object.entries(carta.contadores).map(([ingrediente, cantidad]) => (
          cantidad > 0 && (
            <p key={ingrediente}>{ingrediente}: {cantidad}</p>
          )
        ))}
      </div>
      <h1>{carta.precio}</h1>
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
                  <div>
                    <span>Tomate:</span>
                    <button type="button" onClick={() => incrementarContador('tomate')}>+</button>
                    <span>{contadores.tomate}</span>
                    <button type="button" onClick={() => decrementarContador('tomate')}>-</button>
                  </div>
                  <div>
                    <span>Lechuga:</span>
                    <button type="button" onClick={() => incrementarContador('lechuga')}>+</button>
                    <span>{contadores.lechuga}</span>
                    <button type="button" onClick={() => decrementarContador('lechuga')}>-</button>
                  </div>
                  <div>
                    <span>Carne:</span>
                    <button type="button" onClick={() => incrementarContador('carne')}>+</button>
                    <span>{contadores.carne}</span>
                    <button type="button" onClick={() => decrementarContador('carne')}>-</button>
                  </div>
                  <div>
                    <span>Huevo:</span>
                    <button type="button" onClick={() => incrementarContador('huevo')}>+</button>
                    <span>{contadores.huevo}</span>
                    <button type="button" onClick={() => decrementarContador('huevo')}>-</button>
                  </div>
                  <div>
                    <span>Cheddar:</span>
                    <button type="button" onClick={() => incrementarContador('cheddar')}>+</button>
                    <span>{contadores.cheddar}</span>
                    <button type="button" onClick={() => decrementarContador('cheddar')}>-</button>
                  </div>
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
