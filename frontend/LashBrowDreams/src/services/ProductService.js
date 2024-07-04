import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams/" + 'product';

class ProductService {

  // Obtener todos los productos
  getProducts() {
    console.log('URL-> ' + BASE_URL);
    return axios.get(BASE_URL)
      .then(response => {
        console.log("Lista de productos:", response);
        return response.data;
      })
      .catch(error => {
        console.error("Error al obtener los productos:", error);
        throw error;
      });
  }

  getProductById(id) {
    return axios.get(BASE_URL + '/' + id)
      .then(response => {
        console.log("Detalle de productos:", response);
        return response.data;
      })
      .catch(error => {
        console.error("Error al obtener el producto:", error);
        throw error;
      });
  }
}

export default new ProductService();
