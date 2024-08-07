import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams";

class ReservationServices {
  getReservationsByStoreAndUser(storeId, admin = null, customerId = null, date = null) {
    const params = { admin, customerId, date };
    return axios.get(`${BASE_URL}/reservation/getReservations/${storeId}`, { params })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("Error al obtener las reservas:", error);
        throw error;
      });
  }
}

export default new ReservationServices();
