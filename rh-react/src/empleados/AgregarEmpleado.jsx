import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const urlBase = "/api/empleados/";

function AgregarEmpleado() {
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState({
    nombre: "",
    departamento: "",
    sueldo: "",
  });
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setEmpleado({
      ...empleado,
      [e.target.name]: e.target.value,
    });

    if (erroresValidacion[e.target.name]) {
      setErroresValidacion({
        ...erroresValidacion,
        [e.target.name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    setErroresValidacion({});

    // Preparar datos para enviar
    const datosEnvio = {
      nombre: empleado.nombre.trim(),
      departamento: empleado.departamento,
      sueldo: parseFloat(empleado.sueldo), // Asegurar que sea número
    };

    console.log("Enviando datos al backend:", datosEnvio);

    try {
      const respuesta = await axios.post(urlBase, datosEnvio);
      console.log("Respuesta del backend:", respuesta.data);
      navigate("/");
    } catch (err) {
      console.error("Error completo:", err);

      // Verificar si el backend envió detalles de validación
      if (err.response && err.response.status === 400) {
        if (err.response.data) {
          // Capturar errores de validación específicos
          setErroresValidacion(err.response.data);
          setError("Por favor, corrige los errores en el formulario.");
        } else {
          setError(
            "Error de validación en el servidor. Verifica los datos ingresados.",
          );
        }
      } else if (err.response && err.response.status === 500) {
        setError("Error interno del servidor. Contacta al administrador.");
      } else {
        setError("Error al guardar el empleado: " + err.message);
      }
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
              className={`form-control ${erroresValidacion.nombre ? "is-invalid" : ""}`}
              name="nombre"
              value={empleado.nombre}
              onChange={handleChange}
              required
              maxLength={100}
            />
            {erroresValidacion.nombre && (
              <div className="invalid-feedback">
                {Array.isArray(erroresValidacion.nombre)
                  ? erroresValidacion.nombre.join(", ")
                  : erroresValidacion.nombre}
              </div>
            )}
            <small className="text-muted">Máximo 100 caracteres</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Departamento:</label>
            <select
              className={`form-select ${erroresValidacion.departamento ? "is-invalid" : ""}`}
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
            {erroresValidacion.departamento && (
              <div className="invalid-feedback">
                {Array.isArray(erroresValidacion.departamento)
                  ? erroresValidacion.departamento.join(", ")
                  : erroresValidacion.departamento}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Sueldo:</label>
            <NumericFormat
              className={`form-control ${erroresValidacion.sueldo ? "is-invalid" : ""}`}
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
            {erroresValidacion.sueldo && (
              <div className="invalid-feedback">
                {Array.isArray(erroresValidacion.sueldo)
                  ? erroresValidacion.sueldo.join(", ")
                  : erroresValidacion.sueldo}
              </div>
            )}
            <small className="text-muted">
              Solo números enteros, sin decimales
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
