import logo from "../assets/GeekStore-Logo.png";
//import moment from "moment";

const templateProforma = (products, subtotal, iva, total, user) => {
  let productsDes = "";
  products.map((prod) => {
    productsDes += `
          <tr>
            <td>${prod.nombre}</td>
            <td>${prod.description}</td>
            <td>${prod.precio}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.precio_total}</td>
          </tr>
    `;
    return true;
  });

  const template = `
    <div>
    <div className="logo" 
      style="
        display: flex;
        padding-top: 10px;
        padding-bottom: 10px;
        justify-content: center;
        width: 600px;
      ">
      <img
        alt="Logo"
        src=${logo}
        style="
          width: 300px;
          height: 122px;"
      />
    </div>
    <div style="
      display: flex;
      justify-content: space-between;
      width: 600px;
      padding-bottom: 10px;
    ">
      <div style="
        display: flex;
        flex-direction: column;
      ">
        <b style="font-size: 20px; padding-bottom: 10px;">Cliente</b>
        <span><b>Nombre:  </b>${user ? user.username : "Invitado"}</span>
        <span><b>Correo:  </b>${user ? user.email : "Invitado"}</span>
        // <span><b>Fecha:  </b>${moment().format("DD-MM-YYYY HH:mm")}</span>
      </div>
      <div style="
        display: flex;
        flex-direction: column;
      ">
        <b style="font-size: 20px; padding-bottom: 10px;">Nuestra empresa</b>
        <span style="font-size: 30px"><b>"INNOVGEEK"</b></span>
        <span><b>Dirección:</b> Humberto Albornoz N3564 y Fulgencio Araujo</span>
        <span><b>Celular:</b> 0982154010</span>
        <span><b>Télefono:</b> 023201576</span>
        <span><b>Instagram:</b> @innovgeekec</span>
        <span>Quito - Ecuador</span>
      </div>
    </div>
    <div style="display: flex; justify-content: center; padding-bottom: 10px;">
      <span style="font-size: 30px"><b>PROFORMA</b></span>
    </div>
    <div>
    <table style="width: 600px;" border="1">
    <tbody>
      <tr>
        <td>Producto</td>
        <td>Descripcion</td>
        <td>Precio unitario</td>
        <td>Cantidad</td>
        <td>Total</td>
      </tr>
      ${productsDes}
      <tr>
        <td colspan="3"></td>
        <td>Subtotal:</td>
        <td>${subtotal}</td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td>Subtotal:</td>
        <td>${iva}</td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td>Subtotal:</td>
        <td>${total}</td>
      </tr>
        </tbody>
      </table>
    </div>
    </div>`;
  return template;
};

export { templateProforma };
