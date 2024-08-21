import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams/billing";

class InvoiceService {
  // Obtener facturas por tienda
  getInvoiceListByStore(storeId, query = "") {
    const params = query ? { query } : {};
    return axios.get(`${BASE_URL}/index/${storeId}`, { params })
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener las facturas:", error);
        throw error;
      });
  }

  // Obtener facturas por usuario
  getInvoiceListByUser(userEmail, query = "") {
    const params = query ? { query } : {};
    return axios.get(`${BASE_URL}/index/${userEmail}`, { params })
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener las facturas por usuario:", error);
        throw error;
      });
  }

  // Obtener facturas de tipo Proforma para un usuario específico
  getProformasByUser(userEmail) {
    const params = { type: 'Proforma' };
    return axios.get(`${BASE_URL}/getProformasByUser/${userEmail}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener las proformas:", error);
        throw error;
      });
  }

  // Obtener los datos de una factura específica
  getInvoiceData(userID) {
    return axios.get(`${BASE_URL}/get/${userID}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener el detalle de la factura:", error);
        throw error;
      });
  }

  // Crear una nueva factura
  createInvoice(data) {
    return axios.post(`${BASE_URL}/create`, data)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
}

export default new InvoiceService();
