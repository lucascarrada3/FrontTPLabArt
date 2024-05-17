import React, { useState, useEffect } from 'react';
import './App.css';

type Insumo = {
  id: number;
  nombre: string;
  precio: number;
};

type ArticuloManufacturado = {
  codigo: number;
  nombre: string;
  categoria: string;
  precio: number;
  insumos: { insumo: Insumo, cantidad: number }[];
};

function ArticuloManufacturado() {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [mostrarModalAgregarArticulo, setMostrarModalAgregarArticulo] = useState(false);
  const [mostrarModalModificarArticulo, setMostrarModalModificarArticulo] = useState(false);
  const [mostrarModalInsumos, setMostrarModalInsumos] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloManufacturado | null>(null);
  const [nuevoArticuloNombre, setNuevoArticuloNombre] = useState("");
  const [nuevoArticuloCategoria, setNuevoArticuloCategoria] = useState("");
  const [nuevoArticuloPrecio, setNuevoArticuloPrecio] = useState<number>(0);
  const [insumosDisponibles, setInsumosDisponibles] = useState<Insumo[]>([]);
  const [precioTotalInsumos, setPrecioTotalInsumos] = useState<number>(0);
  const [criterio, setCriterio] = useState("codigo");

  useEffect(() => {
    // Simula la llamada al backend para obtener insumos disponibles
    const fetchInsumos = async () => {
      // Simulación de datos del backend
      const insumos: Insumo[] = [
        { id: 1, nombre: 'Tomate', precio: 1.5 },
        { id: 2, nombre: 'Lechuga', precio: 0.8 },
        { id: 3, nombre: 'Queso', precio: 2.0 }
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
    if (nuevoArticuloNombre.trim() === "" || nuevoArticuloCategoria.trim() === "" || nuevoArticuloPrecio <= 0) {
      alert("Por favor, complete todos los campos del artículo.");
      return;
    }

    const nuevoCodigo = articulos.length + 1;
    const nuevoArticulo: ArticuloManufacturado = {
      codigo: nuevoCodigo,
      nombre: nuevoArticuloNombre,
      categoria: nuevoArticuloCategoria,
      precio: nuevoArticuloPrecio,
      insumos: []
    };

    setArticulos([...articulos, nuevoArticulo]);
    setNuevoArticuloNombre("");
    setNuevoArticuloCategoria("");
    setNuevoArticuloPrecio(0);
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
        case "codigo":
          return articulo.codigo.toString() === filtro; // Filtrar exactamente por código
        case "nombre":
          return articulo.nombre.toLowerCase() === filtro.toLowerCase(); // Filtrar exactamente por nombre
        case "precio":
          return articulo.precio.toString() === filtro; // Filtrar exactamente por precio
        default:
          return true;
      }
    }
  };
  

  const handleEliminarArticulo = (codigo: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
    const nuevosArticulos = articulos.filter(articulo => articulo.codigo !== codigo);
    setArticulos(nuevosArticulos);
  }
  };

  const handleModificarArticulo = (articulo: ArticuloManufacturado) => {
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

    const nuevosArticulos = [...articulos];
    const indiceArticulo = nuevosArticulos.findIndex(articulo => articulo.codigo === articuloSeleccionado.codigo);

    if (indiceArticulo !== -1) {
      nuevosArticulos[indiceArticulo] = {
        ...articuloSeleccionado,
        nombre: nuevoArticuloNombre,
        categoria: nuevoArticuloCategoria,
        precio: nuevoArticuloPrecio
      };

      setArticulos(nuevosArticulos);
      setMostrarModalModificarArticulo(false);
    }
  };

  const handleAbrirModalInsumos = (articulo: ArticuloManufacturado) => {
    setArticuloSeleccionado(articulo);
    setPrecioTotalInsumos(0);
    setMostrarModalInsumos(true);
  };

  const handleAgregarInsumo = (insumo: Insumo, cantidad: number) => {
    if (!articuloSeleccionado) return;
  
    const insumoExistente = articuloSeleccionado.insumos.find(i => i.insumo.id === insumo.id);
    const nuevaCantidad = insumoExistente ? insumoExistente.cantidad + cantidad : cantidad;
  
    if (nuevaCantidad < 0) return; // Evitar cantidades negativas
  
    const insumosActualizados = articuloSeleccionado.insumos.map(i => {
      if (i.insumo.id === insumo.id) {
        return { ...i, cantidad: i.cantidad + cantidad };
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
        insumos: [...articuloSeleccionado.insumos, { insumo, cantidad }]
      });
    }
  
    setPrecioTotalInsumos(precioTotalInsumos + (insumo.precio * cantidad));
  };
  
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
  
    setPrecioTotalInsumos(precioTotalInsumos + (insumo.precio * delta));
  };
  
  const resetearValoresArticulo = () => {
    setNuevoArticuloNombre('');
    setNuevoArticuloCategoria('');
    setNuevoArticuloPrecio(0);
  };
  
  const handleCerrarModalAgregarArticulo = () => {
    resetearValoresArticulo();
    setMostrarModalAgregarArticulo(false);
  };  

  const handleCerrarModalInsumos = () => {
    setMostrarModalInsumos(false);

    if (articuloSeleccionado) {
      const nuevosArticulos = [...articulos];
      const indiceArticulo = nuevosArticulos.findIndex(articulo => articulo.codigo === articuloSeleccionado.codigo);

      if (indiceArticulo !== -1) {
        nuevosArticulos[indiceArticulo] = {
          ...articuloSeleccionado,
          precio: articuloSeleccionado.precio + precioTotalInsumos
        };

        setArticulos(nuevosArticulos);
        setArticuloSeleccionado(null);
      }
    }
  };

  const handleResetearContadorInsumo = () => {
    if (!articuloSeleccionado) return;
  
    // Calcular el precio total de los insumos
    const precioTotalInsumos = articuloSeleccionado.insumos.reduce((total, insumo) => {
      return total + (insumo.insumo.precio * insumo.cantidad);
    }, 0);
  
    // Restar el precio total de los insumos al precio del artículo
    const precioArticuloActualizado = articuloSeleccionado.precio - precioTotalInsumos;
  
    // Actualizar el precio del artículo y resetear el contador de insumos
    setArticuloSeleccionado({
      ...articuloSeleccionado,
      precio: precioArticuloActualizado,
      insumos: []
    });
  
    // Resetear el precio total de los insumos a cero
    setPrecioTotalInsumos(0);
  };
  
  const handleEliminarInsumo = (insumoId: number) => {
    if (!articuloSeleccionado) return;
  
    const insumoExistente = articuloSeleccionado.insumos.find(i => i.insumo.id === insumoId);
  
    if (insumoExistente) {
      // Calcular el precio total del insumo a eliminar
      const precioInsumoEliminar = insumoExistente.insumo.precio * insumoExistente.cantidad;
  
      // Restar el precio del insumo eliminado del precio total de los insumos
      const precioTotalActualizado = precioTotalInsumos - precioInsumoEliminar;
  
      // Actualizar el precio total de los insumos
      setPrecioTotalInsumos(precioTotalActualizado);
  
      // Filtrar los insumos para eliminar el insumo seleccionado
      const insumosFiltrados = articuloSeleccionado.insumos.filter(i => i.insumo.id !== insumoId);
  
      // Calcular el precio total de los insumos restantes
      const precioInsumosRestantes = insumosFiltrados.reduce((total, insumo) => {
        return total + (insumo.insumo.precio * insumo.cantidad);
      }, 0);
  
      // Restar el precio total de los insumos restantes al precio del artículo
      const precioArticuloActualizado = articuloSeleccionado.precio - precioInsumosRestantes;
  
      // Actualizar los insumos del artículo y el precio del artículo
      setArticuloSeleccionado({
        ...articuloSeleccionado,
        precio: precioArticuloActualizado,
        insumos: insumosFiltrados
      });
    }
  };
  

  return (
    <div>
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

        <button className="btn-agregar" onClick={handleAbrirModalAgregarArticulo}>Agregar Artículo</button>

        <table className="table-container">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th className="modificar">Modificar</th>
              <th className="eliminar">Eliminar</th>
              <th className="insumos">Insumos</th>
            </tr>
          </thead>
          <tbody>
            {articulos.filter(filtrarArticulos).map((articulo: ArticuloManufacturado) => (
              <tr key={articulo.codigo}>
                <td >{articulo.codigo}</td>
                <td>{articulo.nombre}</td>
                <td>{articulo.categoria}</td>
                <td>{articulo.precio.toFixed(2)}</td>
                <td>
                  <button className="modificar" onClick={() => handleModificarArticulo(articulo)}>Modificar</button>
                </td>
                <td>
                  <button className="eliminar" onClick={() => handleEliminarArticulo(articulo.codigo)}>Eliminar</button>
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
                type="number"
                value={nuevoArticuloPrecio}
                onChange={(e) => setNuevoArticuloPrecio(parseFloat(e.target.value))}
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
                type="number"
                value={nuevoArticuloPrecio}
                onChange={(e) => setNuevoArticuloPrecio(parseFloat(e.target.value))}
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
            <span>{insumo.nombre}  ${insumo.precio.toFixed(2)}</span>
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
