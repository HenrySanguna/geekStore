/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { withRouter } from "react-router-dom";
import { Carousel, Button, List, Card, Modal } from "antd";
import "../css/Main.css";

import { getAllProducts } from "../services/Products";
import Header from "../components/Header";
import cupon from "../img/cupon.jpg";

const { Meta } = Card;
class Main extends React.Component {
  state = {
    allProducts: [],
    idItem: "5",
    setIndex: 0,
    price: 0,
    title: "",
    images: "",
    descr: "",
    options: [],
    setOptions: [],
    productsCart: [],
  };

  async componentDidMount() {
    const products = await getAllProducts();
    if (products !== null) {
      this.setState({ allProducts: products.data });
    }

    this.showConfirm();
    if (
      this.props.history.location.state &&
      this.props.history.location.state.productsSel.length > 0
    ) {
      this.setState({
        productsCart: this.props.history.location.state.productsSel,
      });
    }
  }

  showConfirm = () => {
    Modal.info({
      content: <img src={cupon} style={{ width: 550 }} />,
      onOk() {},
    });
  };

  getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onChange = (a, b, c) => {};

  addProduct = (idItem) => {
    const { allProducts, productsCart } = this.state;
    const setItem = allProducts.find((e) => e._id === idItem);
    const pos = productsCart.findIndex((item) => item.id === idItem);
    if (pos === -1) {
      const datos = {
        id: setItem._id,
        nombre: setItem.title,
        description: setItem.descr,
        cantidad: 1,
        precio: setItem.price,
        precio_total: setItem.price,
      };
      productsCart.push(datos);
    } else {
      const dato = productsCart[pos];
      dato.cantidad = dato.cantidad + 1;
      dato.precio_total = dato.cantidad * dato.precio;
      productsCart[pos] = dato;
    }
    this.setState({ productsCart });
  };

  render() {
    const { allProducts, productsCart } = this.state;
    return (
      <div style={{ width: "100%" }}>
        <Header
          history={this.props.history}
          productsSel={productsCart}
        ></Header>
        <div className="carousel">
          <Carousel afterChange={this.onChange} autoplay>
            {allProducts.map((item, index) => (
              <div key={index}>
                <img src={item.images[0]} />
                <h3>{item.title}</h3>
              </div>
            ))}
          </Carousel>
        </div>
        <div className="products">
          <br />
          <h2>Celulares</h2>
          <List
            grid={{ column: 5 }}
            dataSource={allProducts.filter((item) => item.type === "celular")}
            renderItem={(item, index) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img src={item.images[0]} />}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => {
                        this.addProduct(item._id);
                        this.setState({ idItem: item._id });
                      }}
                    >
                      Añadir al carrito
                    </Button>,
                  ]}
                >
                  <Meta
                    title={item.title}
                    description={"$" + item.price + " +iva"}
                  />
                </Card>
              </List.Item>
            )}
          />
          <br />
          <h2>Laptops</h2>
          <List
            grid={{ column: 5 }}
            dataSource={allProducts.filter((item) => item.type === "laptop")}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img src={item.images[0]} />}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => {
                        this.addProduct(item._id);
                        this.setState({ idItem: item._id });
                      }}
                    >
                      Añadir al carrito
                    </Button>,
                  ]}
                >
                  <Meta
                    title={item.title}
                    description={"$" + item.price + " +iva"}
                  />
                </Card>
              </List.Item>
            )}
          />
          <br />
          <h2>Almacenamiento</h2>
          <List
            grid={{ column: 5 }}
            dataSource={allProducts.filter((item) => item.type === "storage")}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img src={item.images[0]} />}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => {
                        this.addProduct(item._id);
                        this.setState({ idItem: item._id });
                      }}
                    >
                      Añadir al carrito
                    </Button>,
                  ]}
                >
                  <Meta
                    title={item.title}
                    description={"$" + item.price + " +iva"}
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}
export default withRouter(Main);
