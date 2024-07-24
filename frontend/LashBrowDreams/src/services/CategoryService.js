import axios from "axios";
const BASE_URL = "http://localhost:81/lashbrowdreams/" + 'category';


class CategoryService {

    // Obtener todos los productos
    getCategories() {
        console.log('URL-> ' + BASE_URL);
        return axios.get(BASE_URL)
            .then(response => {
                //console.log("Lista de servicios:", response);
                return response.data;
            })
            .catch(error => {
                console.error("Error al obtener las categorías:", error);
                throw error;
            });
    }

    getCategoryById(id){
        return axios.get(`${BASE_URL}/id`)
            .then(response => {
                //console.log("Lista de servicios:", response);
                return response.data;
            })
            .catch(error => {
                console.error("Error al obtener las categorías:", error);
                throw error;
            });
    }
}

export default new CategoryService();