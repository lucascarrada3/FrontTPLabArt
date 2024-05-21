import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api';

type Insumo = {
  id: number;
  denominacion: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
};

type ArticuloManufacturado = {
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
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [mostrarModalAgregarArticulo, setMostrarModalAgregarArticulo] = useState(false);
  const [mostrarModalModificarArticulo, setMostrarModalModificarArticulo] = useState(false);
  // const [mostrarModalInsumos, setMostrarModalInsumos] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloManufacturado | null>(null);
  const [nuevoArticulodescripcion, setNuevoArticulodescripcion] = useState("");
  const [nuevoArticulodenominacion, setNuevoArticulodenominacion] = useState("");
  const [nuevoArticulotiempoEstimadoMinutos, setArticulotiempoEstimadoMinutos] = useState<number>(0.0);
  const [nuevoArticulopreparacion, setNuevoArticulopreparacion] = useState("");
  const [nuevoArticuloprecioVenta, setNuevoArticuloprecioVenta] = useState<number>(0);
  // const [insumosEliminados, setInsumosEliminados] = useState<Insumo[]>([]);
  // const [precioVentaTotalInsumos, setprecioVentaTotalInsumos] = useState<number>(0);
  const [criterio, setCriterio] = useState("id");
  
//SOLICITUD GET
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

  // POST
  async function createArticuloManufacturado(articulo: ArticuloManufacturado): Promise<ArticuloManufacturado> {
    const response = await fetch(`${API_URL}/articulomanufacturados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulo)
    });
    return response.json();
  }

  // PUT
  async function updateArticuloManufacturado(id: number, articulo: ArticuloManufacturado): Promise<ArticuloManufacturado> {
    const response = await fetch(`${API_URL}/articulomanufacturados/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulo)
    });
    return response.json();
  }

  // CREATE ARTICULO
  const handleAgregarArticulo = async () => {
    if (nuevoArticulodenominacion.trim() === "" || nuevoArticulopreparacion.trim() === "" || nuevoArticuloprecioVenta <= 0) {
      alert("Por favor, complete todos los campos del artículo.");
      return;
    }

    const nuevoArticulo: ArticuloManufacturado = {
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
      console.log('Artículo creado:', articuloCreado);
      // Aquí puedes agregar lógica adicional después de crear el artículo, como actualizar una lista de artículos
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

    const nuevoArticulo: ArticuloManufacturado = {
      ...articuloSeleccionado, // Mantenemos el ID del artículo seleccionado
      denominacion: nuevoArticulodenominacion,
      preparacion: nuevoArticulopreparacion,
      precioVenta: nuevoArticuloprecioVenta,
      descripcion: nuevoArticulodescripcion,
      tiempoEstimadoMinutos: nuevoArticulotiempoEstimadoMinutos,
      insumos: [],
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

  const filtrarArticulos = (articulo: ArticuloManufacturado) => {
    if (filtro.trim() === "") {
      return true;
    } else {
      switch (criterio) {
        case "id":
          return articulo.id.toString().includes(filtro);
        case "denominacion":
          return articulo.denominacion.toLowerCase().includes(filtro.toLowerCase());
        default:
          return true;
      }
    }
  };

  const handleEliminarArticulo = async (id: number) => {
    try {
      const articulo = articulos.find(art => art.id === id);
      if (!articulo) {
        throw new Error('Artículo no encontrado');
      }
      
      const articuloActualizado = { ...articulo, eliminado: true };

      const response = await fetch(`${API_URL}/articulomanufacturados/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articuloActualizado)
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud PUT');
      }

      const articuloModificado = await response.json();
      setArticulos(articulos.map(art => art.id === articuloModificado.id ? articuloModificado : art));
    } catch (error) {
      console.error("Error al actualizar el estado del artículo:", error);
    }
  };
  

  /*const handleEliminarArticulo = async (id: number) => {

    const response = await fetch(`${API_URL}/articulomanufacturados/${id}`);
    const data = await response.json();
    setArticulos(data);

    console.log(data);

    const nuevoArticulo: ArticuloManufacturado = {
      ...articuloSeleccionado, // Mantenemos el ID del artículo seleccionado
      denominacion: resp,
      preparacion: nuevoArticulopreparacion,
      precioVenta: nuevoArticuloprecioVenta,
      descripcion: nuevoArticulodescripcion,
      tiempoEstimadoMinutos: nuevoArticulotiempoEstimadoMinutos,
      insumos: [],
      eliminado: false
    };

    const nuevosArticulos = articulos.map(articulo => {
      if (articulo.id === id) {
        return { ...articulo, eliminado: true }; // Marcamos como no disponible
      }
      return articulo;
    });
    setArticulos(nuevosArticulos);
  
    try {
      const response = await fetch(`http://localhost:8080/articulomanufacturados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eliminado: true }), // Actualizamos la columna disponibilidad
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud PATCH');
      }
    } catch (error) {
      console.error("Error al actualizar el estado del artículo:", error);
    }
  };

  */

  const handleModificarArticulo = (articulo: ArticuloManufacturado) => {
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
    try {
      const articulo = articulos.find(art => art.id === id);
      if (!articulo) {
        throw new Error('Artículo no encontrado');
      }
      
      const articuloActualizado = { ...articulo, eliminado: false };

      const response = await fetch(`${API_URL}/articulomanufacturados/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articuloActualizado)
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud PUT');
      }

      const articuloModificado = await response.json();
      setArticulos(articulos.map(art => art.id === articuloModificado.id ? articuloModificado : art));
    } catch (error) {
      console.error("Error al actualizar el estado del artículo:", error);
    }
  };

  const getRowClass = (disponible: boolean) => {
    return disponible ? 'disponible' : 'no-disponible';
  };

  const resetearValoresArticulo = () => {
    setNuevoArticulodenominacion('');
    setNuevoArticulopreparacion('');
    setNuevoArticuloprecioVenta(0);
    setArticulotiempoEstimadoMinutos(0),
    setNuevoArticulodescripcion("")
  };

  return (
    <div>
      <div className="content">
        <h2 className="abm">Artículos Manufacturados</h2>
        <div className="search-container">
          <select value={criterio} onChange={handleChangeCriterio}>
            <option value="id">Código</option>
            <option value="denominacion">Denominación</option>
          </select>
          <input
            type="text"
            placeholder="Buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <button className="btn-agregar" onClick={handleAbrirModalAgregarArticulo}>Agregar Artículo</button>

        <table className="table-container">
          <thead>
            <tr>
              <th>Código</th>
              <th>Denominación</th>
              <th>Preparación</th>
              <th>Precio Venta</th>
              <th>Tiempo Estimado en minutos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
            </thead>
          <tbody>
            {articulos.filter(filtrarArticulos).map((articulo: ArticuloManufacturado) => (
              <tr key={articulo.id} className={getRowClass(articulo.eliminado)}>
                <td>{articulo.id}</td>
                <td>{articulo.denominacion}</td>
                <td>{articulo.preparacion}</td>
                <td>${articulo.precioVenta}</td>
                <td>{articulo.tiempoEstimadoMinutos}</td>
                <td>{articulo.eliminado ? "NOT OK" : "OK"}</td>
                <td>
                  {/* <button className="insumos" onClick={(null)}>Insumos</button> */}
                  <button className="modificar" onClick={() => handleModificarArticulo(articulo)}>✏️</button>
                  <button className="eliminar" onClick={() => handleEliminarArticulo(articulo.id)}>❌</button>
                  <button className="restaurar" onClick={() => handleRestaurarDisponibilidad(articulo.id)}>✅</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModalAgregarArticulo && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Artículo</h3>
            <input
              type="text"
              placeholder="Denominación"
              value={nuevoArticulodenominacion}
              onChange={(e) => setNuevoArticulodenominacion(e.target.value)}
            />
            <textarea
              placeholder="Preparación"
              value={nuevoArticulopreparacion}
              onChange={(e) => setNuevoArticulopreparacion(e.target.value)}
            ></textarea>
            <textarea
              placeholder="Descripcion"
              value={nuevoArticulodescripcion}
              onChange={(e) => setNuevoArticulodescripcion(e.target.value)}
            ></textarea>
            <input
              type="number"
              placeholder="Precio Venta"
              value={nuevoArticuloprecioVenta}
              onChange={(e) => setNuevoArticuloprecioVenta(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Tiempo estimado en minutos"
              value={nuevoArticulotiempoEstimadoMinutos}
              onChange={(e) => setArticulotiempoEstimadoMinutos(Number(e.target.value))}
            />
            <button className="btn-agregar" onClick={handleAgregarArticulo}>Agregar</button>
            <button className="btn-cancelar" onClick={() => setMostrarModalAgregarArticulo(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {mostrarModalModificarArticulo && (
        <div className="modal">
          <div className="modal-content">
            <h3>Modificar Artículo</h3>
            <input
              type="text"
              placeholder="Denominación"
              value={nuevoArticulodenominacion}
              onChange={(e) => setNuevoArticulodenominacion(e.target.value)}
            />
            <textarea
              placeholder="Preparación"
              value={nuevoArticulopreparacion}
              onChange={(e) => setNuevoArticulopreparacion(e.target.value)}
            ></textarea>
            <textarea
              placeholder="Descripcion"
              value={nuevoArticulodescripcion}
              onChange={(e) => setNuevoArticulodescripcion(e.target.value)}
            ></textarea>
            <input
              type="number"
              placeholder="Precio Venta"
              value={nuevoArticuloprecioVenta}
              onChange={(e) => setNuevoArticuloprecioVenta(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Tiempo estimado en minutos"
              value={nuevoArticulotiempoEstimadoMinutos}
              onChange={(e) => setArticulotiempoEstimadoMinutos(Number(e.target.value))}
            />
            <button className="btn-guardar" onClick={handleActualizarArticulo}>Guardar</button>
            <button className="btn-cancelar" onClick={handleCerrarModalModificarArticulo}>Cancelar</button>
          </div>
        </div>
      )}

      {/* {mostrarModalInsumos && articuloSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <h3>Insumos del Artículo</h3>
            <ul>
              {articuloSeleccionado.insumos.map((insumo) => (
                <li key={insumo.insumo.id}>
                  {insumo.insumo.denominacion} - Cantidad: {insumo.cantidad}
                  <button onClick={() => handleActualizarInsumo(insumo.insumo, -1)}>-</button>
                  <button onClick={() => handleActualizarInsumo(insumo.insumo, 1)}>+</button>
                </li>
              ))}
            </ul>
            <button className="btn-guardar" onClick={handleCerrarModalInsumos}>Cerrar</button>
            <button className="btn-cancelar" onClick={handleResetearContadorInsumo}>Resetear</button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default ArticuloManufacturado;
