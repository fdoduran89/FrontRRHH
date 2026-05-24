import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';

const urlBase = "/api/empleados/";

function ListadoEmpleados() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // Efecto para filtrar empleados cuando cambia el término de búsqueda o la lista original
  useEffect(() => {
    if (terminoBusqueda.trim() === '') {
      setEmpleadosFiltrados(empleados);
    } else {
      const termino = terminoBusqueda.toLowerCase().trim();
      const filtrados = empleados.filter(empleado => 
        empleado.nombre.toLowerCase().includes(termino) ||
        empleado.departamento.toLowerCase().includes(termino)
      );
      setEmpleadosFiltrados(filtrados);
    }
  }, [terminoBusqueda, empleados]);

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const respuesta = await axios.get(urlBase);
      setEmpleados(respuesta.data);
      setEmpleadosFiltrados(respuesta.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los empleados: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (idEmpleado) => {
    navigate(`/editar/${idEmpleado}`);
  };

  const handleEliminar = async (idEmpleado, nombreEmpleado) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar al empleado "${nombreEmpleado}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) {
      return;
    }

    try {
      setEliminando(true);
      await axios.delete(`${urlBase}${idEmpleado}/`);
      alert(`✅ Empleado "${nombreEmpleado}" eliminado correctamente`);
      await cargarEmpleados();
      setTerminoBusqueda(''); // Limpiar búsqueda después de eliminar
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(`❌ Error al eliminar al empleado: ${err.message}`);
    } finally {
      setEliminando(false);
    }
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
  };

  if (cargando) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p>Cargando empleados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        <strong>Error:</strong> {error}
        <button className="btn btn-sm btn-outline-danger ms-3" onClick={cargarEmpleados}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center flex-wrap">
        <h3 className="mb-0">Listado de Empleados</h3>
        <Link to="/agregar" className="btn btn-light btn-sm">
          ➕ Nuevo Empleado
        </Link>
      </div>
      <div className="card-body">
        
        {/* Barra de búsqueda */}
        <div className="row mb-4">
          <div className="col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-dark text-white">
                🔍
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o departamento..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              {terminoBusqueda && (
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={limpiarBusqueda}
                >
                  ✖️ Limpiar
                </button>
              )}
            </div>
            <div className="mt-2 text-muted small">
              {terminoBusqueda ? (
                <>Se encontraron <strong>{empleadosFiltrados.length}</strong> de {empleados.length} empleados</>
              ) : (
                <>Total de empleados: <strong>{empleados.length}</strong></>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div className="table-responsive">
          {empleadosFiltrados.length === 0 ? (
            <div className="alert alert-info text-center">
              No se encontraron empleados que coincidan con "<strong>{terminoBusqueda}</strong>"
            </div>
          ) : (
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Departamento</th>
                  <th>Sueldo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.map((empleado) => (
                  <tr key={empleado.idEmpleado}>
                    <td>{empleado.idEmpleado}</td>
                    <td>{empleado.nombre}</td>
                    <td>{empleado.departamento}</td>
                    <td>
                      <NumericFormat 
                        value={empleado.sueldo} 
                        displayType={'text'} 
                        thousandSeparator="." 
                        decimalSeparator=","
                        prefix="$"
                        renderText={value => <strong>{value}</strong>}
                      />
                    </td>
                    <td>
                      <button 
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditar(empleado.idEmpleado)}
                        disabled={eliminando}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(empleado.idEmpleado, empleado.nombre)}
                        disabled={eliminando}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListadoEmpleados;