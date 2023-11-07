import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import Timer from "react-compound-timer";
import QRCode from "qrcode";
import { Header } from "../../components/Header/Header";
import "../../pages/Cart/Cart.css";

import { updateCupon, validateCupon } from "../../services/Clients";
import { getUser, accessCheck } from "../../services/Auth";
import { templateProforma } from "../../utils/template";
import toPrint from "../../utils/toPrintTemplate";

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

export const Cart = ({ history, notAvailableClick }) => {
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState(0);
  const [productsSel, setProductsSel] = useState([]);
  const [loadingR, setLoadingR] = useState(false);
  const [enable, setEnable] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const [typePayment, setTypePayment] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    setUser(user);
    setProductsSel(location.state.productsSel);

    const totalPro = location.state.productsSel;
    if (totalPro && totalPro.length > 0) {
      let tot = 0,
        sub = 0,
        iv = 0;
      for (let i = 0; i < totalPro.length; i++) {
        sub = Number(sub + totalPro[i].precio_total);
      }
      iv = Number(parseFloat(sub * 0.12).toFixed(2));
      tot = parseFloat(sub + iv).toFixed(2);
      setSubtotal(sub);
      setIva(iv);
      setTotal(tot);
    }
    if (user !== null && user.cupon !== "") {
      setEnable(false);
    } else {
      setEnable(true);
    }
  }, [location.state]);

  const handleCupon = async (values) => {
    const { total } = this.state;
    const totalC = parseFloat(Number(total) - Number(total * 0.07)).toFixed(2);
    setLoadingR(true);
    if (await validateCupon(values.cupon)) {
      setEnable(true);
      setLoadingR(false);
      setTotal(totalC);
    } else {
      setLoadingR(false);
    }
  };

  const continuarCompra = async () => {
    if (accessCheck()) {
      if (total > 800) {
        const code = makeid(12);
        const cupon = await updateCupon(code);
        if (cupon === "ya") {
          const newCurrent = current + 1;
          setCurrent(newCurrent);
        } else if (cupon === "ok") {
          QRCode.toDataURL(code)
            .then((url) => {
              // Modal.info({
              //   title: "Gracias por preferirnos!!",
              //   content: (
              //     <div>
              //       <h2 style={{ fontSize: 15, fontFamily: "Comic Sans" }}>
              //         Por favor escanéa el codigo QR para obtener tu codigo de
              //         cupón
              //       </h2>
              //       <br />
              //       <img src={url} style={{ width: 200 }}></img>
              //     </div>
              //   ),
              //   onOk() {},
              // });
            })
            .catch((err) => {
              console.error(err);
            });
          const newCurrent = current + 1;
          setCurrent(newCurrent);
        }
      } else if (total < 800 && total !== 0) {
        const newCurrent = current + 1;
        setCurrent(newCurrent);
      } else {
        // Modal.error({
        //   title: "Carrito vacío",
        //   content: "Por favor agrega artículos para continuar",
        // });
      }
    } else {
      // Modal.error({
      //   title: "Hola solo falta un poco!!",
      //   content: "Por favor Ingresa o registrate entes de comprar",
      // });
    }
  };

  const end = () => {
    // Modal.success({
    //   content: "Genial, ha finalizado tu compra!",
    // });
  };

  const setvalChange = (values) => {
    if (values.payType) {
      setTypePayment(values.payType);
    }
  };

  const outTime = async () => {
    // Modal.error({
    //   title: "This is an error message",
    //   content: "some messages...some messages...",
    // });
    setTimeOut(true);
  };

  const makeid = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

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
      <Header navigate={navigate} productsSel={productsSel}></Header>
      <div className="row">
        <div className="col-8">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Descripcion</th>
                <th>Precio unitario</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {productsSel.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>{item.description}</td>
                  <td>{item.precio}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.precio_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-4">
          <div
            className="factura-compra"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Total a comprar</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {totales.map((item) => (
                  <tr key={item.key}>
                    <td>{item.title}</td>
                    <td>{item.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form name="cupon" onSubmit={handleCupon} style={{ paddingTop: 5 }}>
              <div className="mb-3">
                <label htmlFor="cupon" className="form-label">
                  Cupón
                </label>
                <input type="text" className="form-control" id="cupon" />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={enable}
              >
                Aplicar cupón
              </button>
            </form>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  toPrint(
                    templateProforma(productsSel, subtotal, iva, total, user)
                  );
                }}
              >
                Imprimir Proforma <i className="bi bi-printer"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* {steps[current].content === "Second-content" && (
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
                    setTimeOut(true);
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
              onFinish={end}
              onValuesChange={setvalChange}
              validateMessages={validateMessages}
            >
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true }]}
              >
                <Input
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", required: true }]}
              >
                <Input
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
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
      {/* {typePayment === "credit" && (
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
              )} */}
      {/* {typePayment === "counted" && (
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
      )}*/}
      {/* <div className="steps-action">
        {current < steps.length - 1 && (
          <Button
            type="primary"
            style={{ marginBottom: 20, fontWeight: "bold" }}
            onClick={continuarCompra}
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
              end();
              setTimeout(() => {
                if (!notAvailableClick) {
                  navigate.history.push({
                    pathname: "/",
                  });
                }
              }, 5000);
            }}
          >
            Finalizar compra
          </Button>
        )}
      </div> */}
    </div>
  );
};
