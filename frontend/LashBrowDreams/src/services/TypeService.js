import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams/" + 'type';


class TypeService {

    // Obtener todos los productos
    getTypes() {
        return axios.get(BASE_URL)
            .then(response => {
                //console.log("Lista de servicios:", response);
                return response.data;
            })
            .catch(error => {
                console.error("Error al obtener los tipos:", error);
                throw error;
            });
    }
}

export default new TypeService();