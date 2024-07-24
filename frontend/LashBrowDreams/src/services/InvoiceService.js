import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams/" + 'billing';

class InvoiceService {

  // Get all invoices
  getInvoiceList() {
    return axios.get(BASE_URL)
      .then(response => {
        console.log("Lista de facturas:", response.data);
        return response.data;
      })
      .catch(error => {
        //console.error("Error al obtener las facturas:", error);
        throw error;
      });
  }

  getInvoiceData(userID) {
    return axios.get(BASE_URL + '/' + userID)
      .then(response => {
        //console.log("Lista de facturas:", response.data);
        return response.data;
      })
      .catch(error => {
        //console.error("Error al obtener las facturas:", error);
        throw error;
      });

  }


}

export default new InvoiceService();