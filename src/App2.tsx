import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api';

// Funciones para GET, CREATE, UPDATE
export async function getArticuloManufacturado(id: number): Promise<Articulo> {
  const response = await fetch(`${API_URL}/articulomanufacturados/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

export async function createArticuloManufacturado(articulo: Articulo): Promise<Articulo> {
  const response = await fetch(`${API_URL}/articulomanufacturados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articulo)
  });
  return response.json();
}

export async function updateArticuloManufacturado(id: number, articulo: Articulo): Promise<Articulo> {
  const response = await fetch(`${API_URL}/articulomanufacturados/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articulo)
  });
  return response.json();
}

type Insumo = {
  id: number;
  denominacion: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
};

type Articulo = {
  id: number;
  denominacion: string;
  descripcion:string;
  preparacion: string;
  tiempoEstimadoMinutos:number;
  precioVenta: number;
  insumos: { insumo: Insumo, cantidad: number }[];
  eliminado: boolean;
};

function ArticuloManufacturado() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [mostrarModalAgregarArticulo, setMostrarModalAgregarArticulo] = useState(false);
  const [mostrarModalModificarArticulo, setMostrarModalModificarArticulo] = useState(false);
  const [mostrarModalInsumos, setMostrarModalInsumos] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [nuevoArticulodescripcion, setNuevoArticulodescripcion] = useState("");
  const [nuevoArticulodenominacion, setNuevoArticulodenominacion] = useState("");
  const [nuevoArticulotiempoEstimadoMinutos, setArticulotiempoEstimadoMinutos] = useState<number>(0.0);
  const [nuevoArticulopreparacion, setNuevoArticulopreparacion] = useState("");
  const [nuevoArticuloprecioVenta, setNuevoArticuloprecioVenta] = useState<number>(0);
  const [insumosEliminados, setInsumosEliminados] = useState<Insumo[]>([]);
  const [precioVentaTotalInsumos, setprecioVentaTotalInsumos] = useState<number>(0);
  const [criterio, setCriterio] = useState("id");

// Solicitud GET
  useEffect(() => {
    const cargarArticulosDesdeAPI = async () => {
      try {
        const response = await fetch(`${API_URL}/articulomanufacturados`);
        const data = await response.json();
        setArticulos(data);
      } catch (error) {
        console.error("Error al cargar los datos desde la API:", error);
      }
    };
    cargarArticulosDesdeAPI();
  }, []);

  const handleAbrirModalAgregarArticulo = () => {
    resetearValoresArticulo();
    setMostrarModalAgregarArticulo(true);
  };

// CREATE ARTICULO
  const handleAgregarArticulo = async () => {
    if (nuevoArticulodenominacion.trim() === "" || nuevoArticulopreparacion.trim() === "" || nuevoArticuloprecioVenta <= 0) {
      alert("Por favor, complete todos los campos del artículo.");
      return;
    }

    const nuevoArticulo: Articulo = {
      id: articulos.length + 1,
      denominacion: nuevoArticulodenominacion,
      preparacion: nuevoArticulopreparacion,
      precioVenta: nuevoArticuloprecioVenta,
      descripcion: nuevoArticulodescripcion,
      tiempoEstimadoMinutos: nuevoArticulotiempoEstimadoMinutos,
      insumos: [],
      eliminado: false
    };

    try {
      const articuloCreado = await createArticuloManufacturado(nuevoArticulo);
      setArticulos([...articulos, articuloCreado]);
      setMostrarModalAgregarArticulo(false); // Cerrar el modal después de agregar el artículo
    } catch (error) {
      console.error('Error al agregar el artículo:', error);
    }
  };

// UPDATE ARTICULO
  const handleActualizarArticulo = async () => {
    if (!articuloSeleccionado) return;
    
    if (nuevoArticulodenominacion.trim() === "" || nuevoArticulopreparacion.trim() === "" || nuevoArticuloprecioVenta <= 0) {
      alert("Por favor, complete todos los campos del artículo.");
      return;
    }

    const nuevoArticulo: Articulo = {
      ...articuloSeleccionado, // Mantenemos el ID del artículo seleccionado
      denominacion: nuevoArticulodenominacion,
      preparacion: nuevoArticulopreparacion,
      precioVenta: nuevoArticuloprecioVenta,
      descripcion: nuevoArticulodescripcion,
      tiempoEstimadoMinutos: nuevoArticulotiempoEstimadoMinutos,
      insumos: [],
      eliminado: false
    };

    try {
      const articuloModificado = await updateArticuloManufacturado(articuloSeleccionado.id, nuevoArticulo);
      setArticulos(articulos.map(art => art.id === articuloModificado.id ? articuloModificado : art));
      setMostrarModalModificarArticulo(false); // Cerrar el modal después de modificar el artículo
    } catch (error) {
      console.error('Error al actualizar el artículo:', error);
    }
  };

  const handleChangeCriterio = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setCriterio(e.target.value);
  };

  const filtrarArticulos = (articulo: Articulo) => {
    if (filtro.trim() === "") {
      return true;
    } else {
      switch (criterio) {
        case "id":
          return articulo.id.toString().includes(filtro);
        case "denominacion":
          return articulo.denominacion.toLowerCase().includes(filtro.toLowerCase());
        case "precioVenta":
          return articulo.precioVenta.toString().includes(filtro);
        default:
          return true;
      }
    }
  };

  const handleEliminarArticulo = async (id: number) => {
    const nuevosArticulos = articulos.map(articulo => {
      if (articulo.id === id) {
        return { ...articulo, eliminado: true }; // Marcamos como eliminado
      }
      return articulo;
    });
    setArticulos(nuevosArticulos);
  
    try {
      const response = await fetch(`${API_URL}/articulomanufacturados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eliminado: true }), // Actualizamos el estado de eliminado
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud PUT');
      }
    } catch (error) {
      console.error("Error al actualizar el estado del artículo:", error);
    }
  };

  const handleModificarArticulo = (articulo: Articulo) => {
    setArticuloSeleccionado(articulo);
    setNuevoArticulodenominacion(articulo.denominacion);
    setNuevoArticulopreparacion(articulo.preparacion);
    setNuevoArticuloprecioVenta(articulo.precioVenta);
    setArticulotiempoEstimadoMinutos(articulo.tiempoEstimadoMinutos);
    setNuevoArticulodescripcion(articulo.descripcion);
    setMostrarModalModificarArticulo(true);
  };

  const handleCerrarModalModificarArticulo = () => {
    setMostrarModalModificarArticulo(false);
  };

  const handleRestaurarDisponibilidad = async (id: number) => {
    if (!articuloSeleccionado) return;
  
    try {
      const response = await fetch(`${API_URL}/articulomanufacturados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          denominacion: nuevoArticulodenominacion,
          preparacion: nuevoArticulopreparacion,
          precioVenta: nuevoArticuloprecioVenta,
          eliminado: false // Restauramos la disponibilidad
        })
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud PUT');
      }
  
      const articuloModificado = await response.json();
      const nuevosArticulos = articulos.map(articulo => 
        articulo.id === articuloModificado.id ? articuloModificado : articulo
      );
      setArticulos(nuevosArticulos);
    } catch (error) {
      console.error("Error al restaurar la disponibilidad del artículo:", error);
    }
  };

  const resetearValoresArticulo = () => {
    setNuevoArticulodenominacion("");
    setNuevoArticulopreparacion("");
    setNuevoArticuloprecioVenta(0);
    setNuevoArticulodescripcion("");
    setArticulotiempoEstimadoMinutos(0);
    setArticuloSeleccionado(null);
  };

  const handleAbrirModalInsumos = (insumos: Insumo[]) => {
    setInsumosEliminados(insumos);
    setMostrarModalInsumos(true);
    const totalPrecio = insumos.reduce((total, insumo) => total + insumo.precioVenta, 0);
    setprecioVentaTotalInsumos(totalPrecio);
  };

  return (
    <div className="container">
      <h1>Artículos Manufacturados</h1>
      <div className="d-flex justify-content-between mb-3">
        <div className="form-group d-flex flex-column">
          <label htmlFor="criterio">Filtrar por:</label>
          <select id="criterio" value={criterio} onChange={handleChangeCriterio}>
            <option value="id">ID</option>
            <option value="denominacion">Denominación</option>
            <option value="precioVenta">Precio de Venta</option>
          </select>
          <input
            type="text"
            className="form-control"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className="form-group d-flex align-items-end">
          <button className="btn btn-primary" onClick={handleAbrirModalAgregarArticulo}>
            Agregar Artículo
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Denominación</th>
            <th>Preparación</th>
            <th>Tiempo Estimado (minutos)</th>
            <th>Descripción</th>
            <th>Precio Venta</th>
            <th>Insumos</th>
            <th>Eliminado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.filter(filtrarArticulos).map((articulo) => (
            <tr key={articulo.id}>
              <td>{articulo.id}</td>
              <td>{articulo.denominacion}</td>
              <td>{articulo.preparacion}</td>
              <td>{articulo.tiempoEstimadoMinutos}</td>
              <td>{articulo.descripcion}</td>
              <td>${articulo.precioVenta}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleAbrirModalInsumos(articulo.insumos.map((insumoObj) => insumoObj.insumo))}
                >
                  Ver Insumos
                </button>
              </td>
              <td>{articulo.eliminado ? "Sí" : "No"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm mr-2"
                  onClick={() => handleModificarArticulo(articulo)}
                  disabled={articulo.eliminado} // Deshabilitar botón si el artículo está eliminado
                >
                  Modificar
                </button>
                {articulo.eliminado ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleRestaurarDisponibilidad(articulo.id)}
                  >
                    Restaurar
                  </button>
                ) : (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminarArticulo(articulo.id)}
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Agregar Artículo */}
      {mostrarModalAgregarArticulo && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Agregar Artículo Manufacturado</h2>
            <div className="form-group">
              <label htmlFor="denominacion">Denominación:</label>
              <input
                type="text"
                id="denominacion"
                className="form-control"
                value={nuevoArticulodenominacion}
                onChange={(e) => setNuevoArticulodenominacion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="preparacion">Preparación:</label>
              <input
                type="text"
                id="preparacion"
                className="form-control"
                value={nuevoArticulopreparacion}
                onChange={(e) => setNuevoArticulopreparacion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tiempoEstimadoMinutos">Tiempo Estimado (minutos):</label>
              <input
                type="number"
                id="tiempoEstimadoMinutos"
                className="form-control"
                value={nuevoArticulotiempoEstimadoMinutos}
                onChange={(e) => setArticulotiempoEstimadoMinutos(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción:</label>
              <input
                type="text"
                id="descripcion"
                className="form-control"
                value={nuevoArticulodescripcion}
                onChange={(e) => setNuevoArticulodescripcion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="precioVenta">Precio de Venta:</label>
              <input
                type="number"
                id="precioVenta"
                className="form-control"
                value={nuevoArticuloprecioVenta}
                onChange={(e) => setNuevoArticuloprecioVenta(Number(e.target.value))}
              />
            </div>
            <button className="btn btn-primary" onClick={handleAgregarArticulo}>
              Guardar
            </button>
            <button className="btn btn-secondary" onClick={() => setMostrarModalAgregarArticulo(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal Modificar Artículo */}
      {mostrarModalModificarArticulo && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Modificar Artículo Manufacturado</h2>
            <div className="form-group">
              <label htmlFor="denominacion">Denominación:</label>
              <input
                type="text"
                id="denominacion"
                className="form-control"
                value={nuevoArticulodenominacion}
                onChange={(e) => setNuevoArticulodenominacion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="preparacion">Preparación:</label>
              <input
                type="text"
                id="preparacion"
                className="form-control"
                value={nuevoArticulopreparacion}
                onChange={(e) => setNuevoArticulopreparacion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tiempoEstimadoMinutos">Tiempo Estimado (minutos):</label>
              <input
                type="number"
                id="tiempoEstimadoMinutos"
                className="form-control"
                value={nuevoArticulotiempoEstimadoMinutos}
                onChange={(e) => setArticulotiempoEstimadoMinutos(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción:</label>
              <input
                type="text"
                id="descripcion"
                className="form-control"
                value={nuevoArticulodescripcion}
                onChange={(e) => setNuevoArticulodescripcion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="precioVenta">Precio de Venta:</label>
              <input
                type="number"
                id="precioVenta"
                className="form-control"
                value={nuevoArticuloprecioVenta}
                onChange={(e) => setNuevoArticuloprecioVenta(Number(e.target.value))}
              />
            </div>
            <button className="btn btn-primary" onClick={handleActualizarArticulo}>
              Guardar
            </button>
            <button className="btn btn-secondary" onClick={handleCerrarModalModificarArticulo}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal Insumos */}
      {mostrarModalInsumos && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Insumos del Artículo Manufacturado</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Denominación</th>
                  <th>Precio de Venta</th>
                </tr>
              </thead>
              <tbody>
                {insumosEliminados.map((insumo) => (
                  <tr key={insumo.id}>
                    <td>{insumo.id}</td>
                    <td>{insumo.denominacion}</td>
                    <td>${insumo.precioVenta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-3">
              <span><strong>Total Precio de Venta:</strong> ${precioVentaTotalInsumos}</span>
              <button className="btn btn-secondary" onClick={() => setMostrarModalInsumos(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticuloManufacturado;
