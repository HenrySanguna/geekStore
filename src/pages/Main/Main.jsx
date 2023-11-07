import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../pages/Main/Main.css";

import { getAllProducts } from "../../services/Products";
import { Header } from "../../components/Header/Header";
//import cupon from "../../../public/assets/cupon.jpg";
import { useNavigate } from 'react-router-dom';

export const Main = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [idItem, setIdItem] = useState("");
  const [productsCart, setProductsCart] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        if (products !== null) {
          setAllProducts(products.data);
        }

        //showConfirm();
        if (location.state && location.state.productsSel.length > 0) {
          setProductsCart(location.state.productsSel);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [location.state]);

  // const showConfirm = () => {
  //   Modal.info({
  //     content: <img src={cupon} style={{ width: 550 }} />,
  //     onOk() {},
  //   });
  // };

  const handleSlideChange = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const addProduct = (idItem) => {
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
      setProductsCart([...productsCart, datos]);
    } else {
      const newProductsCart = productsCart.map((item) =>
        item.id === idItem
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              precio_total: (item.cantidad + 1) * item.precio,
            }
          : item
      );
      setProductsCart(newProductsCart);
    }
  };

  return (
    <div className="Main">
      <Header navigate={navigate} productsSel={productsCart} />
      <div
        id="carouselPrincipal"
        className="carousel slide"
        data-ride="carousel"
      >
        <ol className="carousel-indicators">
          {allProducts.map((product, index) => (
            <li
              key={index}
              data-target="#carouselPrincipal"
              data-slide-to={index}
              className={index === activeIndex ? "active" : ""}
              aria-current={index === activeIndex ? "true" : "false"}
              onClick={() => handleSlideChange(index)}
            ></li>
          ))}
        </ol>
        <div className="carousel-inner">
          {allProducts.map((item, index) => (
            <div
              key={index}
              className={`carousel-item ${
                index === activeIndex ? "active" : ""
              }`}
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="d-block w-100"
              />
              <div className="carousel-caption">
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <a
          className="carousel-control-prev"
          role="button"
          data-target="#carouselPrincipal"
          data-slide="prev"
          onClick={() =>
            handleSlideChange(
              (activeIndex - 1 + allProducts.length) % allProducts.length
            )
          }
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
        </a>
        <a
          className="carousel-control-next"
          role="button"
          data-target="#carouselPrincipal"
          data-slide="next"
          onClick={() =>
            handleSlideChange((activeIndex + 1) % allProducts.length)
          }
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
        </a>
      </div>
      <div className="products">
        <h2>Móviles</h2>
        <div className="row">
          {allProducts
            .filter((item) => item.type === "celular")
            .map((item) => (
              <div key={item._id} className="col-md-3 mb-3">
                <div className="card">
                  <img
                    className="img-card"
                    src={item.images[0]}
                    alt={item.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{"$" + item.price + " +iva"}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        addProduct(item._id);
                        setIdItem(item._id);
                      }}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <h2>Laptops</h2>
        <div className="row">
          {allProducts
            .filter((item) => item.type === "laptop")
            .map((item) => (
              <div key={item._id} className="col-md-3 mb-3">
                <div className="card">
                  <img
                    className="img-card"
                    src={item.images[0]}
                    alt={item.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{"$" + item.price + " +iva"}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        addProduct(item._id);
                        setIdItem(item._id);
                      }}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <h2>Almacenamiento</h2>
        <div className="row">
          {allProducts
            .filter((item) => item.type === "storage")
            .map((item) => (
              <div key={item._id} className="col-md-3 mb-3">
                <div className="card h-100">
                  <img
                    className="img-card"
                    src={item.images[0]}
                    alt={item.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{"$" + item.price + " +iva"}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        addProduct(item._id);
                        setIdItem(item._id);
                      }}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
