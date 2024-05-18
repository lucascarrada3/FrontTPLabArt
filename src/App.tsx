import React, { useState, useEffect } from 'react';
import './App.css';

type Insumo = {
  id: number;
  denominacion: string;
  precioVenta: number;
};

type ArticuloManufacturado = {
  id: number;
  denominacion: string;
  preparacion: string;
  precioVenta: number;
  insumos: { insumo: Insumo, cantidad: number }[];
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


  const cargarArticulosDesdeAPI = async () => {
    try {
      // Hacer la solicitud HTTP a la API
      const response = await fetch('http://localhost:8080/api/articulomanufacturados');
      const data = await response.json();
      // Actualizar el estado con los datos recibidos
      setArticulos(data);
    } catch (error) {
      console.error("Error al cargar los datos desde la API:", error);
      // alert("Ocurrió un error al cargar los datos desde la API. Por favor, intenta nuevamente más tarde.");
    }
  };

  cargarArticulosDesdeAPI();

  useEffect(() => {
    // Simula la llamada al backend para obtener insumos disponibles
    const fetchInsumos = async () => {
      // Simulación de datos del backend
      const insumos: Insumo[] = [
        { id: 1, denominacion: 'Tomate', precioVenta: 1.5 },
        { id: 2, denominacion: 'Lechuga', precioVenta: 0.8 },
        { id: 3, denominacion: 'Queso', precioVenta: 2.0 }
      ];
      setInsumosDisponibles(insumos);
    };

    fetchInsumos();
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
      insumos: []
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
      return true; // Si el filtro está vacío, mostrar todos los artículos
    } else {
      switch (criterio) {
        case "id":
          return articulo.id.toString() === filtro; // Filtrar exactamente por código
        case "denominacion":
          return articulo.denominacion.toLowerCase() === filtro.toLowerCase(); // Filtrar exactamente por denominacion
        case "precioVenta":
          return articulo.precioVenta.toString() === filtro; // Filtrar exactamente por precioVenta
        default:
          return true;
      }
    }
  };
  

  const handleEliminarArticulo = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
    const nuevosArticulos = articulos.filter(articulo => articulo.id !== id);
    setArticulos(nuevosArticulos);
  }
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
    setprecioVentaTotalInsumos(0);
    setMostrarModalInsumos(true);
  };

  // const handleAgregarInsumo = (insumo: Insumo, cantidad: number) => {
  //   if (!articuloSeleccionado) return;
  
  //   const insumoExistente = articuloSeleccionado.insumos.find(i => i.insumo.id === insumo.id);
  //   const nuevaCantidad = insumoExistente ? insumoExistente.cantidad + cantidad : cantidad;
  
  //   if (nuevaCantidad < 0) return; // Evitar cantidades negativas
  
  //   const insumosActualizados = articuloSeleccionado.insumos.map(i => {
  //     if (i.insumo.id === insumo.id) {
  //       return { ...i, cantidad: i.cantidad + cantidad };
  //     }
  //     return i;
  //   });
  
  //   if (insumoExistente) {
  //     setArticuloSeleccionado({
  //       ...articuloSeleccionado,
  //       insumos: insumosActualizados
  //     });
  //   } else {
  //     setArticuloSeleccionado({
  //       ...articuloSeleccionado,
  //       insumos: [...articuloSeleccionado.insumos, { insumo, cantidad }]
  //     });
  //   }
  
  //   setprecioVentaTotalInsumos(precioVentaTotalInsumos + (insumo.precioVenta * cantidad));
  // };
  
  const handleActualizarInsumo = (insumo: Insumo, delta: number) => {
    if (!articuloSeleccionado) return;
  
    const insumoExistente = articuloSeleccionado.insumos.find(i => i.insumo.id === insumo.id);
    const nuevaCantidad = insumoExistente ? insumoExistente.cantidad + delta : 1;
  
    if (nuevaCantidad < 0) return; // Evitar cantidades negativas
  
    const insumosActualizados = articuloSeleccionado.insumos.map(i => {
      if (i.insumo.id === insumo.id) {
        return { ...i, cantidad: i.cantidad + delta };
      }
      return i;
    });
  
    if (insumoExistente) {
      setArticuloSeleccionado({
        ...articuloSeleccionado,
        insumos: insumosActualizados
      });
    } else {
      setArticuloSeleccionado({
        ...articuloSeleccionado,
        insumos: [...articuloSeleccionado.insumos, { insumo, cantidad: 1 }]
      });
    }
  
    setprecioVentaTotalInsumos(precioVentaTotalInsumos + (insumo.precioVenta * delta));
  };
  
  const resetearValoresArticulo = () => {
    setNuevoArticulodenominacion('');
    setNuevoArticulopreparacion('');
    setNuevoArticuloprecioVenta(0);
  };

  
  // const handleCerrarModalAgregarArticulo = () => {
  //   resetearValoresArticulo();
  //   setMostrarModalAgregarArticulo(false);
  // };  

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
  
    // Calcular el precioVenta total de los insumos
    const precioVentaTotalInsumos = articuloSeleccionado.insumos.reduce((total, insumo) => {
      return total + (insumo.insumo.precioVenta * insumo.cantidad);
    }, 0);
  
    // Restar el precioVenta total de los insumos al precioVenta del artículo
    const precioVentaArticuloActualizado = articuloSeleccionado.precioVenta - precioVentaTotalInsumos;
  
    // Actualizar el precioVenta del artículo y resetear el contador de insumos
    setArticuloSeleccionado({
      ...articuloSeleccionado,
      precioVenta: precioVentaArticuloActualizado,
      insumos: []
    });
  
    // Resetear el precioVenta total de los insumos a cero
    setprecioVentaTotalInsumos(0);
  };
  
  // const handleEliminarInsumo = (insumoId: number) => {
  //   if (!articuloSeleccionado) return;
  
  //   const insumoExistente = articuloSeleccionado.insumos.find(i => i.insumo.id === insumoId);
  
  //   if (insumoExistente) {
  //     // Calcular el precioVenta total del insumo a eliminar
  //     const precioVentaInsumoEliminar = insumoExistente.insumo.precioVenta * insumoExistente.cantidad;
  
  //     // Restar el precioVenta del insumo eliminado del precioVenta total de los insumos
  //     const precioVentaTotalActualizado = precioVentaTotalInsumos - precioVentaInsumoEliminar;
  
  //     // Actualizar el precioVenta total de los insumos
  //     setprecioVentaTotalInsumos(precioVentaTotalActualizado);
  
  //     // Filtrar los insumos para eliminar el insumo seleccionado
  //     const insumosFiltrados = articuloSeleccionado.insumos.filter(i => i.insumo.id !== insumoId);
  
  //     // Calcular el precioVenta total de los insumos restantes
  //     const precioVentaInsumosRestantes = insumosFiltrados.reduce((total, insumo) => {
  //       return total + (insumo.insumo.precioVenta * insumo.cantidad);
  //     }, 0);
  
  //     // Restar el precioVenta total de los insumos restantes al precioVenta del artículo
  //     const precioVentaArticuloActualizado = articuloSeleccionado.precioVenta - precioVentaInsumosRestantes;
  
  //     // Actualizar los insumos del artículo y el precioVenta del artículo
  //     setArticuloSeleccionado({
  //       ...articuloSeleccionado,
  //       precioVenta: precioVentaArticuloActualizado,
  //       insumos: insumosFiltrados
  //     });
  //   }
  // };
  

  return (
    <div>
      <div className="content">
        <h2 className="abm">ABM de Artículos Manufacturados</h2>
        <div className="search-container">
          <select value={criterio} onChange={handleChangeCriterio}>
            <option value="id">Código</option>
            <option value="denominacion">denominacion</option>
            <option value="precioVenta">precioVenta</option>
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
              <th>Denominacion</th>
              <th>Preparacion</th>
              <th>precioVenta</th>
              <th className="modificar">Modificar</th>
              <th className="eliminar">Eliminar</th>
              <th className="insumos">Insumos</th>
            </tr>
          </thead>
          <tbody>
            {articulos.filter(filtrarArticulos).map((articulo: ArticuloManufacturado) => (
              <tr key={articulo.id}>
                <td >{articulo.id}</td>
                <td>{articulo.denominacion}</td>
                <td>{articulo.preparacion}</td>
                <td>{articulo.precioVenta.toFixed(2)}</td>
                <td>
                  <button className="modificar" onClick={() => handleModificarArticulo(articulo)}>Modificar</button>
                </td>
                <td>
                  <button className="eliminar" onClick={() => handleEliminarArticulo(articulo.id)}>Eliminar</button>
                </td>
                <td>
                  <button className="insumos" onClick={() => handleAbrirModalInsumos(articulo)}>Insumos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModalAgregarArticulo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setMostrarModalAgregarArticulo(false)}>&times;</span>
            <h2>Agregar Artículo</h2>
            <div>
              <label>denominacion:</label>
              <input
                type="text"
                value={nuevoArticulodenominacion}
                onChange={(e) => setNuevoArticulodenominacion(e.target.value)}
              />
            </div>
            <div>
              <label>Categoría:</label>
              <input
                type="text"
                value={nuevoArticulopreparacion}
                onChange={(e) => setNuevoArticulopreparacion(e.target.value)}
              />
            </div>
            <div>
              <label>precioVenta:</label>
              <input
                type="number"
                value={nuevoArticuloprecioVenta}
                onChange={(e) => setNuevoArticuloprecioVenta(parseFloat(e.target.value))}
              />
            </div>
            <button onClick={handleAgregarArticulo}>Agregar</button>
          </div>
        </div>
      )}

      {mostrarModalModificarArticulo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCerrarModalModificarArticulo}>&times;</span>
            <h2>Modificar Artículo</h2>
            <div>
              <label>denominacion:</label>
              <input
                type="text"
                value={nuevoArticulodenominacion}
                onChange={(e) => setNuevoArticulodenominacion(e.target.value)}
              />
            </div>
            <div>
              <label>Categoría:</label>
              <input
                type="text"
                value={nuevoArticulopreparacion}
                onChange={(e) => setNuevoArticulopreparacion(e.target.value)}
              />
            </div>
            <div>
              <label>precioVenta:</label>
              <input
                type="number"
                value={nuevoArticuloprecioVenta}
                onChange={(e) => setNuevoArticuloprecioVenta(parseFloat(e.target.value))}
              />
            </div>
            <button onClick={handleGuardarModificacionArticulo}>Guardar</button>
          </div>
        </div>
      )}

{mostrarModalInsumos && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={handleCerrarModalInsumos}>&times;</span>
      <h2>Agregar Insumo</h2>
      <div>
        {insumosDisponibles.map((insumo) => (
          <div key={insumo.id}>
            <span>{insumo.denominacion}  ${insumo.precioVenta.toFixed(2)}</span>
            {' '}
            <button onClick={() => handleActualizarInsumo(insumo, -1)}>-</button>
            {' '}
            <button onClick={() => handleActualizarInsumo(insumo, 1)}>+</button>
            {' '}          
          
            <span>Cantidad: {articuloSeleccionado?.insumos.find(i => i.insumo.id === insumo.id)?.cantidad || 0}</span>
          </div>
        ))}
      </div>
      <button onClick={handleCerrarModalInsumos}>Guardar</button>
      {' '}
      <button onClick={handleResetearContadorInsumo}>Resetear</button>
    </div>
  </div>
)}

    </div>
  );
}

export default ArticuloManufacturado;
