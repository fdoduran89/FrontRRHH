import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const urlBase = "/api/empleados/";

function ListadoEmpleados() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const respuesta = await axios.get(urlBase);
      setEmpleados(respuesta.data);
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
      `¿Estás seguro de eliminar al empleado "${nombreEmpleado}"?\n\nEsta acción no se puede deshacer.`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setEliminando(true);
      await axios.delete(`${urlBase}${idEmpleado}/`);
      alert(`✅ Empleado "${nombreEmpleado}" eliminado correctamente`);
      await cargarEmpleados(); // Recargar la lista
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(`❌ Error al eliminar al empleado: ${err.message}`);
    } finally {
      setEliminando(false);
    }
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
        <button
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={cargarEmpleados}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (empleados.length === 0) {
    return (
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Listado de Empleados</h3>
          <Link to="/agregar" className="btn btn-light btn-sm">
            ➕ Nuevo Empleado
          </Link>
        </div>
        <div className="card-body text-center">
          <p className="text-muted">No hay empleados registrados</p>
          <Link to="/agregar" className="btn btn-primary">
            Agregar el primer empleado
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Listado de Empleados</h3>
        <Link to="/agregar" className="btn btn-light btn-sm">
          ➕ Nuevo Empleado
        </Link>
      </div>
      <div className="card-body">
        <div className="table-responsive">
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
              {empleados.map((empleado) => (
                <tr key={empleado.idEmpleado}>
                  <td>{empleado.idEmpleado}</td>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.departamento}</td>
                  <td>
                    <NumericFormat
                      value={empleado.sueldo}
                      displayType={"text"}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="$"
                      renderText={(value) => <strong>{value}</strong>}
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
                      onClick={() =>
                        handleEliminar(empleado.idEmpleado, empleado.nombre)
                      }
                      disabled={eliminando}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-muted small">
          Total de empleados: <strong>{empleados.length}</strong>
        </div>
      </div>
    </div>
  );
}

export default ListadoEmpleados;
