import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams";

class UserService {
  getUserOnSearchBar(id) {
    return axios.get(`${BASE_URL}/user/${id}`)
      .then(response => {
        console.log("User API response:", response); // Log the API response
        return response.data;
      })
      .catch(error => {
        console.error("Error al obtener el usuario:", error);
        throw error;
      });
  }
}

export default new UserService();
