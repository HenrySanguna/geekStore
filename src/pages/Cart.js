import React from "react";
import { withRouter } from "react-router-dom";
import Timer from "react-compound-timer";
import {
  Steps,
  Modal,
  Button,
  Select,
  Row,
  Col,
  Table,
  Form,
  Input,
  InputNumber,
  DatePicker,
} from "antd";
import { SmileOutlined, PrinterOutlined } from "@ant-design/icons";
import QRCode from "qrcode";
import Header from "../components/Header";
import "../css/cart.css";
import ColumnGroup from "antd/lib/table/ColumnGroup";

import { updateCupon, validateCupon } from "../services/Clients";
import { getUser, accessCheck } from "../services/Auth";
import { templateProforma } from "../utils/template";
import toPrint from "../utils/toPrintTemplate";

const { Step } = Steps;
const { Column } = Table;
const { Option } = Select;

const steps = [
  {
    title: "Carrito",
    content: "First-content",
  },
  {
    title: "Detalles del pago",
    content: "Second-content",
  },
];

const validateMessages = {
  required: "${label} es requerido!",
  types: {
    email: "${label} no es un email válido!",
  },
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      current: 0,
      productsSel: [],
      loadingR: false,
      enable: false,
      timeOut: false,
      subtotal: 0,
      iva: 0,
      total: 0,
      typePayment: "",
    };
  }

  componentDidMount() {
    const user = getUser();
    console.log('CUPONEN', user);
    this.setState({ user: user });
    this.setState({
      productsSel: this.props.history.location.state.productsSel,
    });

    const totalPro = this.props.history.location.state.productsSel;
    if (totalPro && totalPro.length > 0) {
      let tot = 0,
        sub = 0,
        iv = 0;
      for (let i = 0; i < totalPro.length; i++) {
        sub = Number(sub + totalPro[i].precio_total);
      }
      iv = Number(parseFloat(sub * 0.12).toFixed(2));
      tot = parseFloat(sub + iv).toFixed(2);
      this.setState({
        subtotal: sub,
        iva: iv,
        total: tot,
        totalC: tot,
      });
    }
    if (user !== null && user.cupon !== "") {
      this.setState({ enable: false });
    } else {
      this.setState({ enable: true });
    }
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  removeProduct = () => {};

  handleCupon = async (value) => {
    const { total } = this.state;
    const totalC = parseFloat(Number(total) - Number(total * 0.07)).toFixed(2);
    this.setState({ loadingR: true });
    if (await validateCupon(value.cupon)) {
      this.setState({ enable: true });
      this.setState({ loadingR: false });
      this.setState({ total: totalC });
    } else {
      this.setState({ loadingR: false });
    }
  };

  continuarCompra = async () => {
    const { total } = this.state;
    if (accessCheck()) {
      if (total > 800) {
        const code = this.makeid(12);
        const cupon = await updateCupon(code);
        if (cupon === 'ya') {
          const current = this.state.current + 1;
          this.setState({ current });
        } else if (cupon === 'ok') {
          QRCode.toDataURL(code)
            .then((url) => {
              Modal.info({
                title: "Gracias por preferirnos!!",
                content: (
                  <div>
                    <h2 style={{ fontSize: 15, fontFamily: "Comic Sans" }}>
                      Por favor escanéa el codigo QR para obtener tu codigo de
                      cupón
                    </h2>
                    <br />
                    <img src={url} style={{ width: 200 }}></img>
                  </div>
                ),
                onOk() {},
              });
            })
            .catch((err) => {
              console.error(err);
            });
          const current = this.state.current + 1;
          this.setState({ current });
        }
      } else if (total < 800 && total !== 0) {
        const current = this.state.current + 1;
        this.setState({ current });
      } else {
        Modal.error({
          title: "Carrito vacío",
          content: "Por favor agrega artículos para continuar",
        });
      }
    } else {
      Modal.error({
        title: "Hola solo falta un poco!!",
        content: "Por favor Ingresa o registrate entes de comprar",
      });
    }
  };

  makeid = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  end = () => {
    Modal.success({
      content: "Genial, ha finalizado tu compra!",
    });
  };

  setvalChange = (values) => {
    console.log("TIPO", values);
    if (values.payType) {
      this.setState({ typePayment: values.payType });
    }
  };

  outTime = async () => {
    Modal.error({
      title: "This is an error message",
      content: "some messages...some messages...",
    });
    this.setState({ timeOut: true });
  };

  render() {
    const {
      user,
      current,
      productsSel,
      loadingR,
      subtotal,
      iva,
      total,
      enable,
      timeOut,
      typePayment,
    } = this.state;
    const { notAvailableClick } = this.props;

    const totales = [
      {
        title: "Subtotal",
        data: `${subtotal}`,
        key: 1,
      },
      {
        title: "Iva (12%)",
        data: `${iva}`,
        key: 2,
      },
      {
        title: "Total",
        data: `${total}`,
        key: 3,
      },
    ];

    return (
      <div>
        <Header history={this.props.history} productsSel={productsSel}></Header>
        <Steps current={current} style={{ marginTop: 24 }}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          {steps[current].content === "First-content" && (
            <Row>
              <Col span={16}>
                <Table dataSource={productsSel} key={1}>
                  <Column title="Producto" dataIndex="nombre" key="nombre" />
                  <Column
                    title="Descripcion"
                    dataIndex="description"
                    key="description"
                  />
                  <Column
                    title="Precio unitario"
                    dataIndex="precio"
                    key="precio"
                  />
                  <Column
                    title="Cantidad"
                    dataIndex="cantidad"
                    key="cantidad"
                  />
                  <Column
                    title="Total"
                    dataIndex="precio_total"
                    key="precio_total"
                  />
                </Table>
              </Col>
              <Col span={8}>
                <div
                  className="factura-compra"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Table
                    dataSource={totales}
                    pagination={false}
                    bordered
                    key={2}
                  >
                    <ColumnGroup title="Total a comprar">
                      <Column title="" dataIndex="title" key="title" />
                      <Column title="" dataIndex="data" key="data" />
                    </ColumnGroup>
                  </Table>
                  <Form
                    name="cupon"
                    onFinish={this.handleCupon}
                    style={{ paddingTop: 5 }}
                  >
                    <Form.Item label="Cupón" name="cupon">
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loadingR}
                        disabled={enable}
                      >
                        Aplicar cupón
                      </Button>
                    </Form.Item>
                  </Form>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        toPrint(
                          templateProforma(
                            productsSel,
                            subtotal,
                            iva,
                            total,
                            user
                          )
                        );
                      }}
                      icon={<PrinterOutlined />}
                    >
                      Imprimir Proforma
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          )}
          {steps[current].content === "Second-content" && (
            <Row>
              <Col span={14}>
                <h3 style={{ color: "#009c8c", fontWeight: "bold" }}>
                  Tiempo para completar su compra
                </h3>
                <Timer
                  initialTime={5000 * 60}
                  direction="backward"
                  checkpoints={[
                    {
                      time: 0,
                      callback: () => {
                        Modal.error({
                          title: "El tiempo ha terminado :(",
                          content: "Por favor realiza una nueva compra",
                        });
                        this.setState({ timeOut: true });
                      },
                    },
                  ]}
                >
                  {() => (
                    <div className="timer">
                      <Timer.Minutes /> minutos
                      <span> </span>
                      <Timer.Seconds /> segundos
                    </div>
                  )}
                </Timer>
                <Form
                  {...layout}
                  name="nest-messages"
                  onFinish={this.end}
                  onValuesChange={this.setvalChange}
                  validateMessages={validateMessages}
                >
                  <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[{ required: true }]}
                  >
                    <Input
                      onChange={(e) => this.setState({ name: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ type: "email", required: true }]}
                  >
                    <Input
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item
                    name="ci"
                    label="Cedula/RUC"
                    rules={[{ type: "number" }]}
                  >
                    <InputNumber
                      style={{ width: 200 }}
                      maxLength={13}
                      minLength={10}
                    />
                  </Form.Item>
                  <Form.Item name="direccion" label="Dirección">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Forma de pago"
                    name="payType"
                    rules={[
                      {
                        required: true,
                        message: "Selecciona la forma de pago!",
                      },
                    ]}
                  >
                    <Select placeholder="Seleccion la forma de pago">
                      <Option value="counted">Transferencia</Option>
                      <Option value="credit">Trajeta de crédito/débito</Option>
                    </Select>
                  </Form.Item>
                  {/* Opciones de credito */}
                  {typePayment === "credit" && (
                    <div>
                      <Form.Item
                        label="Tipo de tarjeta"
                        name="typeTarget"
                        rules={[
                          {
                            required: true,
                            message: "Selecciona la tarjeta!",
                          },
                        ]}
                      >
                        <Select placeholder="Selecciona el tipo de tarjeta">
                          <Option value="visa">Visa</Option>
                          <Option value="mastercard">Mastercard</Option>
                          <Option value="american">American Express</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Numero de tarjeta"
                        name="numTarget"
                        rules={[{ type: "number", required: true }]}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        label="Titular de la tarjeta"
                        name="owner"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Codigo de seguridad"
                        name="code"
                        rules={[{ type: "number", required: true }]}
                      >
                        <InputNumber maxLength={3} />
                      </Form.Item>
                      <Form.Item
                        name="date"
                        label="Fecha de caducidad"
                        rules={[
                          {
                            type: "object",
                            required: true,
                          },
                        ]}
                      >
                        <DatePicker picker="month" />
                      </Form.Item>
                    </div>
                  )}
                  {typePayment === "counted" && (
                    <div>
                      <Form.Item
                        label="Banco"
                        name="bank"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione el banco!",
                          },
                        ]}
                      >
                        <Select placeholder="Selecciona el banco">
                          <Option value="pichincha">Banco Pichincha</Option>
                          <Option value="guayaquil">Banco de Guayaquil</Option>
                          <Option value="produbanco">Produbanco</Option>
                          <Option value="pacifico">Banco del Pacifico</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Tipo de Cuenta"
                        name="accountType"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione el banco!",
                          },
                        ]}
                      >
                        <Select placeholder="Seleccione el tipo de cuenta">
                          <Option value="ahorros">Ahorros</Option>
                          <Option value="corriente">Corriente</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Numero de cuenta"
                        name="numBank"
                        rules={[{ type: "number", required: true }]}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        label="Identificacion del titular"
                        name="identification"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  )}
                </Form>
              </Col>
              <Col span={10}>
                <div className="factura-compra">
                  <h2 style={{ fontWeight: "bold" }}>Tu compra</h2>
                  <Table dataSource={productsSel} pagination={false} key={3}>
                    <Column title="Producto" dataIndex="nombre" key="id" />
                    <Column title="Cantidad" dataIndex="cantidad" key="id" />
                    <Column title="Total" dataIndex="precio_total" key="id" />
                  </Table>
                  <Table dataSource={totales} pagination={false}>
                    <ColumnGroup title="Total a comprar">
                      <Column title="" dataIndex="title" key="title" />
                      <Column title="" dataIndex="data" key="data" />
                    </ColumnGroup>
                  </Table>
                  <p>
                    Depósito / Transferencia bancaria directa Realiza tu pago
                    directamente en nuestra cuenta bancaria. Puedes usar
                    transferencia bancaria o depósito, y enviar el comprobante a
                    nuestro correo electrónico. Verificamos cada pedido
                    inmediatamente.
                  </p>
                </div>
              </Col>
            </Row>
          )}
        </div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button
              type="primary"
              style={{ marginBottom: 20, fontWeight: "bold" }}
              onClick={this.continuarCompra}
            >
              Continuar compra
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              style={{ marginBottom: 20, fontWeight: "bold" }}
              disabled={timeOut}
              onClick={() => {
                this.end();
                setTimeout(() => {
                  if (!notAvailableClick) {
                    this.props.history.push({
                      pathname: "/",
                    });
                  }
                }, 5000);
              }}
            >
              Finalizar compra
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Cart);
