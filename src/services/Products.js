const axios = require("axios");
require("dotenv").config();

export const getAllProducts = async ( 
    title,
    descr,
    price 
    ) => {
    try {
        console.log(process.env.REACT_API);
      const response = await axios.get(
        `http://localhost:5000/api/v1/products/get-all`,
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