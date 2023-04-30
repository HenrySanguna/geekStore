import React from "react";
import "../css/header.css";
import logo from "../img/InnovGeek2.png";
import {
  Form,
  Modal,
  Checkbox,
  Popover,
  Button,
  Breadcrumb,
  Input,
  Affix,
} from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { handleLogin, getUser, logout } from "../services/Auth";
import { Register } from "../services/Clients";
import Articles from "./Articles";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const validateMessages = {
  required: "${label} es requerido!",
  types: {
    email: "${label} no es un email válido!",
  },
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productsSel: null,
      user: null,
      visibleL: false,
      visibleR: false,
      loadingL: false,
      loadingR: false,
      username: "",
      password: "",
    };
  }

  componentDidMount() {
    const user = getUser();
    this.setState({ user: user });
  }

  logout = async () => {
    await logout();
    window.location.href = "/";
  };

  showModalL = () => {
    this.setState({
      visibleL: true,
    });
  };

  showModalR = () => {
    this.setState({
      visibleR: true,
    });
  };

  handleOkL = async (values) => {
    this.setState({ loadingL: true });
    if (await handleLogin(values.username, values.password)) {
      const user = getUser();
      this.setState({ user: user });
      this.setState({
        visibleL: false,
        loadingL: false,
      });
    } else {
      this.setState({
        visibleL: true,
        loadingL: false,
      });
    }
  };

  handleOkR = async (values) => {
    this.setState({ loadingR: true });
    if (await Register(values.email, values.username, values.password)) {
      this.setState({
        visibleR: false,
        loadingR: false,
      });
    } else {
      this.setState({
        visibleR: true,
        loadingR: false,
      });
    }
  };

  handleCancelL = () => {
    this.setState({
      visibleL: false,
    });
  };

  handleCancelR = () => {
    this.setState({
      visibleR: false,
    });
  };

  render() {
    const { user, visibleL, visibleR, loadingL, loadingR } = this.state;
    const { notAvailableClick, productsSel } = this.props;
    return (
      <div>
        <Affix>
          <div className="header">
            <div className="logo">
              <img
                alt="Logo"
                src={logo}
                style={{ width: "244px", height: "122px" }}
                onClick={() => {
                  if (!notAvailableClick) {
                    this.props.history.push({
                      pathname: "/",
                    });
                  }
                }}
              />
            </div>
            <div className="tabs">
              <Breadcrumb>
                <Breadcrumb.Item
                  onClick={() => {
                    if (!notAvailableClick) {
                      this.props.history.push({
                        pathname: "/",
                        state: { productsSel },
                      });
                    }
                  }}
                >
                  <HomeOutlined style={{ fontSize: 20 }} />
                  <span style={{ fontSize: 20, fontWeight: "bold" }}>
                    Inicio
                  </span>
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  onClick={() => {
                    if (!notAvailableClick) {
                      this.props.history.push({
                        pathname: "/cart",
                        state: { productsSel },
                      });
                    }
                  }}
                >
                  <ShoppingCartOutlined style={{ fontSize: 20 }} />
                  <span style={{ fontSize: 20, fontWeight: "bold" }}>
                    Carrito
                  </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            {user ? (
              <div className="info-user">
                <div className="log">
                  <span style={{ fontSize: 20, fontWeight: "bold" }}>
                    Bienvenid@ <b>{`${user.username}`}</b>
                  </span>
                </div>
                <div className="icon-user">
                  <Popover
                    placement="bottomRight"
                    content={
                      <Button type="danger" onClick={this.logout}>
                        Cerrar Sesion
                      </Button>
                    }
                  >
                    <UserOutlined style={{ fontSize: "30px" }} />
                  </Popover>
                  <Articles
                    history={this.props.history}
                    productsSel={productsSel}
                  />
                </div>
              </div>
            ) : (
              <div className="info-user">
                <div className="log">
                  <Button
                    onClick={this.showModalL}
                    style={{ marginRight: 10, fontWeight: "bold" }}
                  >
                    Ingresar
                  </Button>
                  <Button
                    type="danger"
                    onClick={this.showModalR}
                    style={{ fontWeight: "bold" }}
                  >
                    Registrarse
                  </Button>
                </div>
                <Articles
                  history={this.props.history}
                  productsSel={productsSel}
                />
              </div>
            )}
          </div>
        </Affix>
        <div className="login">
          <Modal
            title="Ingresar"
            visible={visibleL}
            onCancel={this.handleCancelL}
            footer={[<Button key="back"></Button>]}
          >
            <Form
              {...layout}
              name="login"
              initialValues={{ remember: true }}
              onFinish={this.handleOkL}
              validateMessages={validateMessages}
            >
              <Form.Item
                label="Email"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese su email",
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese su contraseña",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                {...tailLayout}
                name="remember"
                valuePropName="checked"
              >
                <Checkbox>Recordarme</Checkbox>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" loading={loadingL}>
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div className="register">
          <Modal
            title="Registrarse"
            visible={visibleR}
            onOk={this.handleOkR}
            onCancel={this.handleCancelR}
            footer={[<Button key="back"></Button>]}
          >
            <Form
              {...layout}
              name="register"
              onFinish={this.handleOkR}
              validateMessages={validateMessages}
            >
              <Form.Item
                label="Usuario"
                name="username"
                rules={[
                  { required: true, message: "Debe ingresar un usuario" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar un email",
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: "Debe ingresar una contraseña" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" loading={loadingR}>
                  Registrarse
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Header;
