import axios from 'axios';

export const Register = async ( user ) => {
  const { username, password, email } = user;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}users/create`, 
      {
          email,
          username,
          password
      });
        alert("Usuario Creado");
        return response.data.data, true;
    } catch (error) {
      if (Request.status === 400) {
        alert("El usuario/email ya existe");
        return false;
      } else {
        alert("No se pudo registrar");
        console.log(error);
        return false;
      }
    }
  };

  export const updateCupon = async cupon => {
    console.log('CUPON', cupon);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API}users/update`, 
      {
          cupon
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      if (response.data.status === "OK") {
        //message.success('Cupón generado');
        return 'ok';
      } else if (response.data.status === "YA") {
        return 'ya'
      }
    } catch (error) {
        console.log(error);
        return 'error';
    }
  };

  export const validateCupon = async cupon => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API}users/validate`, 
      {
          cupon
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      console.log(response.data);
      if (response.data.status === "OK") {
        alert("Se aplicó su cupón");
        return true;
      } else if (response.data.status === "NO") {
        alert("cupón inválido");
        return false;
      }
    } catch (error) {
      alert("cupón inválido");
        console.log(error);
        return false;
    }
  };