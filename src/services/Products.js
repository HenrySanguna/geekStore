import axios from 'axios';

export const getAllProducts = async ( 
    title,
    descr,
    price 
    ) => {
    try {
      console.log(import.meta.env.VITE_API);
      const response = await axios.get(
        `${import.meta.env.VITE_API}products/get-all`,
        {
            title,
            price,
            descr
        },
        {headers: {
          'Content-Type': 'application/json'
            }
        }
      );
      console.log('response', response.data);
  
      return response.data;
    } catch (error) {
      console.log('Active Orders', error.message);
      return null;
    }
  };