import React, { useState } from 'react';
import './App.css';

type ArticuloManufacturado = {
  codigo: number;
  nombre: string;
  categoria: string;
  precio: string;
};

type Insumo = {
  codigo: number;
  nombre: string;
  esParaElaborar: boolean;
};

function ArticuloManufacturado() {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [nuevoArticuloNombre, setNuevoArticuloNombre] = useState("");
  const [nuevoArticuloCategoria, setNuevoArticuloCategoria] = useState("");
  const [nuevoArticuloPrecio, setNuevoArticuloPrecio] = useState("");
  const [mostrarModalInsumos, setMostrarModalInsumos] = useState(false);
  const [mostrarModalModificarArticulo, setMostrarModalModificarArticulo] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloManufacturado | null>(null);
  const [nuevoInsumoNombre, setNuevoInsumoNombre] = useState("");
  const [nuevoInsumoEsParaElaborar, setNuevoInsumoEsParaElaborar] = useState(false);

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

    // Crear automáticamente los insumos asociados al artículo
    const nuevosInsumos = [...insumos];
    for (let i = 0; i < 3; i++) { // Crear 3 insumos por cada artículo
      const nuevoInsumo: Insumo = {
        codigo: insumos.length + 1, // Generar un código único para el nuevo insumo
        nombre: `Insumo ${insumos.length + 1}`,
        esParaElaborar: false
      };
      nuevosInsumos.push(nuevoInsumo);
    }
    setInsumos(nuevosInsumos);

    // Limpiar los campos del formulario
    setNuevoArticuloNombre("");
    setNuevoArticuloCategoria("");
    setNuevoArticuloPrecio("");
  };

  const handleEliminarArticulo = (codigo: number) => {
    const nuevosArticulos = articulos.filter(articulo => articulo.codigo !== codigo);
    setArticulos(nuevosArticulos);
  };

  const handleModificarArticulo = (articulo: ArticuloManufacturado) => {
    setArticuloSeleccionado(articulo);
    setMostrarModalModificarArticulo(true);
  };

  const handleCerrarModalModificarArticulo = () => {
    setMostrarModalModificarArticulo(false);
  };

  const handleGuardarModificacionArticulo = () => {
    // Aquí puedes implementar la lógica para guardar la modificación del artículo
    // Por simplicidad, solo cerramos el modal
    setMostrarModalModificarArticulo(false);
  };

  const handleCerrarModalInsumos = () => {
    setMostrarModalInsumos(false);
  };

  const handleAgregarInsumo = () => {
    // Aquí puedes implementar la lógica para agregar un insumo
  };

  const handleEliminarInsumo = (codigo: number) => {
    // Aquí puedes implementar la lógica para eliminar un insumo
  };

  return (
    <div>
      {/* Contenido existente */}
      <div className="content">
        <h2>ABM de Artículos Manufacturados</h2>
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
        <button onClick={handleAgregarArticulo}>Agregar Artículo</button>

        <table className="table-container">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Modificar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map(articulo => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para modificar el artículo */}
      {mostrarModalModificarArticulo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCerrarModalModificarArticulo}>&times;</span>
            <h2>Modificar Artículo</h2>
            {/* Aquí puedes agregar los campos para modificar el artículo */}
            <button onClick={handleGuardarModificacionArticulo}>Guardar</button>
          </div>
        </div>
      )}

      {/* Modal para mostrar los insumos */}
      {mostrarModalInsumos && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCerrarModalInsumos}>&times;</span>
            <h2>Insumos Asociados al Artículo</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Es Para Elaborar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {insumos.map(insumo => (
                  <tr key={insumo.codigo}>
                    <td>{insumo.codigo}</td>
                    <td>{insumo.nombre}</td>
                    <td>{insumo.esParaElaborar ? 'Sí' : 'No'}</td>
                    <td>
                      <button onClick={() => handleEliminarInsumo(insumo.codigo)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticuloManufacturado;
