import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams/" + 'service';


class ServiceServices {

    // Obtener todos los productos
    getServices() {
        console.log('URL-> ' + BASE_URL);
        return axios.get(BASE_URL)
            .then(response => {
                //console.log("Lista de servicios:", response);
                return response.data;
            })
            .catch(error => {
                console.error("Error al obtener los servicios:", error);
                throw error;
            });
    }

    getServiceById(id) {
        return axios.get(BASE_URL + '/' + id)
            .then(response => {
                //console.log("Detalle de servicios:", response);
                return response;
            })
            .catch(error => {
                console.error("Error al obtener el producto:", error);
                throw error;
            });
    }
}

export default new ServiceServices();