import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NumericFormat } from "react-number-format";

// 🔥 CORRECCIÓN: Slash final para Django
const urlBase = "/api/empleados/";

function AgregarEmpleado() {
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState({
    nombre: "",
    departamento: "",
    sueldo: "",
  });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

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
      await axios.post(urlBase, {
        nombre: empleado.nombre,
        departamento: empleado.departamento,
        sueldo: parseFloat(empleado.sueldo),
      });
      navigate("/");
    } catch (err) {
      setError("Error al guardar el empleado: " + err.message);
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="card shadow">
      <div className="card-header bg-success text-white">
        <h3 className="mb-0">Agregar Nuevo Empleado</h3>
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
              className="btn btn-success"
              disabled={enviando}
            >
              {enviando ? "Guardando..." : "💾 Guardar Empleado"}
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

export default AgregarEmpleado;
