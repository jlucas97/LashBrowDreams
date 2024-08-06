import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams/" + 'reservation';


class ReservationServices {

    // Obtener todos los productos
    getReservations($id) {
        return axios.get(BASE_URL + "/" + $id)
            .then(response => {
                //console.log("Lista de servicios:", response);
                return response.data;
            })
            .catch(error => {
                console.error("Error al obtener las reservaciones:", error);
                throw error;
            });
    }

    getReservationsByStoreAndUser(storeId, userId) {
        return axios.get(`${BASE_URL}reservation/${storeId}/${userId}`)
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