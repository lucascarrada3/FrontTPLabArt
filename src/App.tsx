import React, { useState, useEffect } from 'react';
import './App.css';

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
  preparacion: string;
  precioVenta: number;
  insumos: { insumo: Insumo, cantidad: number }[];
  disponible: boolean;
};

function ArticuloManufacturado() {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [mostrarModalAgregarArticulo, setMostrarModalAgregarArticulo] = useState(false);
  const [mostrarModalModificarArticulo, setMostrarModalModificarArticulo] = useState(false);
  const [mostrarModalInsumos, setMostrarModalInsumos] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloManufacturado | null>(null);
  const [nuevoArticulodenominacion, setNuevoArticulodenominacion] = useState("");
  const [nuevoArticulopreparacion, setNuevoArticulopreparacion] = useState("");
  const [nuevoArticuloprecioVenta, setNuevoArticuloprecioVenta] = useState<number>(0);
  const [insumosDisponibles, setInsumosDisponibles] = useState<Insumo[]>([]);
  const [precioVentaTotalInsumos, setprecioVentaTotalInsumos] = useState<number>(0);
  const [criterio, setCriterio] = useState("id");
  

  useEffect(() => {
    const cargarArticulosDesdeAPI = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/articulomanufacturados');
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

  const handleAgregarArticulo = () => {
    if (nuevoArticulodenominacion.trim() === "" || nuevoArticulopreparacion.trim() === "" || nuevoArticuloprecioVenta <= 0) {
      alert("Por favor, complete todos los campos del artículo.");
      return;
    }

    const nuevoid = articulos.length + 1;

    const nuevoArticulo: ArticuloManufacturado = {
      id: nuevoid,
      denominacion: nuevoArticulodenominacion,
      preparacion: nuevoArticulopreparacion,
      precioVenta: nuevoArticuloprecioVenta,
      insumos: [],
      disponible: true
    };

    setArticulos([...articulos, nuevoArticulo]);
    setNuevoArticulodenominacion("");
    setNuevoArticulopreparacion("");
    setNuevoArticuloprecioVenta(0);
    setMostrarModalAgregarArticulo(false);
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
        return { ...articulo, disponible: false }; // Marcamos como no disponible
      }
      return articulo;
    });
    setArticulos(nuevosArticulos);
  
    // Actualizamos el estado en la base de datos
    await fetch(`http://localhost:8080/articulomanufacturados/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ disponibilidad: false }), // Actualizamos la columna disponibilidad
    });
  };

  const handleModificarArticulo = (articulo: ArticuloManufacturado) => {
    setArticuloSeleccionado(articulo);
    setNuevoArticulodenominacion(articulo.denominacion);
    setNuevoArticulopreparacion(articulo.preparacion);
    setNuevoArticuloprecioVenta(articulo.precioVenta);
    setMostrarModalModificarArticulo(true);
  };

  const handleCerrarModalModificarArticulo = () => {
    setMostrarModalModificarArticulo(false);
  };

  const handleRestaurarDisponibilidad = async (id: number) => {
    const nuevosArticulos = articulos.map(articulo => {
      if (articulo.id === id) {
        return { ...articulo, disponible: true }; // Marcamos como disponible
      }
      return articulo;
    });
    setArticulos(nuevosArticulos);
  
    // Actualizamos el estado en la base de datos
    await fetch(`http://localhost:8080/articulomanufacturados/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ disponible: true }),
    });
  };

  const getRowClass = (disponible: boolean) => {
    return disponible ? 'disponible' : 'no-disponible';
  };

  const handleGuardarModificacionArticulo = () => {
    if (!articuloSeleccionado) return;

    const nuevosArticulos = [...articulos];
    const indiceArticulo = nuevosArticulos.findIndex(articulo => articulo.id === articuloSeleccionado.id);

    if (indiceArticulo !== -1) {
      nuevosArticulos[indiceArticulo] = {
        ...articuloSeleccionado,
        denominacion: nuevoArticulodenominacion,
        preparacion: nuevoArticulopreparacion,
        precioVenta: nuevoArticuloprecioVenta
      };

      setArticulos(nuevosArticulos);
      setMostrarModalModificarArticulo(false);
    }
  };

  const handleAbrirModalInsumos = (articulo: ArticuloManufacturado) => {
    setArticuloSeleccionado(articulo);
    setMostrarModalInsumos(true);
  };

  const handleActualizarInsumo = (insumo: Insumo, delta: number) => {
    if (!articuloSeleccionado) return;

    const insumoExistente = articuloSeleccionado.insumos.find(i => i.insumo.id === insumo.id);
    const nuevaCantidad = insumoExistente ? insumoExistente.cantidad + delta : 1;

    if (nuevaCantidad < 0) return;

    const insumosActualizados = insumoExistente
      ? articuloSeleccionado.insumos.map(i => i.insumo.id === insumo.id ? { ...i, cantidad: nuevaCantidad } : i)
      : [...articuloSeleccionado.insumos, { insumo, cantidad: 1 }];

    const nuevoPrecioVenta = insumosActualizados.reduce((total, i) => total + (i.insumo.precioVenta * i.cantidad), 0);

    setArticuloSeleccionado({
      ...articuloSeleccionado,
      insumos: insumosActualizados,
      precioVenta: nuevoPrecioVenta
    });

    const nuevosArticulos = articulos.map(a => a.id === articuloSeleccionado.id ? { ...articuloSeleccionado, insumos: insumosActualizados, precioVenta: nuevoPrecioVenta } : a);
    setArticulos(nuevosArticulos);
  };

  const resetearValoresArticulo = () => {
    setNuevoArticulodenominacion('');
    setNuevoArticulopreparacion('');
    setNuevoArticuloprecioVenta(0);
  };

  const handleCerrarModalInsumos = () => {
    setMostrarModalInsumos(false);

    if (articuloSeleccionado) {
      const nuevosArticulos = [...articulos];
      const indiceArticulo = nuevosArticulos.findIndex(articulo => articulo.id === articuloSeleccionado.id);

      if (indiceArticulo !== -1) {
        nuevosArticulos[indiceArticulo] = {
          ...articuloSeleccionado,
          precioVenta: articuloSeleccionado.precioVenta + precioVentaTotalInsumos
        };

        setArticulos(nuevosArticulos);
        setArticuloSeleccionado(null);
      }
    }
  };

  const handleResetearContadorInsumo = () => {
    if (!articuloSeleccionado) return;

    const precioVentaTotalInsumos = articuloSeleccionado.insumos.reduce((total, insumo) => {
      return total + (insumo.insumo.precioVenta * insumo.cantidad);
    }, 0);

    const precioVentaArticuloActualizado = articuloSeleccionado.precioVenta - precioVentaTotalInsumos;

    setArticuloSeleccionado({
      ...articuloSeleccionado,
      precioVenta: precioVentaArticuloActualizado,
      insumos: []
    });

    setprecioVentaTotalInsumos(0);
  };

  return (
    <div>
      <div className="content">
        <h2 className="abm">ABM de Artículos Manufacturados</h2>
        <div className="search-container">
          <select value={criterio} onChange={handleChangeCriterio}>
            <option value="id">Código</option>
            <option value="denominacion">Denominación</option>
            <option value="precioVenta">Precio Venta</option>
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
              <th>Acciones</th>
            </tr>
            </thead>
          <tbody>
            {articulos.filter(filtrarArticulos).map((articulo: ArticuloManufacturado) => (
              <tr key={articulo.id} className={getRowClass(articulo.disponible)}>
                <td>{articulo.id}</td>
                <td>{articulo.denominacion}</td>
                <td>{articulo.preparacion}</td>
                <td>${articulo.precioVenta}</td>
                <td>
                  <button className="insumos" onClick={() => handleAbrirModalInsumos(articulo)}>Insumos</button>
                  <button className="modificar" onClick={() => handleModificarArticulo(articulo)}>✏️</button>
                  <button className="eliminar" onClick={() => handleEliminarArticulo(articulo.id)}>❌</button>
                  <button onClick={() => handleRestaurarDisponibilidad(articulo.id)}>✅</button>
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
            <input
              type="number"
              placeholder="Precio Venta"
              value={nuevoArticuloprecioVenta}
              onChange={(e) => setNuevoArticuloprecioVenta(Number(e.target.value))}
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
            <input
              type="number"
              placeholder="Precio Venta"
              value={nuevoArticuloprecioVenta}
              onChange={(e) => setNuevoArticuloprecioVenta(Number(e.target.value))}
            />
            <button className="btn-guardar" onClick={handleGuardarModificacionArticulo}>Guardar</button>
            <button className="btn-cancelar" onClick={handleCerrarModalModificarArticulo}>Cancelar</button>
          </div>
        </div>
      )}

      {mostrarModalInsumos && articuloSeleccionado && (
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
      )}
    </div>
  );
}

export default ArticuloManufacturado;
