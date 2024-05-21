import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api';

type Insumo = {
  id: number;
  denominacion: string;
  precioCompra: number;
  precioVenta: number;
  cantidad: number;
  stockMaximo: number;
  esParaElaborar: boolean;
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
  disponible: boolean;
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
  const [nuevoInsumo, setNuevoInsumo] = useState({ denominacion: '', precioCompra: 0, cantidad: 0, stockMaximo: 0 });
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [mostrarModalInsumos, setMostrarModalInsumos] = useState(false);
  const [mostrarModalAgregarInsumo, setMostrarModalAgregarInsumo] = useState(false);
  const [criterio, setCriterio] = useState("id");
  const [insumosDisponibles, setInsumosDisponibles] = useState([]);
  const [mostrarFormularioNuevoInsumo, setMostrarFormularioNuevoInsumo] = useState(false); 
  const [precioTotalArticulo, setPrecioTotalArticulo] = useState<number>(0); // Estado para el precio total del artículo manufacturado
  


  ///////////////////// INSUMOS/////////

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/articulosinsumos');
      if (!response.ok) {
        throw new Error('Error al obtener insumos');
      }
      const data = await response.json();
      setInsumos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAbrirModalInsumos = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/articulomanufacturados/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos del artículo manufacturado');
      }
      const data = await response.json();
      const insumos = data.articuloManufacturadoDetalles.map((d: { articuloInsumo: any; }) => d.articuloInsumo);
      console.log(insumos); // Verifica que obtienes los datos de los insumos correctamente
      setInsumos(insumos);
      setMostrarModalInsumos(true);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  

  const handleCerrarModalInsumos = () => {
    setMostrarModalInsumos(false);
  };

  const handleAbrirModalAgregarInsumo = () => {
    setMostrarModalAgregarInsumo(true);
  };

  const handleCerrarModalAgregarInsumo = () => {
    setMostrarModalAgregarInsumo(false);
  };

  


  //////////////////////Agregar INSUMOS///////////////////////////


  const fetchInsumosDisponibles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/articulosinsumos');
      if (!response.ok) {
        throw new Error('Error al obtener los insumos disponibles');
      }
      const data = await response.json();
      setInsumosDisponibles(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Llama a la función fetchInsumosDisponibles en el useEffect para obtener los insumos disponibles al cargar el componente
  useEffect(() => {
    fetchInsumosDisponibles();
  }, []);

  // const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
  //   const { name, value } = e.target;
  //   // Actualiza el estado del nuevo insumo
  //   setNuevoInsumo((prevInsumo) => ({
  //     ...prevInsumo,
  //     [name]: value,
  //   }));
  //   // Realiza una llamada a la API para obtener la información completa del insumo seleccionado
  //   if (value !== "Nuevo") {
  //     fetchInsumoById(parseInt(value));
  //   }
  // };

  const handleAgregarInsumo = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    if (nuevoInsumo.denominacion !== "") {
      // Verifica si el nuevo insumo ya existe en la lista de insumos
      const existeInsumo = insumosDisponibles.find(insumo => insumo.denominacion === nuevoInsumo.denominacion);
      if (existeInsumo) {
        // Si el insumo ya existe, simplemente agrégalo a la lista de insumos
        setInsumos([...insumos, existeInsumo]);
      } else {
        // Si no existe, muestra un mensaje de error
        console.error('El insumo seleccionado no se encontró en la lista de insumos disponibles.');
      }
    } else {
      // Si no se ha seleccionado un insumo, muestra un mensaje de error
      console.error('Por favor, selecciona un insumo válido.');
    }
  
    // Restablece los valores del nuevo insumo y cierra el modal
    setNuevoInsumo({
      denominacion: '',
      precioCompra: 0,
      cantidad: 0,
      stockMaximo: 0,
    });
    handleCerrarModalAgregarInsumo();
  };
  

  ///////////////////////////ARTICULOS///////////////////////////
  
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
      eliminado: false,
      disponible: true
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
          eliminado: true
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud PUT');
      }
  
      if (response.ok) {
        const updatedArticulo: ArticuloManufacturado = await response.json();
        const nuevosArticulos = articulos.map(articulo =>
          articulo.id === updatedArticulo.id ? updatedArticulo : articulo
        );
        setArticulos(nuevosArticulos);
        setMostrarModalModificarArticulo(false);
      } else {
        console.error("Error al guardar la modificación del artículo:", await response.text());
      }
    } catch (error) {
      console.error("Error al guardar la modificación del artículo:", error);
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
                <td>{articulo.eliminado ? "OK" : "NOT OK"}</td>
                <td>
                  <button className="insumos" onClick={() => handleAbrirModalInsumos(articulo.id)}>Insumos</button>
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

{mostrarModalInsumos && (
  <div className="modal">
    <div className="modal-content">
      <h3>Lista de Insumos</h3>
      <button onClick={handleAbrirModalAgregarInsumo}>Agregar Insumo</button>
      <table className='table-container2'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Denominación</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Cantidad</th>
            <th>Stock Máximo</th>
            <th>Es para Elaborar?</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo.id}>
              <td>{insumo.id}</td>
              <td>{insumo.denominacion}</td>
              <td>${insumo.precioCompra}</td>
              <td>${insumo.precioVenta}</td>
              <td>{insumo.cantidad}</td>
              <td>{insumo.stockMaximo}</td>
              <td>{insumo.esParaElaborar ? 'Sí' : 'No'}</td> {/* Mostrar "Sí" o "No" en lugar de true/false */}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-cerrar" onClick={handleCerrarModalInsumos}>Cerrar</button>
    </div>
  </div>
)}

