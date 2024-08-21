import axios from "axios";

const BASE_URL = "http://localhost:81/lashbrowdreams";

class ScheduleService {
  
  // Obtener horarios por tienda
  getSchedulesByStore(storeId) {
    return axios.get(`${BASE_URL}/schedule/getSchedulesByStore/${storeId}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al obtener los horarios:", error);
        throw error;
      });
  }

  // Crear un nuevo horario
  createSchedule(schedule) {
    console.log("Enviando datos al servidor:", schedule);
    return axios.post(`${BASE_URL}/schedule/createSchedule`, schedule)  // Cambia a /schedule/createSchedule
      .then(response => {
        console.log("Respuesta del servidor:", response.data);
        return response.data;
      })
      .catch(error => {
        console.error("Error al crear el horario:", error);
        throw error;
      });
}


  updateSchedule(eventId, data) {
    if (!eventId) {
      console.error("Event ID is undefined for update");
      return Promise.reject(new Error("Event ID is undefined"));
    }
    return axios.put(`${BASE_URL}/schedule/update/${eventId}`, data)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al actualizar el horario:", error);
        throw error;
      });
  }

  

  // Eliminar un horario
  deleteSchedule(id) {
    return axios.delete(`${BASE_URL}/schedule/deleteSchedule/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al eliminar el horario:", error);
        throw error;
      });
  }
}

export default new ScheduleService();
