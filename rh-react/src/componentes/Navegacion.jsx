import { Link } from "react-router-dom";

function Navegacion() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-primary mb-4"
      data-bs-theme="dark"
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          🏢 RH System
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                📋 Listado
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agregar">
                ➕ Agregar Empleado
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navegacion;
