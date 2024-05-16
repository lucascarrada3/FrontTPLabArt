import React, { useState } from 'react';
import './App.css';

type ArticuloManufacturado = {
  codigo: number;
  nombre: string;
  categoria: string;
  precio: string;
};

const insumosEjemplo = ["Tomate", "Lechuga", "Carne"];

function ArticuloManufacturado() {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [mostrarModalAgregarArticulo, setMostrarModalAgregarArticulo] = useState(false);
  const [mostrarModalModificarArticulo, setMostrarModalModificarArticulo] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloManufacturado | null>(null);
  const [nuevoArticuloNombre, setNuevoArticuloNombre] = useState("");
  const [nuevoArticuloCategoria, setNuevoArticuloCategoria] = useState("");
  const [nuevoArticuloPrecio, setNuevoArticuloPrecio] = useState("");
  const [criterio, setCriterio] = useState("codigo");
  const [mostrarModalInsumos, setMostrarModalInsumos] = useState(false);


  const insumosEjemplo = ['Tomate', 'Lechuga', 'Carne'];
  const handleAgregarArticulo = () => {
    if (nuevoArticuloNombre.trim() === "" || nuevoArticuloPrecio.trim() === "" || nuevoArticuloCategoria.trim() === "") {
      alert("Por favor, complete todos los campos del artículo.");
      return;
    }

    const nuevoCodigo = articulos.length + 1; // Generar un código único para el nuevo artículo
    const nuevoArticulo: ArticuloManufacturado = {
      codigo: nuevoCodigo,
      nombre: nuevoArticuloNombre,
      categoria: nuevoArticuloCategoria,
      precio: nuevoArticuloPrecio
    };

    // Agregar el artículo manufacturado
    setArticulos([...articulos, nuevoArticulo]);

    // Limpiar los campos del formulario
    setNuevoArticuloNombre("");
    setNuevoArticuloCategoria("");
    setNuevoArticuloPrecio("");
  
    // Cerrar el modal de agregar artículo
    setMostrarModalAgregarArticulo(false);
  };
  
  const handleChangeCriterio = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setCriterio(e.target.value);
  };

  const filtrarArticulos = (articulo: ArticuloManufacturado) => {
    switch (criterio) {
      case "codigo":
        return articulo.codigo.toString().includes(filtro);
      case "nombre":
        return articulo.nombre.toLowerCase().includes(filtro.toLowerCase());
      case "precio":
        return articulo.precio.toLowerCase().includes(filtro.toLowerCase());
      default:
        return true;
    }
  };
  
  const articulosFiltrados = articulos.filter(filtrarArticulos);

  const filteredArticulos = articulos.filter((articulo) => {
    return (
      articulo.codigo.toString().includes(filtro) || // Buscar por código
      articulo.nombre.toLowerCase().includes(filtro.toLowerCase()) || // Buscar por nombre (ignorando mayúsculas/minúsculas)
      articulo.precio.toLowerCase().includes(filtro.toLowerCase()) // Buscar por categoría (ignorando mayúsculas/minúsculas)
    );
  });
  
  const handleEliminarArticulo = (codigo: number) => {
    const nuevosArticulos = articulos.filter(articulo => articulo.codigo !== codigo);
    setArticulos(nuevosArticulos);
  };

  const handleBuscarArticulo = () => {
    let resultados: ArticuloManufacturado[] = [];
    if (criterio === 'codigo') {
      resultados = articulos.filter(articulo => articulo.codigo.toString().includes(filtro));
    } else if (criterio === 'nombre') {
      resultados = articulos.filter(articulo => articulo.nombre.toLowerCase().includes(filtro.toLowerCase()));
    } else if (criterio === 'precio') {
      resultados = articulos.filter(articulo => articulo.precio.toLowerCase().includes(filtro.toLowerCase()));
    }
    //setResultadoBusqueda(resultados);
  };

  const handleModificarArticulo = (articulo: ArticuloManufacturado) => {
    // Mostrar el modal de modificar artículo y establecer los valores del artículo seleccionado en el estado
    setArticuloSeleccionado(articulo);
    setNuevoArticuloNombre(articulo.nombre);
    setNuevoArticuloCategoria(articulo.categoria);
    setNuevoArticuloPrecio(articulo.precio);
    setMostrarModalModificarArticulo(true);
  };
  const handleCerrarModalModificarArticulo = () => {
    setMostrarModalModificarArticulo(false);
  };

  const handleGuardarModificacionArticulo = () => {
    if (!articuloSeleccionado) return;

    // Crear una copia de la lista de artículos
    const nuevosArticulos = [...articulos];

    // Encontrar el índice del artículo a modificar
    const indiceArticulo = nuevosArticulos.findIndex(articulo => articulo.codigo === articuloSeleccionado.codigo);

    // Si el artículo está en la lista, actualizar sus datos
    if (indiceArticulo !== -1) {
      nuevosArticulos[indiceArticulo] = {
        ...articuloSeleccionado,
        nombre: nuevoArticuloNombre,
        categoria: nuevoArticuloCategoria,
        precio: nuevoArticuloPrecio
      };

      // Actualizar el estado de los artículos
      setArticulos(nuevosArticulos);

      // Cerrar el modal de modificar artículo
      setMostrarModalModificarArticulo(false);
    }
  };

  const handleCerrarModalInsumos = () => {
    setArticuloSeleccionado(null);
    setMostrarModalInsumos(false);
  };

  const handleIncrementarInsumo = (insumo: string) => {
    // Implementa lógica para incrementar el contador del insumo seleccionado
  };

  const handleDecrementarInsumo = (insumo: string) => {
    // Implementa lógica para decrementar el contador del insumo seleccionado
  };
  
  const handleGuardarArticulo = () => {
    if (!articuloSeleccionado) return;
  
    // Crear una copia de la lista de artículos
    const nuevosArticulos = [...articulos];
  
    // Encontrar el índice del artículo a modificar
    const indiceArticulo = nuevosArticulos.findIndex(articulo => articulo.codigo === articuloSeleccionado.codigo);
  
    // Si el artículo está en la lista, actualizar sus datos
    if (indiceArticulo !== -1) {
      nuevosArticulos[indiceArticulo] = {
        ...articuloSeleccionado,
        nombre: nuevoArticuloNombre,
        categoria: nuevoArticuloCategoria,
        precio: nuevoArticuloPrecio
      };
  
      // Actualizar el estado de los artículos
      setArticulos(nuevosArticulos);
  
      // Limpiar los campos del formulario
      setNuevoArticuloNombre("");
      setNuevoArticuloCategoria("");
      setNuevoArticuloPrecio("");
  
      // Cerrar el modal de modificar artículo
      setMostrarModalModificarArticulo(false);
    }
  };
  
  const handleVerInsumos = () => {
    alert('Insumos: ' + insumosEjemplo.join(', '));
    // Aquí puedes abrir un modal con la lista de insumos
  };

  return (
    <div>
      {/* Contenido existente */}
      <div className="content">
        <h2 className="abm">ABM de Artículos Manufacturados</h2>
        <div className="search-container">
        <select value={criterio} onChange={handleChangeCriterio}>
    <option value="codigo">Código</option>
    <option value="nombre">Nombre</option>
    <option value="precio">Precio</option>
  </select>
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

        <button onClick={() => setMostrarModalAgregarArticulo(true)}>Agregar Artículo</button>

        <table className="table-container">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Modificar</th>
            <th>Eliminar</th>
            <th>Insumos</th> {/* Nueva columna para los insumos */}
          </tr>
        </thead>
        <tbody>
          {articulos.filter(filtrarArticulos).map((articulo: ArticuloManufacturado) => (
            <tr key={articulo.codigo}>
              <td>{articulo.codigo}</td>
              <td>{articulo.nombre}</td>
              <td>{articulo.categoria}</td>
              <td>{articulo.precio}</td>
              <td>
                <button onClick={() => handleModificarArticulo(articulo)}>Modificar</button>
              </td>
              <td>
                <button onClick={() => handleEliminarArticulo(articulo.codigo)}>Eliminar</button>
              </td>
              <td>
                <button onClick={handleVerInsumos}>Insumos</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Modal para agregar artículo */}
      {mostrarModalAgregarArticulo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setMostrarModalAgregarArticulo(false)}>&times;</span>
            <h2>Agregar Artículo</h2>
            {/* Formulario para agregar artículo */}
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={nuevoArticuloNombre}
                onChange={(e) => setNuevoArticuloNombre(e.target.value)}
              />
            </div>
            <div>
              <label>Categoría:</label>
              <input
                type="text"
                value={nuevoArticuloCategoria}
                onChange={(e) => setNuevoArticuloCategoria(e.target.value)}
              />
            </div>
            <div>
              <label>Precio:</label>
              <input
                type="text"
                value={nuevoArticuloPrecio}
                onChange={(e) => setNuevoArticuloPrecio(e.target.value)}
              />
            </div>
            <button onClick={handleAgregarArticulo}>Agregar</button>
          </div>
        </div>
      )}

      {/* Modal para modificar artículo */}
      {mostrarModalModificarArticulo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCerrarModalModificarArticulo}>&times;</span>
            <h2>Modificar Artículo</h2>
            {/* Formulario para modificar artículo */}
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={nuevoArticuloNombre}
                onChange={(e) => setNuevoArticuloNombre(e.target.value)}
              />
            </div>
            <div>
              <label>Categoría:</label>
              <input
                type="text"
                value={nuevoArticuloCategoria}
                onChange={(e) => setNuevoArticuloCategoria(e.target.value)}
              />
            </div>
            <div>
              <label>Precio:</label>
              <input
                type="text"
                value={nuevoArticuloPrecio}
                onChange={(e) => setNuevoArticuloPrecio(e.target.value)}
              />
            </div>
            <button onClick={handleGuardarArticulo}>Guardar</button>

          </div>
        </div>
      )}
        
        {/* Modal para mostrar insumos */}
      {mostrarModalInsumos && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCerrarModalInsumos}>&times;</span>
            <h2>Insumos del Artículo: {articuloSeleccionado?.nombre}</h2>
            {/* Lista de insumos */}
            <ul>
              {insumosEjemplo.map((insumo, index) => (
                <li key={index}>
                  {insumo}
                  <button onClick={() => handleIncrementarInsumo(insumo)}>+</button>
                  <span>0</span>
                  <button onClick={() => handleDecrementarInsumo(insumo)}>-</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
    
  );
}

export default ArticuloManufacturado;
