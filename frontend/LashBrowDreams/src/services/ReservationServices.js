import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams";

class ReservationServices {
  getReservationsByStoreAndUser(storeId, admin = null, customerId = null, date = null) {
    const params = { admin, customerId, date };
    return axios.get(`${BASE_URL}/reservation/getReservations/${storeId}`, { params })
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener las reservas:", error);
        throw error;
      });
  }

  getReservationById(id) {
    return axios.get(`${BASE_URL}/reservation/get/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener la reserva:", error);
        throw error;
      });
  }

  createReservation(data) {
    return axios.post(`${BASE_URL}/reservation/create`, data)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al registrar la reserva:", error);
        throw error;
      });
  }
}

export default new ReservationServices();
