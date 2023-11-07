import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootswatch/dist/superhero/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Main} from './pages/Main/Main';
import {Cart} from './pages/Cart/Cart';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route from="/*" element={<Main/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
