import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams/billing";

class InvoiceService {
  getInvoiceListByStore(storeId, query = "") {
    const params = query ? { query } : {};
    return axios.get(`${BASE_URL}/index/${storeId}`, { params })
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener las facturas:", error);
        throw error;
      });
  }

  getInvoiceData(userID) {
    return axios.get(`${BASE_URL}/get/${userID}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener el detalle de la factura:", error);
        throw error;
      });
  }

  createInvoice(data) {
    return axios.post(`${BASE_URL}/create`, data)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
}

export default new InvoiceService();
