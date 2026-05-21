import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const urlBase = "/api/empleados/";

function EditarEmpleado() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [empleado, setEmpleado] = useState({
    nombre: "",
    departamento: "",
    sueldo: "",
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarEmpleado();
  }, [id]);

  const cargarEmpleado = async () => {
    try {
      setCargando(true);
      const respuesta = await axios.get(`${urlBase}${id}/`);
      setEmpleado({
        nombre: respuesta.data.nombre,
        departamento: respuesta.data.departamento,
        sueldo: respuesta.data.sueldo,
      });
      setError(null);
    } catch (err) {
      setError("Error al cargar el empleado: " + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setEmpleado({
      ...empleado,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      await axios.put(`${urlBase}${id}/`, {
        nombre: empleado.nombre,
        departamento: empleado.departamento,
        sueldo: parseFloat(empleado.sueldo),
      });
      navigate("/");
    } catch (err) {
      setError("Error al actualizar el empleado: " + err.message);
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p>Cargando datos del empleado...</p>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header bg-warning text-dark">
        <h3 className="mb-0">✏️ Editar Empleado</h3>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre completo:</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={empleado.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Departamento:</label>
            <select
              className="form-select"
              name="departamento"
              value={empleado.departamento}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="TI">TI - Tecnologías de Información</option>
              <option value="RRHH">RRHH - Recursos Humanos</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Ventas">Ventas</option>
              <option value="Operaciones">Operaciones</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Sueldo:</label>
            <NumericFormat
              className="form-control"
              name="sueldo"
              value={empleado.sueldo}
              onValueChange={(values) => {
                setEmpleado({
                  ...empleado,
                  sueldo: values.floatValue || "",
                });
              }}
              thousandSeparator="."
              decimalSeparator=","
              prefix="$ "
              decimalScale={0}
              allowNegative={false}
              placeholder="$ 0"
              required
            />
            <small className="text-muted">
              Formato: solo números, sin decimales
            </small>
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-warning"
              disabled={enviando}
            >
              {enviando ? "Actualizando..." : "💾 Actualizar Empleado"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarEmpleado;
