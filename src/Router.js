import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

//Components
import Main from './pages/Main';
import Cart from './pages/Cart';
//import Factura from './pages/Report';
//import DetallesFactura from './pages/incident-detail';
//import Thanks from './pages/Thanks';
//import {PrivateRoute} from './services/PrivateRoute';
//import Pagina404 from "./Pagina404/Pagina404";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/cart" component={Cart} />
      <Redirect from="/*" to="/" />
    </Switch>
  </BrowserRouter>
);

export default Router;