{mostrarModalAgregarInsumo && (
  <div className="modal">
    <div className="modal-content">
      <h3>Agregar Insumo</h3>
      <form onSubmit={handleAgregarInsumo}>
        <label>
          Seleccionar insumo:
          <select
            value={mostrarFormularioNuevoInsumo ? "Nuevo" : nuevoInsumo.denominacion}
            onChange={(e) => {
              const selectedOption = e.target.value;
              if (selectedOption === "Nuevo") {
                // Mostrar el formulario para un nuevo insumo
                setMostrarFormularioNuevoInsumo(true);
                // Limpiar la denominación
                setNuevoInsumo({ ...nuevoInsumo, denominacion: "" });
              } else {
                // Ocultar el formulario y establecer la opción seleccionada
                setMostrarFormularioNuevoInsumo(false);
                // Obtener la información del insumo seleccionado
                const selectedInsumo = insumosDisponibles.find((insumo) => insumo.denominacion === selectedOption);
                if (selectedInsumo) {
                  setNuevoInsumo(selectedInsumo);
                }
              }
            }}
          >
            <option value="">Seleccionar...</option>
            {insumosDisponibles.map((insumo) => (
              <option key={insumo.id} value={insumo.denominacion}>
                {insumo.denominacion}
              </option>
            ))}
            <option value="Nuevo">Nuevo</option> {/* Opción para agregar un nuevo insumo */}
          </select>
        </label>
        {mostrarFormularioNuevoInsumo && (
          <div>
            <label>
              Denominación:
              <input
                type="text"
                value={nuevoInsumo.denominacion}
                onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, denominacion: e.target.value })}
              />
            </label>
            <label>
              Precio Compra:
              <input
                type="number"
                value={nuevoInsumo.precioCompra}
                onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, precioCompra: parseFloat(e.target.value) })}
              />
            </label>
            <label>
              Cantidad:
              <input
                type="number"
                value={nuevoInsumo.cantidad}
                onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, cantidad: parseInt(e.target.value) })}
              />
            </label>
            <label>
              Stock Máximo:
              <input
                type="number"
                value={nuevoInsumo.stockMaximo}
                onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, stockMaximo: parseInt(e.target.value) })}
              />
            </label>
          </div>
        )}
        <button type="submit">Guardar</button>
        <button type="button" onClick={() => {
          // Cerrar el modal y ocultar el formulario
          setMostrarModalAgregarInsumo(false);
          setMostrarFormularioNuevoInsumo(false);
        }}>Cerrar</button>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default ArticuloManufacturado;
