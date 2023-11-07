import { useState } from "react";
import "../../components/Header/Header.css";
import logo from "../../assets/GeekStore-logo.png";

import { handleLogin, getUser, logout } from "../../services/Auth";
import { Register } from "../../services/Clients";
//import Articles from "../Articles/Articles";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export const Header = ({ navigate, productsSel }) => {
  const userRegisterDefault = {
    id: "",
    username: "",
    email: "",
    password: "",
  };

  const userLoginDefault = {
    email: "",
    password: "",
  };

  const [user, setUser] = useState(getUser());
  const [visibleL, setVisibleL] = useState(false);
  const [visibleR, setVisibleR] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  const [formularioLogin, setFormularioLogin] = useState(userLoginDefault);
  const [formularioRegistro, setFormularioRegistro] =
    useState(userRegisterDefault);

  const location = useLocation();

  const logoutUser = async () => {
    await logout();
    window.location.href = "/";
  };

  const showModalL = () => {
    setVisibleL(true);
  };

  const showModalR = () => {
    setVisibleR(true);
  };

  const formularioLoginHandler = ({ target }) => {
    const { name, value } = target;
    setFormularioLogin({ ...formularioLogin, [name]: value });
  };

  const formularioRegistroHandler = ({ target }) => {
    const { name, value } = target;
    setFormularioRegistro({ ...formularioRegistro, [name]: value });
  };

  const ingresarUsuario = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (await handleLogin(formularioLogin)) {
      const user = getUser();
      setUser(user);
      setVisibleL(false);
      setLoading(false);
    } else {
      setVisibleL(true);
      setLoading(false);
    }
  };

  const registrarUsuario = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (await Register(formularioRegistro)) {
      setVisibleR(false);
      setLoading(false);
    } else {
      setVisibleR(true);
      setLoading(false);
    }
  };

  const handleCancelL = () => {
    setVisibleL(false);
  };

  const handleCancelR = () => {
    setVisibleR(false);
  };

  const irCarrito = () => {
    navigate('/cart', { state: { productsSel } });
  };

  return (
    <div>
      <header className="Header Flex-container">
        <h1 className="Header-h1">
          <a href="" className="Header-a">
            <img alt="GeekStore" src={logo} className="img-fluid Header-img" />
          </a>
        </h1>
        {user ? (
          <div className="Header-info-user">
            <div className="Header-username">
              <span className="Header-username-span">
                Bienvenid@ {`${user.username}`}
              </span>
            </div>
            <div className="icon-user">
              <button type="button" className="btn btn-primary  position-relative" onPointerDown={irCarrito}>
                Carrito
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {productsSel.length}
                  <span className="visually-hidden">unread messages</span>
                </span>
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={logoutUser}
              >
                Cerrar Sesion
              </button>
              {/* <Articles history={history} productsSel={productsSel} /> */}
            </div>
          </div>
        ) : (
          <div className="Header-info-user">
            <div className="Header-username-btn">
              <button
                className="btn btn-primary Header-btn-ingresar"
                onClick={showModalL}
              >
                Ingresar
              </button>
              <button className="btn btn-danger" onClick={showModalR}>
                Registrarse
              </button>
            </div>
            {/* <Articles history={history} productsSel={productsSel} /> */}
          </div>
        )}
      </header>
      <div className="login">
        <div
          className={`modal fade ${visibleL ? "show" : ""}`}
          style={{ display: visibleL ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ingresar</h5>
              </div>
              <form onSubmit={ingresarUsuario}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formularioLogin.email}
                      onChange={formularioLoginHandler}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formularioLogin.password}
                      onChange={formularioLoginHandler}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={handleCancelL}
                  >
                    Cerrar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Ingresar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="register">
        <div
          className={`modal fade ${visibleR ? "show" : ""}`}
          style={{ display: visibleR ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrarse</h5>
              </div>
              <form onSubmit={registrarUsuario}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      Usuario
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="form-control"
                      value={formularioRegistro.username}
                      onChange={formularioRegistroHandler}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      aria-describedby="emailHelp"
                      className="form-control"
                      value={formularioRegistro.email}
                      onChange={formularioRegistroHandler}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      value={formularioRegistro.password}
                      onChange={formularioRegistroHandler}
                      required
                    />
                  </div>
                  <div className="form-group"></div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={handleCancelR}
                  >
                    Cerrar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Registrarse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  navigate: PropTypes.func.isRequired,
  productsSel: PropTypes.array,
};
